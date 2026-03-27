---
layout: post
title: "The CI Arcade"
date: 2025-08-12
categories:
  - engineering
  - satire
description: "Ship less. Save more. A fairness layer for CI that saves money by slowing you down just enough."
published: true
mermaid: true
---

A fairness layer for CI that saves money by slowing you down just enough.

## TL;DR
CI is too fast, engineers are too parallel, and cloud bills are too real.  
The CI Arcade introduces a token-gated queue that meters the blast radius of human enthusiasm. One job at a time. Sometimes.

---

## The Pitch
- Cut CI concurrency without saying "we cut CI concurrency"
- Align engineering behavior with finance targets using playful "game" mechanics
- Make throughput feel like a privilege you earn, not a utility you expect

---

## Core Mechanics
You don’t run CI. You buy a turn.

### Token lifecycle
- One active token per user. No token, no CI
- Tokens are consumed on job completion
- Forced issuance lets a user eject their currently running job to get a fresh token. Brutal but fair

### Golden path flow
```
1. User requests token generation.
   - Check for existing active token.
     - If active token exists: Notify user (cannot generate new token).
     - If no active token: Generate new token and mark as active.

2. User requests forced token issuance.
   - Check for active job.
     - If job is running: Terminate job, mark existing token as invalid.
   - Generate new token and mark as active.

3. User provides active token to run CI job.
   - Check token status.
     - If valid: Run CI job, mark token as used upon completion.
     - If invalid: Notify user (token no longer valid).

4. Log CI job result and token used.
   - Provide feedback to user about job outcome.
```

### Sequence diagram
<div class="mermaid">
sequenceDiagram
  actor Dev as Developer
  participant TA as Token API
  participant CQ as CI Queue
  participant ER as Executor Runner
  participant LG as Logger

  Dev->>TA: Request token
  TA-->>Dev: Token or "you already have one"
  Dev->>CQ: Submit job with token
  CQ->>TA: Validate token
  TA-->>CQ: Valid
  CQ->>ER: Start job
  ER-->>CQ: Job finished (success/fail)
  CQ->>TA: Mark token used
  CQ->>LG: Log job result + token id
  LG-->>Dev: Feedback summary
</div>

### Token state machine
<div class="mermaid">
stateDiagram-v2
  [*] --> None
  None --> Active: Generate

  Active --> Used: Job completes
  Active --> Invalid: Force issue (kill running job)
  Invalid --> Active: New token generated
  Used --> Active: New token generated
</div>

---

## UI Concepts
Interface specifications. Lo-fi prototypes pending design review.

### 1) Home
![Home: Get Token](/assets/ci-arcade/ci-arcade-home.png)

- Big "Get Token" button
- "You have an active token" banner with a sad timer that counts up, not down

### 2) Queue + Force Issue
![Queue and Force Issue](/assets/ci-arcade/ci-arcade-queue-force-issue.png)

- Status + position in line
- Nudge/Bump controls
- Destructive Force Issue modal with "I accept the chaos"

### 3) Leaderboards + Finance
![Leaderboards + Finance Panel](/assets/ci-arcade/ci-arcade-leaderboard-finance.png)

- Least Tokens Used (weekly)
- Finance panel with "Increase Arcade Capacity (Finance only)"

---

## Workflows

### "Happy" path
- Developer requests token
- Gets one
- Runs job
- Token is marked used when job completes

**Result:** Single-flight behavior. Cheap. Calm. Boring. Perfect.

### "Panic refactor" path
- Developer spams commits
- Sees "active token exists"
- Tries Force Issue
- Running job is terminated, token invalidated, new token created
- Runs new job

**Result:** The Arcade discourages thrash with self-inflicted pain. Finance smiles.

### "Oops stale token" path
- Developer tries to run a job with an invalid token
- Gets told it’s invalid
- Must request a new token like a normal human

**Result:** Order restored. Savings continue.

---

## Pricing Theory

**Free**
Soft concurrency caps. Leaderboard participation. Community norms.

**Team** — $8/seat/month
Hard token enforcement. Audit logs. Manager dashboards. Monthly Arcade Health Report (PDF, branded).

**Enterprise** — Contact Sales
- Dedicated Arcade Success Manager
- Quarterly "Build Intentionality" workshops (CPD credits available in select regions)
- Custom Efficiency Score weighting aligned to your OKRs
- Concierge terminology review: all system strings audited for growth-positive language
- SLA: token issuance P99 < 45 s (intentional — supports deliberate commit practices)
- Joint "Capacity Planning" briefing with Finance, quarterly

---

## SLOs
- Token issuance P50 under 200 ms
- Queue visibility P95 under 1 s
- Job kill-on-force-issue P99 under 3 s
- Monthly target: Arcade Efficiency Score ≥ 0.72 (see Appendix B for scoring model)

---

## Governance and Compliance Theater
- Audit log stores:
  - user_id
  - token_id
  - job_id
  - action (issued, validated, consumed, invalidated, killed)
  - timestamps
  - reason (human text, e.g., "panic push")
- Retention: 13 months so you can draw bad trend lines during budget season
- "Separation of duties": only Finance can increase concurrency ceilings

### Exemptions
- Staff+ engineers: token limits apply, but Force Issue is pre-authorized
- Incident responders: tokens auto-issued during active PagerDuty P0/P1 alerts
- Release managers during freeze windows: unlimited tokens, Finance-notified post-hoc

---

## Change Management

| RFC | Title | Status | Owner |
|-----|-------|--------|-------|
| 000 | Rename "concurrency limit" to "Arcade Capacity" | Approved | Platform |
| 001 | Replace "job cancellation" with "graceful prize reclamation" | Approved | Comms |
| 002 | Happy Hour tokens (2–3 a.m. local) | Rejected — "encourages off-hours heroics" | Eng |
| 003 | Rebrand Force Issue as "Strategic Job Reconsideration" | In Review | Legal |
| 004 | Remove "chaos" from all user-facing strings | Approved | Brand |

---

## Behavioral Design
- Commitment reinforcement: bonus token credits for users who maintain build frequency under 3/day. Encourages deliberate shipping.
- Community recognition: weekly digest highlights top contributors by Arcade Efficiency Score.
- Decision support: pre-confirmation modal on Force Issue surfaces estimated job completion percentage and time remaining. Users make informed choices.

---

## FAQ
**Isn’t this just a mutex for humans?**  
Yes. That’s the point.

**Will engineers be slower?**
No. Engineers will be more intentional. Velocity is a measure of value delivered, not jobs launched. Internal pilots show a measurable reduction in context-switching overhead and a perceived throughput improvement of 12–18%. [n=14, 8 weeks, Platform team]

**What about flaky tests?**  
Great news. You’ll notice them less often because you run fewer jobs.

**How do I bypass this?**  
You don’t. Arcade Capacity is policy, not preference.

---

## Launch Assets

### One-pager diagram
<div class="mermaid">
flowchart LR
  A[Request Token] -->|Active exists| B[Notify: reuse it]
  A -->|No active| C[Generate Token]
  C --> D[Run Job with Token]
  D -->|Valid| E[Execute CI Job]
  D -->|Invalid| F[Notify: token invalid]
  E --> G[Mark Token Used]
  G --> H[Log: job + token + outcome]
</div>

### Poster copy
- Headline: "Ship less. Save more."
- Subhead: "Turns, not threads."
- Footer: "The CI Arcade. One coin per run."

### Slack announcement
> Arcade is live. You get one active token. Force Issue kills your job and gives you a new coin. Jobs without valid tokens are bounced. Leaderboards on Friday. Questions in #arcade-support.

---

## How We "Measure Success"
- CI spend down 25–40%
- PRs linger longer but merges still happen
- Engineers report "less chaos" while privately seething
- Finance approves your next pet project because you "found savings"

---

## Appendix: Mindful Builds Workshop Curriculum (90 min)

| # | Module | Duration |
|---|--------|----------|
| 1 | The Psychology of the Commit | 20 min |
| 2 | Token as Intention: Treating CI Resources as Finite | 25 min |
| 3 | Force Issue and the Ethics of Interruption | 15 min |
| 4 | Building a Personal Arcade Efficiency Practice | 20 min |
| 5 | Closing reflection + goal-setting | 10 min |

Facilitated by a certified Mindful Builds practitioner.
CPD credits pending accreditation (expected Q2).

---

## Appendix: Forced Issuance Flow
<div class="mermaid">
sequenceDiagram
  actor Dev as Developer
  participant TA as Token API
  participant CQ as CI Queue
  participant ER as Executor Runner

  Dev->>TA: Force issue request
  TA->>CQ: Is there a running job for this user/token?
  alt Yes
    CQ->>ER: Terminate job now
    ER-->>CQ: Job killed
    CQ->>TA: Mark token invalid
  else No
    TA-->>TA: Nothing to kill
  end
  TA-->>Dev: New active token issued
</div>

