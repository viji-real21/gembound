# Claude Code tool inventory and constrained aliases

Checked 2026-08-26 against the locally installed `claude` executable, version
`2.1.234`, and the current Claude Code documentation. This is deliberately an
inventory rather than an assumption that a documentation page and a locally
installed release expose the same feature-gated tool set.

## Sources and scope

- Live CLI: `claude --version`, `claude --help`, plus identifiers embedded in
  the installed native executable. `--help` exposes `--tools`,
  `--allowedTools`, and `--disallowedTools`, but it does **not** print a full
  built-in-tool roster. The executable identifiers below are therefore the
  local-release inventory; a few are legacy/internal compatibility names, not
  a claim that every one is enabled in every session.
- [Claude Code settings](https://code.claude.com/docs/en/settings): the
  requested settings page. It documents settings scopes, command-line
  precedence, and `permissions.allow`/`permissions.deny`; it does not itself
  publish a complete built-in tool table. Its linked
  [Tools reference](https://code.claude.com/docs/en/tools-reference) is the
  documentation roster below.
- The docs are newer than this installed CLI in places (for example,
  `SendMessage` is documented as requiring v2.1.236), so these lists are kept
  distinct and the aliases deny their union.

## Enumerated names

| Source | Names |
| --- | --- |
| Live CLI 2.1.234 identifiers | `Agent`, `AskUserQuestion`, `Bash`, `BashOutput`, `Computer`, `Edit`, `EnterPlanMode`, `EnterWorktree`, `ExitPlanMode`, `ExitWorktree`, `Glob`, `Grep`, `KillShell`, `LSP`, `ListMcpResources`, `ListMcpResourcesTool`, `Monitor`, `NotebookEdit`, `PowerShell`, `Read`, `ReadMcpResource`, `ReadMcpResourceTool`, `SendMessage`, `ShareOnboardingGuide`, `Skill`, `Task`, `TaskCreate`, `TaskGet`, `TaskList`, `TaskOutput`, `TaskStop`, `TaskUpdate`, `TeamCreate`, `TeamDelete`, `TodoWrite`, `ToolSearch`, `WebFetch`, `WebSearch`, `Write` |
| Current documentation roster | `Agent`, `Artifact`, `AskUserQuestion`, `Bash`, `CronCreate`, `CronDelete`, `CronList`, `Edit`, `EndConversation`, `EnterPlanMode`, `EnterWorktree`, `ExitPlanMode`, `ExitWorktree`, `Glob`, `Grep`, `ListAgents`, `ListMcpResourcesTool`, `LSP`, `Monitor`, `NotebookEdit`, `PowerShell`, `PushNotification`, `Read`, `ReadMcpResourceTool`, `RemoteTrigger`, `ReportFindings`, `ScheduleWakeup`, `SendMessage`, `SendUserFile`, `ShareOnboardingGuide`, `Skill`, `TaskCreate`, `TaskGet`, `TaskList`, `TaskOutput`, `TaskStop`, `TaskUpdate`, `TodoWrite`, `ToolSearch`, `WaitForMcpServers`, `WebFetch`, `WebSearch`, `Workflow`, `Write` |

## Alias policy

The managed profile is `/Users/vedhith/.zshrc`, alongside the existing
`claude-glm` alias. It now defines:

- `claude-research`: keeps only `WebSearch` from the union above.
- `claude-audit`: keeps only `Read`, `Glob`, and `Grep`.
- `claude`: remains the existing session-naming shell function, unchanged.

Both constrained aliases also pass `--strict-mcp-config` and
`--disable-slash-commands`, preventing configured MCP tools and skills from
adding a separate capability path. They use `command claude` so they bypass
the normal session-naming wrapper without changing that wrapper.

The aliases use **bare-name** `--disallowedTools` entries, never
`--allowedTools`. The documented behavior is:

| Configuration mechanism | Effect |
| --- | --- |
| Settings `permissions.deny` / bare `--disallowedTools` | Enforces removal from context when the rule is a bare tool name. A scoped deny such as `Bash(rm *)` instead enforces rejection only for matching calls and leaves `Bash` visible. |
| Subagent frontmatter `tools` | Enforces the subagent's available tool set; `disallowedTools` wins when both appear. |
| `--tools` | Enforces built-in availability by omitting unlisted built-ins, but is intentionally not used for these aliases. |
| `allowedTools` / settings `permissions.allow` | Only pre-approves matching calls. It does not restrict availability. |
| Skill frontmatter `allowed-tools` | Only pre-approves matching calls while that skill runs; it does not restrict the session's tool set. |

For the availability rule, see [Configure custom tools](https://code.claude.com/docs/en/agent-sdk/custom-tools) and [permission evaluation](https://code.claude.com/docs/en/agent-sdk/permissions): a bare deny removes the named tool before permission evaluation; a scoped deny is merely a rejected call.

## No-quota verification

Verification intentionally uses only local CLI parsing/help, not an interactive
or `--print` session, so no Claude request or quota was spent:

1. `zsh -ic 'claude-research --help'` and
   `zsh -ic 'claude-audit --help'` both exit successfully, proving the aliases
   expand to a launchable Claude CLI invocation.
2. Their expanded `--disallowedTools` lists were mechanically compared with
   the source union: research leaves exactly `WebSearch`; audit leaves exactly
   `Read`, `Glob`, and `Grep`.
3. This is an **availability** verification, not a test of a permission error:
   every excluded built-in is a bare name. Per the cited Claude documentation,
   those names are absent from context before a model can attempt a call.

Because aliases are an explicit deny-list snapshot, rerun the comparison after
upgrading Claude Code or when Anthropic adds a documented built-in tool.
