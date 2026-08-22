# Public.com agentic brokerage — arbitrage feasibility

*Researched 2026-08-22. Assumption: "Publix" = **Public.com** (the NY brokerage), not the grocery chain. All facts sourced below; rates change, re-verify before committing capital.*

---

## 1. Verdict first

| Question | Answer |
|---|---|
| True (risk-free, latency) arbitrage? | **No.** REST-only, 10 req/sec, no confirmed streaming feed, retail internet RTT. Wall Street arb is sub-microsecond on colocated hardware. Structurally impossible. |
| Cross-venue crypto arb? | **No.** 0.60% each way (0.10% at top volume tier) = 20–120 bps round trip. Cross-exchange spreads are <10 bps. Dead by an order of magnitude. |
| Options rebate harvesting? | **Explicitly prohibited.** Rebate T&C §2(e): Public can claw back rebates if "your trading was expressly intended to harvest the rebate." |
| Anything genuinely edge-positive? | **Yes, four things** — see §5. All are *slow, capacity-limited relative-value* trades, not arbitrage in the HFT sense. |
| Can this be a business? | **No.** "The Public Individual API is for your own personal, non-commercial use." Running it for others breaks the ToS. |
| Can an agent pick LIT vs smart vs wholesale per order? | **No** — route selection is a UI-only, per-order control; the API place-order body has no route field (§3a). Workaround: one brokerage account per route, agent picks the account. |
| Are Public's own AI Agents a substitute for the API? | **For the edges, no.** They're a real rules engine (indicators, multi-leg, shorting, event-chains) but have **no routing control, no self-set account caps, no paper trading, and a written disclaimer covering any trade that "fails to be triggered."** Great for cash sweeps and covered-call lifecycles; unusable for thin-margin edges (§6). |

**The honest reframe:** you cannot build an HFT desk on Public. You *can* build a systematic relative-value desk that harvests structural inefficiencies too small and slow for real firms to bother with. That is where a solo operator with good agents actually wins.

---

## 2. What Public actually shipped (changelog, annotated)

Source: `public.com/api/docs/changelog`. Annotations = what each change does or doesn't unlock.

| Date | Change | Arb relevance |
|---|---|---|
| 2025-06-17 | API launch, auth | — |
| 2025-06-24 | **Preflight endpoints** (single + multi-leg) — estimate financial impact before placing | ⭐ Lets an agent price total cost incl. fees *before* committing. Essential for any thin-margin strategy. |
| 2025-10-17 | Python SDK | — |
| 2025-11-06 | **Crypto via Zerohash** | Same account as equities → cross-asset trades without wire transfers. |
| 2025-11-12 | Crypto precision on instrument endpoint | Needed for exact-size orders. |
| 2025-11-24 | **Crypto fees 1.2% → 0.6% each way**; batch Greeks endpoint | Still 10× too expensive for crypto arb. Batch Greeks = cheap portfolio risk. |
| 2026-01-26 | Crypto notional limit orders | Dollar-sized entries. |
| 2026-02-02 | **Rate limit 5 → 10 req/sec, per account** | ⭐ *Per account*, and multi-account landed 2026-05-20 → throughput scales linearly with accounts. Still nowhere near tick-level. |
| 2026-02-09 | Agent skill for Claude Code / Open Claw | You can drive it from this terminal. |
| 2026-02-16 | Options positions `-OPTION` suffix (later reverted to OSI) | Watch for parser breakage. |
| 2026-02-26 | **PUT = edit/replace live order** (crypto, options) | ⭐ Order *chasing* without cancel/replace race. Halves round trips against the rate limit. |
| 2026-03-09 | **MCP server** + Perplexity skill | LLM-native access. |
| 2026-03-25 | **Bonds: corporate + treasuries**, `type: BOND`; Greeks on option chain | ⭐ Unlocks the two best real strategies (§5.1, §5.2). |
| 2026-03-26 | Cancel/replace for equities | Completes order chasing. |
| 2026-04-10 | **Tiered crypto fees 0.60% → 0.10%** by monthly volume | Best case still 20 bps round trip. |
| 2026-04-23 | **Short selling** (open + close) | ⭐ Required for any true relative-value pair. Borrow fees apply. |
| 2026-04-29 | CLI | — |
| 2026-05-07 | Bars v2, 1 day–5 years OHLCV | Backtest data, but daily/intraday bars only — not tick. |
| 2026-05-19 | **Multi-leg strategy quote endpoint** | ⭐ One quote for a whole spread → prices a box spread in one call instead of four. Directly enables §5.1. |
| 2026-05-20 | **Multiple brokerage accounts per user** | Rate limit is per-account → parallel throughput. |
| 2026-05-21 | Stop-limit for equities | Risk control. |
| 2026-06-16 | **`useMargin` flag on orders**; history to `TEN_YEARS`/`ALL` | Explicit leverage control per order. |
| 2026-06-25 | **Hosted MCP** (Claude, ChatGPT) — no local server | Lowers agent setup to zero. |
| 2026-07-02 | **24/5 trading**: `equityMarketSession: TWENTY_FOUR_HOURS` | ⭐ Overnight equities + 24/7 crypto in one account (§5.3). |
| 2026-07-20 | **Tax-lot selling** — view unrealized lots, choose lots on close | ⭐ Programmatic tax-loss harvesting (§5.4). |
| 2026-08-05 | **Bond search + bond details** endpoints | ⭐ Screen the corporate bond universe programmatically (§5.2). |
| 2026-08-11 | Hosted MCP → Claude Code guide | — |

**Read of the roadmap:** Public spent 2026 turning a toy API into a real multi-asset OMS — multi-leg, shorting, margin control, bonds, tax lots, 24/5. What it has *not* built: streaming market data, depth of book, sub-100ms anything. That gap is the whole story. They are building an **execution** platform for slow strategies, not a trading platform for fast ones.

---

## 3. The cost stack (this decides everything)

### Equities — three routes, your choice
| Route | Cost | Behaviour |
|---|---|---|
| **Wholesale** (default) | $0 | Internalizers (Citadel/Virtu-type). Best for small marketable orders — price improvement usually exceeds 0.3¢/share. |
| **Smart** | **$0.003/share** | Exchanges + ATS + single-dealer platforms, venue-scored routing. |
| **LIT** | **$0.003/share** | Major stock exchanges only, full pre-trade transparency. |

Verbatim, [fee schedule](https://public.com/disclosures/fee-schedule) (eff. 2026-07-16, re-verified 2026-08-22): *"Customers placing an equity order through their **self-directed Public Investing brokerage account** can select how their order is routed. Certain route elections may incur an execution fee."* — Wholesale $0, Smart Order $0.003/share, **Lit Exchanges Only $0.003/share (live, no longer "coming soon")**. Public keeps PFOF on wholesale only; on Smart/LIT it takes no PFOF but may keep exchange/venue rebates.

**Excluded from route selection entirely:** OTC securities, Investment Plans, Direct Index accounts, Generated Assets accounts — *"Public Investing will select the appropriate route for such orders."*

> ### ⚠️ 3a. The routing hole — route selection is NOT in the API *(added 2026-08-22)*
>
> The documented [place-order](https://public.com/api/docs/resources/order-placement/place-order) request body is: `orderId`, `instrument`, `orderSide`, `orderType`, `expiration`, `quantity`, `amount`, `limitPrice`, `stopPrice`, `equityMarketSession`, `openCloseIndicator`, `useMargin`, `taxLotMatchingInstructions`. **There is no `route` / `venue` / `routing` field, and no routing endpoint anywhere in the API surface.** The changelog has never once mentioned routing.
>
> So the route is a **UI-layer, per-order** control on a human-placed order. An API order — and therefore *any* agent order — takes whatever the account default is. **You cannot programmatically switch to LIT for the passive leg and back to wholesale for the marketable leg.** That was the single most useful piece of execution control in §3 and it is unavailable to the exact operator this document is written for.
>
> **What this breaks:** §3's "passive resting limit orders → LIT" advice is *unbuildable* through the API today. A resting limit order sent to a wholesaler is not displayed, so the whole idea of earning the spread instead of paying it dies unless the account default is LIT — in which case you pay 0.3¢ on **every** order including the marketable ones, where wholesale price improvement usually beats it.
>
> **The workaround, and it is a real one — multi-account (2026-05-20).** Route selection sits on the *account*, and one user may hold several brokerage accounts. So: **Account A defaulted to wholesale = the taking account; Account B defaulted to LIT = the providing account.** Route becomes a routing *decision at the account level* rather than the order level, which is 90% of the value: your agent picks the account, not the venue. It also doubles the 10 req/s budget. Confirm the default is settable per account, and that it persists for API-originated orders, **before** modelling any strategy that depends on displayed liquidity.
>
> **First call to make:** ask Public support two questions in writing — (1) which route do API-placed equity orders take, and is it the account's UI setting? (2) can the default differ per brokerage account under one user? Every §5 cost model that assumes displayed passive fills is unverified until those answers land.

**Which to use, per strategy:**
- Small marketable orders (< ~500 sh) → **wholesale**. Free, and internalizer price improvement typically beats the 0.3¢ you'd pay elsewhere.
- Passive/resting limit orders you want *displayed* → **LIT**. Wholesalers won't display your order; on a lit exchange you can actually earn the spread. The 0.3¢ is the price of being a liquidity provider instead of a liquidity taker.
- **Never** smart or LIT for large marketable orders — you pay the fee *and* eat signalling risk (your intent is broadcast to competing participants).

The real lesson: LIT/smart exists so *informed* flow can avoid adverse selection at the wholesaler. If your strategy has genuine short-horizon alpha, wholesalers will price you worse over time; LIT is your escape hatch. If your strategy has no short-horizon alpha, wholesale is free money. **Route choice is itself a diagnostic of whether your edge is real.**

### Options — the rebate table (verbatim from the T&C PDF)
| Channel / underlying | Tier 1 | Tier 2 | Tier 3 | Tier 4 (max) |
|---|---|---|---|---|
| Platform — QQQ / SPY / IWM | $0.06 (30%) | $0.06 | $0.06 | **$0.10 (50%)** |
| Platform — all other stock/ETF | $0.06 (16%) | $0.10 (27%) | $0.14 (39%) | **$0.18 (50%)** |
| **API — all stock/ETF** | **$0.06 (16%)** | $0.06 | $0.06 | **$0.10 (27%)** |

- **Index options (SPX, NDX, VIX, XSP) earn NO rebate** and cost **$0.35–$0.50/contract**.
- Volume tiers: 1,000–4,999 contracts/mo → Tier 2; 5,000–9,999 → Tier 3; 10,000+ → Tier 4, each lasting the rest of that month plus the next full month.
- Dollar figures assume Public earns $0.36 net PFOF per API contract (as of 2025-06-03).

**Killer clause — §2 of Additional Terms.** Public may "refuse or recover any rebates" if it decides, *in its sole discretion*, that "(e) Your trading was expressly intended to harvest the rebate" or "(f) You are placing trades for reasons other than legitimate investing purposes," with **no obligation to give notice or explain**. Any strategy whose P&L is primarily rebate is therefore not a strategy — it's an unsecured loan from Public that they can recall. Treat the rebate as a **cost reducer on trades you'd make anyway**, never as the edge.

### Crypto
0.60% each way, tiering down to 0.10% at high monthly volume. Zerohash custody. Transfers in/out supported (network fee + $0.53 KYT fee); **New York residents cannot transfer crypto in or out**. Even at the 0.10% tier, 20 bps round trip is ~20× a typical cross-exchange spread.

### Cash & margin
Cash sweep **~3.3% APY** (as of 2026-06-11), no minimums, no hold period.

**Margin, now sourced (2026-08-22):** base **4.90%**, tiering down to **~3.95%** at large balances (Public's own comparison page, benchmarked 2026-07-14). Interest accrues daily (rate ÷ 365 × balance), charged monthly. Tier breakpoints are still unpublished.

**This kills the obvious carry trade, and it's worth showing the arithmetic:**

| Leg | Rate |
|---|---|
| Borrow on margin | **−4.90%** |
| Bond Account YTW (10 corporate bonds, medium credit) | **+5.00–5.50%** |
| Gross carry | **+0.10 to +0.60%** |
| Less bond markup, $0.10–0.50 per $100 par, amortised | **−0.10 to −0.50%/yr on a 1yr hold** |
| **Net** | **≈ 0.00% — and you're long credit + duration with borrowed money** |

Borrowing at 4.9% to hold medium-credit corporates at 5.5% is picking up ~50 bps to take default risk and duration risk on leverage. That is the structure that blows up in every credit cycle, for a spread narrower than the markup. **Dead on arrival.**

---

## 4. What kills each classic arb

| Classic strategy | Why it dies here |
|---|---|
| Latency / SIP-vs-direct-feed arb | REST, 10 req/s, no colocation, no direct feeds. Off by ~6 orders of magnitude. |
| Cross-exchange crypto arb | 20–120 bps round trip vs <10 bps spreads. |
| ETF create/redeem (NAV) arb | Requires Authorized Participant status. Not available to any retail broker. |
| Index-options market making | No rebate on index options + $0.35–0.50/contract + no quote-update speed. |
| Merger/risk arb | Not a data problem — it's a legal-analysis problem. *Actually accessible* (see §5 note). |
| Rebate farming | Contractually prohibited, clawback-able, silent account action. |
| Statistical arb at scale | Possible, but PDT rule caps you at 3 day-trades/5 days under $25k equity; and the API is personal-use only. |

---

## 5. The four edges that survive

Ranked by expected Sharpe per unit of effort.

### 5.1 Box-spread rate arbitrage ⭐ best candidate
**Trade:** buy a long box on a **European-settled index** (SPX/XSP/NDX — no early assignment risk) = lending money to expiry at the implied box rate. Compare that implied rate to Public's 3.3% cash sweep and to the treasury yields now tradeable via the bond endpoints.

- If implied long-box yield > 3.3% sweep + fees → **risk-free pickup**, fully collateralized, no directional exposure.
- Reverse (short box) = borrowing; only worth it if box borrow rate < what you can earn on the cash.

**Why it's newly possible:** the multi-leg strategy quote endpoint (2026-05-19) prices all four legs in one call, and treasuries via API (2026-03-25) give you the competing rate in the same account. Before May 2026 you'd burn 4 of your 10 req/sec just to price one box.

**Cost model:** 4 legs × $0.35–0.50 = **$1.40–2.00 per box** + exchange fees. On a 100-wide SPX box ($10,000 notional) that's ~15–20 bps one-time. So:
- 1-month box: 20 bps cost = **2.4%/yr drag → not viable.**
- 6-month box: 20 bps = 0.4%/yr drag → viable if the rate gap is >50 bps.
- 12-month box: 20 bps = 0.2%/yr drag → **viable at any real gap.**

**Falsification test (do this first, no capital):** poll SPX box quotes at 6/9/12-month expiries daily for two weeks, compute implied rate, subtract full fee model, compare to sweep + T-bill. If the median gap is under 40 bps, kill the idea. This is a one-week, zero-risk experiment and it either validates or ends the whole thesis.

**Risks:** Reg-T margin treatment of boxes at Public (they may not net the legs — ask before sizing); leg-in risk if the multi-leg order doesn't fill atomically; a long box is capital-*consuming*, so you need real cash to earn a real dollar amount. **1% on $10k is $100/yr.** This is a scale-limited edge.

### 5.2 Odd-lot corporate bond relative value ⭐ best *inefficiency*
Retail-size corporate bond lots are genuinely, persistently mispriced against the same issuer's round lots and against the treasury curve — because no institution will bother with a $5k clip. The bond **search + details endpoints (2026-08-05)** are two weeks old; almost nobody has scanned them systematically yet.

**The agent job:** pull the bond universe, parse each instrument (coupon, maturity, call schedule, seniority, rating), build an issuer-level yield curve, and flag bonds whose yield-to-worst sits >X bps off their own issuer's curve after adjusting for call optionality and duration.

**Why LLM agents are the right tool here and nowhere else:** the hard part is not math, it's *reading* — call schedules, make-whole provisions, covenant language, ratings-change news, whether a "2029 maturity" is actually a 2027 call. That's language work, and language work is exactly what an LLM does better than a quant screen. Everywhere else in this document, the LLM should stay out of the pricing loop.

**Realistic edge:** 30–150 bps of yield pickup on comparable credit risk. Slow, capacity-limited to maybe six figures, non-competitive with anyone. **This is the most "unfair advantage" item on the list.**

> **⚠️ Downgrade (2026-08-22): do NOT run this on Public's fractional bonds.** Public's **Fractional Bonds are a single-dealer market — Moment Markets is the sole counterparty**, quoting both sides. They **cannot be transferred out** to any other brokerage, and Public's own disclosure warns *"there is a risk you may not be able to exit a fractional bond position if there is not a willing buyer."* Public charges its own fee on top ($0.10–0.50 per $100 par) and does **not** publish Moment's spread separately, so total cost is a disclosed fee **plus an unobservable markup**.
>
> You cannot arbitrage a mispricing against the dealer who *sets* the mispricing, on an instrument you can only sell back to that same dealer. The odd-lot inefficiency is real in the wider market; **on Public's fractional rail it is the dealer's margin, not your edge.**
>
> **What survives:** the strategy must use **whole bonds** (corporates + treasuries, live since 2026-03-25, screenable since 2026-08-05), where you're at least facing a real multi-dealer market. Public's own logic already prefers whole bonds when they price better. Note whole bonds carry higher minimums than the $100 fractional entry, so this needs real capital to express.

### 5.3 Overnight crypto ↔ equity-proxy convergence
Public is one of very few places holding **24/7 crypto and 24/5 equities in one account with one API**. During the overnight session (8pm–4am ET, Blue Ocean ATS — limit orders only, session-only, thin), crypto-proxy equities (IBIT, MSTR, COIN) routinely diverge >1% from where spot BTC says they should be, because the equity book is nearly empty while crypto keeps trading.

**Trade:** compute the implied fair value of the proxy from live BTC, and post *passive limit orders* on the equity leg during the overnight session when the divergence exceeds the cost threshold.

**Cost threshold:** if you hedge with the crypto leg, you pay 20–120 bps and the edge mostly vanishes. **So don't hedge.** Trade the equity leg alone as a mean-reversion bet — which makes it a **statistical convergence trade, not arbitrage.** Be honest about that: it carries real overnight gap risk.

**Constraints:** Blue Ocean accepts limit day orders only, and they do not carry to the next session — your agent must re-post nightly. Fills are unreliable; assume 20–40% fill rates.

**§3a downgrade:** this strategy is *entirely* passive resting limit orders, so it is the one most damaged by the routing hole. If API orders default to wholesale, your overnight limit is never displayed and the 20–40% fill assumption is optimistic fiction. Resolve the route question (§3a) **before** this strategy, not after — it may be the thing that kills it.

### 5.4 Programmatic tax-lot alpha (not arbitrage, but the most reliable money here)
The tax-lot endpoints (2026-07-20) let an agent see every unrealized lot and choose which to sell. Systematic loss harvesting at the lot level is worth a well-documented **~0.5–1.5%/yr after-tax** on a taxable account, and unlike everything above, its return does not depend on beating anyone.

**Agent job:** daily scan of unrealized lots, harvest losses above a threshold, respect the 30-day wash-sale window across *all* accounts (this is where naive implementations break — the wash rule spans your IRA too), swap into a correlated-but-not-substantially-identical proxy.

**If you only build one thing, and you have a taxable account with real money in it, build this one.** Highest certainty, lowest cleverness required.

---

## 6. Architecture: what a near-institutional agent stack looks like here

The single most important design decision: **Public's API is an OMS, not a market data feed.** Real firms separate these; you must too. Using Public's REST quotes as your signal source is the mistake that kills retail systematic trading — you'd be trading on 100ms-stale data through a 10 req/s straw.

```
┌─ DATA (not Public) ──────────────────────────────────────┐
│  Equities/overnight: Databento (Blue Ocean MEMOIR depth) │
│  Crypto: native exchange websockets (free, real-time)    │
│  Reference/corp actions: filings + issuer data           │
└──────────────────────────────────────────────────────────┘
                          ↓
┌─ SIGNAL (deterministic code, NO LLM) ────────────────────┐
│  Box implied-rate solver · issuer curve fitter           │
│  Proxy fair-value model · wash-sale state machine        │
│  Pricing is math. LLMs do not do math reliably.          │
└──────────────────────────────────────────────────────────┘
                          ↓
┌─ RISK (hard gates, fail closed) ─────────────────────────┐
│  Per-strategy capital cap · daily loss kill switch       │
│  PDT day-trade counter · position/notional limits        │
│  Preflight every order; reject if modelled cost > edge   │
└──────────────────────────────────────────────────────────┘
                          ↓
┌─ EXECUTION (Public API) ─────────────────────────────────┐
│  Preflight → place → PUT-replace to chase → confirm      │
│  Route selection per §3 · useMargin explicit · tax lots  │
│  Budget: 10 req/s per account; N accounts = N × 10       │
└──────────────────────────────────────────────────────────┘
```

**Where the LLM agents genuinely belong** (and only here):
1. **Bond document comprehension** (§5.2) — call schedules, covenants, ratings news. The one place language beats numbers.
2. **Corporate-action and halt monitoring** — splits, dividends, ticker changes, S-1s. Unstructured, low-frequency, high-consequence.
3. **Strategy authoring and backtest critique** — writing the deterministic modules, then a second adversarial agent trying to break them. Never let the agent that wrote a strategy be the one that validates it.
4. **Anomaly explanation** — "P&L diverged from model by 3σ, why?" Diagnosis is a reasoning task.

**Where they must never be:** in the order path, in pricing, in position sizing, in risk limits.

### On Public's own no-code AI Agents *(expanded 2026-08-22)*

**Correction to this document's first two passes.** I called Agents "retail intent automation" and then "a 5-minute scheduler." **Both were wrong.** The "check every 5 minutes" line on `/ai-agents/how-it-works` is an *example of a throttle a user imposes*, not the platform's evaluation ceiling — Public's own copy says Agents "monitor conditions continuously." Shipped **2026-03-31**; Public brands itself the first Agentic Brokerage. Corrected picture below.

#### What they actually do

| Dimension | Reality |
|---|---|
| Assets | Equities, ETFs, options, crypto, bonds, cash |
| Order types | **Market and limit**, single-leg and **multi-leg options**, and **shorting** |
| Signals | **EMA, SMA, RSI, MACD, Bollinger Bands, ATR** — a real indicator library, not just price triggers |
| Control flow | **Event-chained sequences**: "if my NVDA covered call executes, immediately write the next month's"; "if I'm assigned on the short put, sell a covered call at 5% OTM"; "if SPY drops 3% and I buy $2,000, place a stop 7% below entry" |
| Lifecycle logic | Roll rules, assignment/expiration risk handling, moneyness + days-to-expiry conditions |
| Cash | Moves between brokerage, bond, and linked bank balances |
| Authoring | Plain-language prompt → the AI **interrogates you for missing parameters** → workflow you review parameter-by-parameter. Vague prompts are refused, not guessed. |
| Approval | Once, upfront. **After that it runs unattended — no advance alert per transaction.** |
| Infrastructure | Runs **inside Public**, no API keys, nothing exposed to the open internet. Full Activity Feed. |
| Access | **Waitlist, rolling rollout** — not generally available |
| Still "coming soon" | **Bonds and tax lots as agent capabilities**, plus financials/earnings-call/dividend data sources |

That is a legitimate rules engine. Roll-and-reassign chains alone are more than most retail traders would ever code correctly, and the covered-call lifecycle automation is genuinely good product.

#### The five things that decide it for this document

1. **No routing control.** Not on `/ai-agents`, not in `/how-it-works`, not in the changelog, not in the agreement. Same hole as §3a, and Agents can't even use the multi-account workaround cleanly.
2. **No execution guarantee, in writing.** Agreement §B.4: *"While we will attempt to carry out your instructions for your Agent, we cannot guarantee execution of a Transaction at any specific time or price. Once executed, Transactions cannot be cancelled or reversed."*
3. **⚠️ The trigger data is disclaimed.** §B.5 — Public *"shall bear no legal responsibility to you for any loss or damages arising from the delay, interruption, error, inaccuracy, or omission of any Third-Party Data, **including any Transaction that is triggered, fails to be triggered, or improperly executed on the basis of such data.**"* Read that twice. **There is no SLA on your agent firing.** Every §5 edge is a thin-margin trade where a missed or spurious trigger is the whole P&L. This single sentence is why an edge strategy cannot live here.
4. **No account-level guardrails and no paper trading.** Webull lets you cap single-order dollar value, cap share quantity, and whitelist tickers; **Public has no caps you can set yourself** — limits exist only as instructions *inside* an agent's own prompt, i.e. enforced by the same LLM that might misread the prompt. And there's no paper mode to rehearse in. Combined with unattended execution and no per-trade alert, the blast radius of one misinterpreted instruction is your account.
5. **Agents run indefinitely until paused**, and §B.4 puts the *"obligation to take immediate action to limit any losses"* on you. An unattended agent with no external cap is a position you are always short optionality on.

#### Verdict

**Agents are a better product than the API for everything that isn't an edge, and unusable for everything that is.**

| Job | Where it goes | Why |
|---|---|---|
| Cash sweep into the 3.3% account | **Agents** | Cadence irrelevant, runs with your laptop shut, no keys to leak |
| Covered-call writing + rolls + assignment handling | **Agents** | Their lifecycle logic beats what you'd write; consequence of a miss is small |
| Portfolio stop-losses, scheduled hedges | **Agents** | Simple, high-consequence, better inside the broker |
| §5.1 box-spread rate arb | **API** | Needs multi-leg *quote* math and a fee model; no agent prices a box's implied rate |
| §5.2 bond relative value | **API** | Bonds aren't even an agent capability yet, and the edge is document comprehension |
| §5.3 overnight convergence | **API** | Needs re-posting, order chasing, and displayed liquidity — none available |
| §5.4 tax-lot harvesting | **API today, Agents later** | Tax lots are "coming soon" for agents. When they land, revisit — this is the one §5 job whose profile actually fits Agents |

**The one real advantage they hold over your own stack:** running inside the broker, with no key material and no machine of yours online. For a job that must not miss a day and isn't racing anyone, that beats a cron on your Mac. **The one real disadvantage:** you cannot cap it from outside, and Public disclaims the trigger.

They passed eight Series 7 exams; that's a knowledge benchmark, not an execution-quality one — and none of the four edges in §5 is limited by knowledge.

---

## 7. Legal / operational constraints — read before writing code

1. **Personal, non-commercial use only.** The Individual API cannot power a service, fund, or product for others. This is a hard ceiling on the whole idea as a business.
2. **PDT rule.** Under $25k equity in a margin account → 3 day-trades per 5 business days. Most intraday strategies are illegal for you until you're capitalized.
3. **Rebate clawback** (§3 above) — silent, discretionary, no notice.
4. **Reg SHO** locate requirements on the new short-selling capability; borrow fees are real and variable.
5. **Wash sales span every account you own**, including IRAs. The tax-lot agent must model this globally or it will manufacture disallowed losses.
6. **You are responsible for every trade the API makes.** No exceptions, no unwind.
7. **NY residents:** no crypto transfers in or out.

---

## 8. Recommended sequence

0. **Day 1, one email:** the two §3a routing questions to Public support. Zero cost, and the answer re-ranks everything below it — §5.3 in particular is unmodellable until it lands.
1. **Week 1, zero capital:** run the §5.1 box-rate falsification test. Poll SPX box quotes daily, model full fees, compare to sweep + T-bill. Binary go/no-go on the best candidate.
2. **In parallel, zero capital:** dump the full bond universe from the new search endpoint, fit issuer curves, count how many >50bps outliers exist. If the count is near zero, §5.2 dies cheaply.
3. **If you have a funded taxable account:** build §5.4 regardless of 1 and 2. It's the only item whose return doesn't require being right about anything.
4. **Only then** consider §5.3, and only sized as a research position — it's the highest-variance item and the only one that isn't actually arbitrage.

**Do not** start by building the agent framework. Three of the four edges may not exist at current rates; find out first with read-only API calls, then build for whichever survives.

---

## 9. The 30% question — every remaining feature, and the honest ceiling

*Added 2026-08-22 in response to: "find a way using the new Agents feature and all new Public features — day trading, swing trading, whatever — a system that will be 30% a year, like an unseen arbitrage."*

I went and catalogued the features this document had never examined. Here is every one, and what it does to the number.

### 9.1 The features I hadn't looked at

| Feature | What it is | Effect on a 30% target |
|---|---|---|
| **Generated Assets (GenA)** | Prompt → a *swarm of parallel AI agents* screens thousands of stocks → custom investable index, with **backtest vs S&P**. **0.49%/yr** management fee, managed by Public Advisors LLC | **Negative.** The backtest is the trap: you iterate prompts until the curve looks good, which is in-sample selection, i.e. data mining with extra steps. Public's own disclosure names **"Over-Reliance Risk."** Expected alpha ≈ 0, minus a certain 0.49% |
| **Direct Index** | Own the constituents directly. **0.19%/yr**, $1,000 min | Mildly **positive** — direct ownership enables lot-level harvesting (§5.4). Not a return source itself |
| **Bond Account** | 10 investment-grade + high-yield corporates, **~5.0–5.5% YTW**. $1,000 min, $3.99/mo (free on Premium) | Yield, not edge. Credit + duration risk. Carry vs 4.9% margin nets ~0 (§3) |
| **Jiko Treasury Account** | Auto-rolling 6-month T-bills, $100 min, BNY Mellon custody. **Not ACATS-transferable** | Risk-free rate. Not edge |
| **Fractional Bonds** | $100 minimum bond entry — **single-dealer (Moment Markets), non-transferable** | **Negative.** See the §5.2 downgrade. Dealer sets both sides |
| **Public Premium** | $10/mo, **waived above $50k**. Better data, waives the Bond Account fee | Saves ~$168/yr at scale. Rounding error |
| **Multi-account** (2026-05-20) | N accounts, each 10 req/s, each with its own route default | **Genuinely useful** — the §3a routing workaround and linear throughput |
| **Agents** | Real rules engine: EMA/SMA/RSI/MACD/Bollinger/ATR, multi-leg, shorting, event-chains | Removes execution error. **Does not create return** |

**Nothing in that list is an undiscovered inefficiency.** Two of them (GenA, fractional bonds) have *negative* expected edge once you price the fee and the dealer spread.

### 9.2 Where 30% would have to come from — the decomposition

Any return decomposes as `risk-free + risk premium × leverage + alpha`. With the risk-free at 3.3%, a 30% target needs **26.7% from premium, leverage, or alpha.** There are exactly four sources, and each is checkable:

| Source | Best case on Public | Why it can't reach 26.7% |
|---|---|---|
| **Equity beta × leverage** | S&P ~10%/yr, Reg-T caps you at **2×** | 2× ≈ 20% expected — but 2× drawdown too. 2008 at 2× is **−100%**. And it's not arbitrage, it's just risk |
| **Volatility risk premium** (the wheel) | 6–10% net premium + 3.3% on collateral = **9–13%** | The VRP is real and persistent. It is not 26.7%. Levering it to 30% converts a −25% year into a **−60%** year |
| **Genuine alpha** | Requires information or infrastructure others lack | You have neither through Public: retail data feed, 10 req/s, no colocation, no direct feeds |
| **Capacity-constrained inefficiency** | The only honest solo-operator source | The two that existed here — odd-lot bonds and overnight divergence — are **damaged by Public's own plumbing** (single dealer; no route control) |

### 9.3 The best honest system I can actually build

Not 30%. This is what the features genuinely support, stacked correctly:

```
┌─ RISK-FREE FLOOR ────────────────────────────────────┐
│  Collateral in sweep @ 3.3%  ·  Jiko T-bills         │
│  Agents job: sweep every idle balance, never miss     │  → 3.3%
└──────────────────────────────────────────────────────┘
┌─ LEAKAGE RECOVERY (guaranteed, no market view) ──────┐
│  Tax-lot harvesting, wash-sale aware across accounts │  → +0.5–1.5%
│  Options rebate as cost reducer, never as the reason │  → +0.1–0.3%
│  Premium waived >$50k; Bond Account fee waived       │  → +~0.1%
└──────────────────────────────────────────────────────┘
┌─ STRUCTURAL PREMIUM (real risk, real premium) ───────┐
│  Cash-secured put wheel on liquid ETFs               │
│  Agents own the lifecycle: CSP → assignment →        │  → +6–10%
│  covered call → roll → re-arm. Their native strength │     (−25%+ tail)
│  Collateral simultaneously earns the 3.3% above      │
└──────────────────────────────────────────────────────┘
┌─ RESEARCH EDGE (where your agents actually belong) ──┐
│  Whole-bond issuer-curve RV (§5.2, whole bonds only) │  → +0.3–1.5%
│  Box-rate check vs sweep when the gap opens (§5.1)   │     on the sleeve
└──────────────────────────────────────────────────────┘

Realistic total: 9–14%/yr, with a genuine −25% to −35% tail.
Essentially-risk-free subset (drop the wheel): 4–5%/yr.
```

**Why the wheel is the right home for Agents specifically:** their template library *is* this strategy — sell the covered call, roll two weeks before expiry, close if within 5 days and ITM, re-arm on assignment. That lifecycle is where retail actually loses money through omission, and it's the one place Public's automation is better than code you'd write. Pair it with §3a's account split and the rebate, and you're harvesting the VRP with the operational errors removed.

**And the honest hazard:** §B.5 disclaims trades that "fail to be triggered," there is **no paper-trading mode**, and there are **no caps you can set from outside the agent's own prompt**. Run it small, in a dedicated account, for a full quarter, before it sees real size.

### 9.4 The direct answer

**A 30%/yr system with the character of an arbitrage — durable, guaranteed, low-variance — does not exist on this platform, and I could not construct one from any combination of the features.** That is not a failure of search: 30% risk-free would be ~9× the T-bill rate, which is a mispricing large enough that it could not survive contact with any professional. Arbitrage returns *are* the risk-free rate plus basis points; that is the definition, not a limitation.

**30% is reachable only as an outcome, not as a system** — a concentrated or levered position that happened to be right. Public's features can make you *operationally excellent* at that bet. They cannot make it a sure thing.

**The one real reframe:** you have far more agent capacity than Public's strategy space can absorb. Spend it on the **research** side — whole-bond issuer curves, corporate-action monitoring, box-rate scanning — where reading beats speed. That's the only place on this platform where your actual advantage is an advantage.

---

## Sources

- [Public Trading API docs](https://public.com/api/docs) · [Changelog](https://public.com/api/docs/changelog) · [API overview](https://public.com/api)
- [Public AI Agents](https://public.com/ai-agents) · [Trading strategies](https://public.com/ai-agents/trading-strategies)
- [Options Order Flow Rebate Program: Terms & Conditions (PDF)](https://public.com/disclosures/rebate-terms) — tier tables and §2 clawback clauses quoted verbatim
- [Options rebate program](https://public.com/options-rebate-program) · [What are options order flow rebates?](https://help.public.com/en/articles/8609726-what-are-options-order-flow-rebates)
- [Public rolls out routing visibility — wholesale / smart / LIT (FX News Group)](https://fxnewsgroup.com/forex-news/retail-forex/public-com-rolls-out-update-giving-traders-more-visibility-over-routing-of-stock-and-etf-orders/)
- [Dark pools vs lit markets — SOR mechanics (Quod Financial)](https://www.quodfinancial.com/dark-pools-vs-lit-markets-how-sor-navigates-liquidity-fragmentation/)
- [Public brokerage pitches stock-trading AI agents (AdvisorHub)](https://www.advisorhub.com/new-york-brokerage-public-pitches-stock-trading-ai-agents/) · [CDO Magazine](https://www.cdomagazine.tech/aiml/public-launches-ai-agents-to-automate-trading-strategies)
- [Blue Ocean ATS FAQ](https://blueocean-tech.io/faq/) · [Blue Ocean via Databento](https://databento.com/blog/blue-ocean-ats-now-available)
- [How do I transfer crypto? (Public FAQ)](https://help.public.com/en/articles/8900850-how-do-i-transfer-crypto)
- [Public.com review — cash sweep 3.3% APY (Finder)](https://www.finder.com/stock-trading/public-review) · [Margin](https://public.com/invest/margin)
- [SEC Rule 605/606 execution-quality disclosure](https://www.sec.gov/rules/final/34-43590.htm)

*Added 2026-08-22 for §3a and the Agents rewrite:*
- [Public fee schedule (PDF)](https://public.com/disclosures/fee-schedule) — routing table + exclusions quoted verbatim, eff. 2026-07-16
- [Place order endpoint schema](https://public.com/api/docs/resources/order-placement/place-order) — full field list, no route field
- [Public AI Agents — how it works / prompting guide](https://public.com/ai-agents/how-it-works) — capital caps, per-asset stops, "check every 5 minutes… up to 2 purchases a day"
- [Agentic Brokerage Agreement (PDF)](https://public.com/disclosures/agenticterms) — §B.4 no-execution-guarantee and §B.5 third-party-data disclaimer quoted verbatim; also [Agentic Brokerage Disclosure](https://public.com/disclosures/agenticdisclosures)
- [Public AI Agents — strategy templates](https://public.com/ai-agents/trading-strategies) — indicator list, event-chained sequences, bonds/tax-lots marked coming soon
- [Public becomes the first brokerage to introduce AI Agents (PR, 2026-03-31)](https://www.prnewswire.com/news-releases/public-becomes-the-first-brokerage-to-introduce-ai-agents-for-your-portfolio-302729050.html) — launch date, waitlist rollout, EMA/SMA/RSI/MACD/Bollinger/ATR, shorting
- [Best brokers for AI trading agents — MCP tested (StockBrokers.com)](https://www.stockbrokers.com/guides/ai-agent-brokers) — "no caps you can set yourself," no paper trading, unattended execution vs Webull/Robinhood
- [Public 606 order-routing disclosure](https://public.com/disclosures/606-report)

*Added 2026-08-22 for §9 (the 30% question):*
- [Generated Assets](https://public.com/generated-asset) · [prompting guide](https://public.com/generated-asset/guide) · [GenA disclosures](https://public.com/disclosures/GenA) — parallel agent swarm, backtest-vs-S&P, "Over-Reliance Risk"; [fees & minimums](https://help.public.com/en/articles/12874251-what-are-the-fees-and-minimums-for-generated-assets) 0.49%/yr vs Direct Index 0.19% / $1,000 min
- [Public margin rates](https://public.com/invest/margin) — 4.90% base → ~3.95% tiered, benchmarked 2026-07-14; daily accrual
- [Fractional bond trading (Public blog)](https://medium.com/the-public-blog/introducing-fractional-bond-trading-exclusively-on-public-e8c8da948dd5) · [Bond Account disclosure](https://public.com/disclosures/bond-account) — **single-dealer (Moment Markets), non-transferable**, fee $0.10–0.50 per $100 par
- [Jiko Treasury accounts](https://help.public.com/en/articles/6997525-what-is-jiko) · [6-month T-bill account](https://help.public.com/en/articles/6997482-what-is-a-6-month-treasury-bill-account) — $100 min, not ACATS-transferable
- [Public 2026 review (NerdWallet)](https://www.nerdwallet.com/investing/reviews/public) — Bond Account ~5–5.5%, Premium waived above $50k — quarterly venue stats; Rule 606(b) gives you your own 6-month routing history on request (**the free way to verify where API orders actually went**)
