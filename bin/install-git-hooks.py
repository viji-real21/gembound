#!/usr/bin/env python3
"""Install repository-managed Git hooks through pre-commit."""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    pre_commit = shutil.which("pre-commit")
    if pre_commit is None:
        print("pre-commit is required to install git hooks", file=sys.stderr)
        return 1
    try:
        subprocess.run(
            [pre_commit, "install", "--hook-type", "commit-msg"],
            cwd=root,
            check=True,
        )
    except subprocess.CalledProcessError as error:
        return error.returncode or 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
