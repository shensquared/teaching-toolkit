# Hermes agent

A course-data assistant built on top of the local LLM stack. Wraps a local model with the prompts, tools, and conventions you use repeatedly across the semester (roster joins, OH log triage, exam-score breakdowns, free-text feedback summarization, automatic skill extraction from your own usage transcripts).

## Deployment guidance

- **Use a dedicated server.** Don't co-locate Hermes with your personal machine or with hosts that hold unrelated personal files. A small Proxmox container or a spare Mac Mini is enough.
- **No personal files on the host.** The agent has broad read access by design (that's the point: it can grep across rosters, queues, gradebook exports). Keep that scope to course data only, so a prompt-injection or misrouted query can't leak personal material.
- **Rely on network firewall configuration for security.** Block LAN access from the Hermes host: it should not be able to reach other machines on the office subnet, your home subnet, or anything outside the course-data paths it needs. Egress should be tight too (model endpoint + the specific course-data sources, nothing else). Treat the host as semi-trusted, and let the network enforce the boundary rather than relying on per-process sandboxing.

See [../local-llm/](../local-llm/) for the underlying model-serving setup.
