# Running an LLM locally

For instructors who want AI assistance without sending course material or student data to a third-party API.

## Why local

- **Privacy**: student work, exams, planning notes stay on your machine.
- **Cost**: no per-token billing.
- **Offline**: works on a plane, in a basement classroom.

## Hardware

**Recommended**: Mac Studio M4 Max. Unified memory + Metal GPU + acceptable noise + low idle power. Single box, easy to maintain.

Alternatives, in roughly decreasing order of recommendation:

- **Daisy-chained Mac Minis**: technically possible for distributed inference. Lots to maintain (networking, model sharding, keeping macOS / firmware in sync). Not worth it unless you really need the parallelism.
- **x86 Linux box with [Proxmox](https://www.proxmox.com/)**: good if you already self-host other services and want to compartmentalize the LLM in its own VM / LXC container. No Apple Silicon perf, so model choice is more constrained.
- **Cloud (Linode, etc.)**: fine for prototyping. Costs rack up quickly for sustained workloads; easy to forget a GPU instance running overnight.
- **MIT shared compute**: [orcd.mit.edu](https://orcd.mit.edu/) offers rental compute. <!-- TODO: add notes once you've actually used it. -->

## What's here

- **[ollama/](ollama/)**: easiest way to run models locally. OpenAI-compatible API.
- **[mlx/](mlx/)**: Apple Silicon-optimized alternative for faster inference on M-series Macs.
- **[openwebui/](openwebui/)**: ChatGPT-style web UI; multi-user, with built-in RAG over uploaded documents.
- **[n8n/](n8n/)**: workflow automation; chain local LLM calls into batched / scheduled jobs.
- **[wireguard/](wireguard/)**: VPN setup so you can reach your local LLM (or any local service) from elsewhere.
