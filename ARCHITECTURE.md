# Architecture Snapshot: Agent Control Tower

> **Agent Events → Control Plane → Operator UI**

The Agent Control Tower serves as the centralized human-in-the-loop cockpit and SRE governance layer for supervising fleets of autonomous AI agents operating across business systems.

---

## 1. High-Level Flow: Events to Operator Interface

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AGENT CONTROL TOWER ARCHITECTURE                │
│                                                                        │
│   ┌────────────────────┐   ┌───────────────────┐   ┌───────────────┐   │
│   │ AGENT FLEET EVENTS │──▶│   CONTROL PLANE   │──▶│  OPERATOR UI  │   │
│   │                    │   │   (GOVERNANCE)    │   │   (COCKPIT)   │   │
│   │ • Tool Calls       │   │ • Boundary Rules  │   │ • Fleet Status│   │
│   │ • State Mutations  │   │ • Approval Queue  │   │ • Kill Switch │   │
│   │ • Token & Cost Use │   │ • Trust Scorer    │   │ • Replay Mode │   │
│   │ • Drift Signals    │   │ • Audit Logger    │   │ • Decision Log│   │
│   └────────────────────┘   └───────────────────┘   └───────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Event Ingestion, Gating, & Intervention Pipeline

```mermaid
flowchart TD
    subgraph AgentFleet["1. Agent Fleet (6 Simulated Agents)"]
        A1["Customer Support"]
        A2["Sales Agent"]
        A3["CRM Agent"]
        A4["Email Agent"]
        A5["WhatsApp Agent"]
        A6["Scheduling Agent"]
    end

    subgraph ControlPlane["2. Control Plane & Governance Engine"]
        INGEST["Event Stream Ingest (Tool Calls, Status, Drift)"]
        POLICY{"Boundary & Risk Evaluator"}
        KILL["Emergency Quarantine / Kill Switch"]
        AUDIT["Immutable Audit Trail & Token Tracker"]
    end

    subgraph OperatorUI["3. Operator UI / Cockpit"]
        DASH["Live Monitor & Hierarchy Graph"]
        APP_QUEUE["Human Approval Queue (Approve / Reject)"]
        REPLAY["Mission Replay (0.5x - 4x Timeline Scrubbing)"]
        ROGUE_CARD["Rogue Agent Containment Console"]
    end

    AgentFleet --> INGEST
    INGEST --> POLICY
    POLICY -->|Low Risk| AUDIT
    POLICY -->|High Risk ($ > limit)| APP_QUEUE
    POLICY -->|Rogue Drift / Violation| KILL
    KILL --> ROGUE_CARD
    APP_QUEUE -->|Human Approves| AUDIT
    APP_QUEUE -->|Human Rejects| KILL
    AUDIT --> DASH
    AUDIT --> REPLAY
```

---

## 3. Intervention Primitives

1. **Per-Agent Kill Switch**: Operators can instantly pause, drain, or terminate any agent without affecting other running agents in the fleet.
2. **Approval Center**: Actions exceeding risk thresholds (e.g. bulk refunds, high capital spend, CRM deletions) block execution until explicit human confirmation.
3. **Mission Replay (0.5x to 4x)**: Complete retrospective playback allows operators to inspect step-by-step reasoning, inputs, and environment context for the last N steps.
4. **Token & Cost Attribution**: Real-time tracking of token counts and operational cost per agent and per task.
5. **Rogue Agent Containment**: Automated boundary enforcement catches policy violations (e.g. 25x spending limit breach), immediately triggers containment, drops agent trust score, and freezes mutations.
