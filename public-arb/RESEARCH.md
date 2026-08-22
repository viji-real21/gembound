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
| **LIT** | **$0.003/share** | NYSE/Nasdaq only, full pre-trade transparency. |

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
Cash sweep **~3.3% APY** (as of 2026-06-11), no minimums, no hold period. Margin advertised as low-rate but tiers not published — **get the actual schedule before modelling any carry trade.**

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

### 5.3 Overnight crypto ↔ equity-proxy convergence
Public is one of very few places holding **24/7 crypto and 24/5 equities in one account with one API**. During the overnight session (8pm–4am ET, Blue Ocean ATS — limit orders only, session-only, thin), crypto-proxy equities (IBIT, MSTR, COIN) routinely diverge >1% from where spot BTC says they should be, because the equity book is nearly empty while crypto keeps trading.

**Trade:** compute the implied fair value of the proxy from live BTC, and post *passive limit orders* on the equity leg during the overnight session when the divergence exceeds the cost threshold.

**Cost threshold:** if you hedge with the crypto leg, you pay 20–120 bps and the edge mostly vanishes. **So don't hedge.** Trade the equity leg alone as a mean-reversion bet — which makes it a **statistical convergence trade, not arbitrage.** Be honest about that: it carries real overnight gap risk.

**Constraints:** Blue Ocean accepts limit day orders only, and they do not carry to the next session — your agent must re-post nightly. Fills are unreliable; assume 20–40% fill rates.

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

### On Public's own no-code AI Agents
They're the wrong tool for this. They're built for *retail intent automation* — "sell 10 shares if it drops 5%", "roll my covered calls", "sweep cash monthly". Every workflow requires explicit human pre-approval, evaluation cadence is undisclosed, and they see only Public's own data. Public says the tech passed eight Series 7 exams; that's a knowledge benchmark, not an execution-quality one. **Use the raw API + your own stack. Use their Agents only as a UI for the boring recurring parts.**

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

1. **Week 1, zero capital:** run the §5.1 box-rate falsification test. Poll SPX box quotes daily, model full fees, compare to sweep + T-bill. Binary go/no-go on the best candidate.
2. **In parallel, zero capital:** dump the full bond universe from the new search endpoint, fit issuer curves, count how many >50bps outliers exist. If the count is near zero, §5.2 dies cheaply.
3. **If you have a funded taxable account:** build §5.4 regardless of 1 and 2. It's the only item whose return doesn't require being right about anything.
4. **Only then** consider §5.3, and only sized as a research position — it's the highest-variance item and the only one that isn't actually arbitrage.

**Do not** start by building the agent framework. Three of the four edges may not exist at current rates; find out first with read-only API calls, then build for whichever survives.

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
