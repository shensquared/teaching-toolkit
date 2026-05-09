# Working with **AI** on teaching tasks

A short list of tips that pay off across any **AI** tool (Claude, ChatGPT, Cursor, local models).

## 1. Bring your conventions

Don't re-explain your style every session. Drop a `AGENTS.md` (and a `NOTATION.md` if your subject has notation) at the root of your repo and the **AI** will follow it. See [writing-conventions.md](writing-conventions.md).

## 2. Ask for a plan before the work

For any task bigger than a one-line edit, ask the **AI** to outline its approach first. You catch wrong-direction work before it happens, and the planning doc itself is reusable.

## 3. Verify before publishing

**AI** confidently hallucinates dates, citations, names, and APIs that don't exist. For anything going to students or into a course site, treat **AI** output as a first draft that needs the same eyeballing as a TA's submission.

## 4. Iterate; first drafts are rarely correct

The right move is usually "this is close, but X is off; fix that and only that," not accepting whatever came back. Tight feedback loops beat long prompts.

## 5. Read code before running it

Especially for scripts that touch your course content, server, or anything with state. Even a one-line `rm` or a `git push --force` slipped into a longer block can ruin your day.

## 6. Route sensitive work to a local model

Student work, draft exam problems, gradebooks. These don't belong in a third-party API. See [local-llm/](local-llm/) for setup.

## 7. Save what worked

When a session produces a useful prompt, recipe, or convention, save it (in `AGENTS.md`, in this toolkit, in your own notes). Otherwise you'll re-derive it next semester.

## Working with **AI** from anywhere

If you want to keep **AI** sessions running on your local machine but reach them from outside:

1. **Use the CLI in tmux.** Sessions stay local, organized, and survive disconnects. Detach from a long-running task and reattach from any device.
2. **Rely on a VPN.** Set up WireGuard (see [local-llm/wireguard/](local-llm/wireguard/)) so you can reach your machine without exposing services directly.
3. **Set up SSH tunnels** for one-off port forwards (e.g., `ssh -L 11434:localhost:11434 user@host`) when you only need one service and don't want the full VPN up.
4. **Find a good iOS client.** I use [Moshi](https://getmoshi.app/); pick what handles flaky networks well for you.
