# Notes: AI Tools, Key Decisions & Limitations

> **Challenge:** The Agent Control Tower  
> **Repository:** https://github.com/hafirhalima00-coder/agent-control-tower

---

## 1. AI Tools Used

- **Claude / Cursor**: Assisted with Next.js 16 App Router setup, component layouts, and mock event stream generators.
- **Architectural Determinism**: The boundary enforcement logic, kill switch state machines, trust score recalibration, and approval queues are implemented in deterministic TypeScript, ensuring rigorous repeatability.

---

## 2. Key Decisions

1. **Per-Agent Isolation & Granular Kill Switches**:
   - Rather than an all-or-nothing emergency stop that halts the entire enterprise, the Control Tower provides per-agent quarantine. If the Sales agent drifts, Support and Shipping continue servicing customers undisturbed.
2. **Replayability Over Static Logs**:
   - Instead of passive text logging, events are structured as replayable timeline frames with variable playback speeds (0.5x to 4x).
3. **Four-Stage Failure Containment Workflow**:
   - Detection $\rightarrow$ Alerting $\rightarrow$ Human Intervention $\rightarrow$ Quarantined Containment with explicit trust score recalibration.
4. **Token & Cost Attribution**:
   - Treating token spend as an operational SLA metric that operators can monitor in real time alongside latency and error rate.

---

## 3. What Was Intentionally Left Out of Scope

- **Direct Hardware / Bare-Metal Host Orchestration (Kubernetes CNI)**: Focused on application-level and agent-runtime governance rather than bare-metal cluster provisioning.
- **Proprietary Third-Party SIEM Connectors (Datadog/Splunk API Keys)**: Audit logs are exposed via standard JSON REST endpoints (`/api/audit/export`) to allow easy integration into any compliance pipeline without mandatory third-party subscriptions.

---

## 4. Limits & "This Breaks When..."

- **This breaks when:** An agent generates millions of events per second in an infinite loop without rate limiting; to protect against this, the control plane enforces client-side backpressure and ingest batching.
- **This breaks when:** Operators fail to respond to approval queue requests within configured TTL windows; in that event, the fail-safe default automatically cancels or defers the proposed action.
