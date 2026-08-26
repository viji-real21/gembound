#!/usr/bin/env python3
"""Fail-closed commit-message gate for paths listed in CODEOWNERS."""

from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

OVERRIDE_PREFIX = "OWNERSHIP-OVERRIDE: "


def fail(message: str) -> None:
    print(f"ownership gate: {message}", file=sys.stderr)
    raise SystemExit(1)


def repo_root() -> Path:
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            check=True,
            capture_output=True,
            text=True,
        )
    except (OSError, subprocess.CalledProcessError) as error:
        fail(f"cannot determine repository root ({error})")
    return Path(result.stdout.strip())


def parse_codeowners(path: Path) -> list[str]:
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as error:
        fail(f"cannot read {path} ({error})")

    patterns = []
    for line in lines:
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        fields = stripped.split()
        if len(fields) < 2:
            fail(f"invalid CODEOWNERS entry: {line!r}")
        patterns.append(fields[0])
    return patterns


def pattern_matches(pattern: str, path: str) -> bool:
    """Match the CODEOWNERS pattern forms used by GitHub, rooted at the repo."""
    anchored = pattern.startswith("/")
    normalized = pattern.lstrip("/")
    directory = normalized.endswith("/")
    normalized = normalized.rstrip("/")
    if not normalized:
        fail(f"invalid CODEOWNERS pattern: {pattern!r}")

    expression = re.escape(normalized)
    expression = expression.replace(r"\*\*", ".*")
    expression = expression.replace(r"\*", "[^/]*")
    expression = expression.replace(r"\?", "[^/]")
    suffix = r"(?:/.*)?" if directory else ""
    if anchored or "/" in normalized:
        return re.fullmatch(expression + suffix, path) is not None
    return any(re.fullmatch(expression + suffix, candidate) for candidate in path.split("/"))


def staged_paths() -> list[str]:
    try:
        result = subprocess.run(
            ["git", "diff", "--cached", "--name-status", "-z", "--find-renames"],
            check=True,
            capture_output=True,
        )
    except (OSError, subprocess.CalledProcessError) as error:
        fail(f"cannot inspect staged changes ({error})")

    fields = result.stdout.split(b"\0")
    paths: list[str] = []
    index = 0
    while index < len(fields) - 1:
        status = fields[index].decode("utf-8", "surrogateescape")
        index += 1
        if not status:
            continue
        if index >= len(fields) - 1:
            fail("malformed staged-change record")
        paths.append(fields[index].decode("utf-8", "surrogateescape"))
        index += 1
        if status[0] in {"R", "C"}:
            if index >= len(fields) - 1:
                fail("malformed rename/copy record")
            paths.append(fields[index].decode("utf-8", "surrogateescape"))
            index += 1
    return paths


def main() -> int:
    if len(sys.argv) != 2:
        fail("commit message file was not provided")

    root = repo_root()
    patterns = parse_codeowners(root / "CODEOWNERS")
    try:
        message = Path(sys.argv[1]).read_text(encoding="utf-8")
    except OSError as error:
        fail(f"cannot read commit message ({error})")

    required = set()
    for path in staged_paths():
        # CODEOWNERS applies the last matching rule to a path.
        matching = [pattern for pattern in patterns if pattern_matches(pattern, path)]
        if matching:
            required.add(matching[-1])
    missing = sorted(
        pattern for pattern in required if f"{OVERRIDE_PREFIX}{pattern}" not in message
    )
    if missing:
        print("ownership gate: commit touches owned path(s).", file=sys.stderr)
        print("Add one exact token per path to the commit message:", file=sys.stderr)
        for pattern in missing:
            print(f"  {OVERRIDE_PREFIX}{pattern}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
