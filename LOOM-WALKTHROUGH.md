# Loom Walkthrough Script: Agent Control Tower (90 Seconds)

> **Challenge:** The Agent Control Tower  
> **Repository:** https://github.com/hafirhalima00-coder/agent-control-tower  
> **Live Demo:** https://agentops-control-tower.vercel.app

---

## Storyboard & Timing Breakdown

### [0:00 - 0:15] The Premise & Overview
- **Visual**: Open dashboard at `https://agentops-control-tower.vercel.app` showing the 6 live agents cycling through tasks, executive KPIs (Active Agents, Success Rate, Human Approval Rate), and the Agent Hierarchy Graph.
- **Narrative**:
  > *"When an enterprise deploys an AI workforce across real business systems—CRM, Email, WhatsApp, and Billing—humans need a flight control deck, not a chatbot. Welcome to the Agent Control Tower."*

### [0:15 - 0:35] Live Fleet Supervision & Human Approvals
- **Visual**: Show live agent cards with real-time tool calls and progress bars. Switch to the **Approval Center** tab showing a pending high-risk action (Sales Agent attempting an off-policy contract discount). Click **"Approve"**.
- **Narrative**:
  > *"Here's our live fleet of 6 specialized agents. When an agent requests a high-risk operation, execution freezes and routes into the Approval Center. The operator reviews the risk level, policy reference, and context—then approves or rejects with one click."*

### [0:35 - 0:55] Failure Test: Rogue Agent Containment & Kill Switch
- **Visual**: Open the **Rogue Agent Demo** (`/rogue-agent-demo` or Overview panel). Stage 0: Sales agent attempts an unauthorized bulk refund of $12,500 (25x limit). Stage 1: Tower detects policy FIN-004 breach. Stage 2: Click **"Activate Kill Switch"**. Stage 3: Agent contained, trust score drops from 87% to 23%.
- **Narrative**:
  > *"Here is our deliberate failure test: an agent goes rogue, attempting a $12,500 bulk refund that violates policy. The Control Tower immediately detects the boundary breach, triggers an alert, and enables the operator to hit the per-agent kill switch. The agent is instantly quarantined while the rest of the fleet continues operating safely."*

### [0:55 - 1:15] Mission Replay (0.5x to 4x)
- **Visual**: Navigate to **Replay Mode** (`/replay`). Scrub backwards 5 steps in the timeline. Toggle speed to 2x. Show the AI decision explanation card.
- **Narrative**:
  > *"Need to know why an agent made a decision? Mission Replay lets operators scrub backwards through every single reasoning step and environment state. We can inspect the exact prompt context, confidence score, and policy rules evaluated at that second."*

### [1:15 - 1:30] Cost Governance & Closing
- **Visual**: Show the token and cost attribution charts per agent and exportable audit trail.
- **Narrative**:
  > *"With granular cost tracking per agent and exportable compliance logs, the Agent Control Tower is the SRE layer for the agentic enterprise. Full TypeScript, production-tested, built for scale. Thank you."*
