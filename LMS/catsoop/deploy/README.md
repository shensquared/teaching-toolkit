# Deploying courseware to the live CAT-SOOP server

Pattern for auto-pushing your course repo to the running server on every `main` update.

## How it works

1. PR merges into `main` (manually or via [announcements scheduled merge](../announcements/)).
2. A GitHub Action triggered by the push runs.
3. The Action ships content to the server (rsync over SSH is common).
4. CAT-SOOP serves it on the next request (or after a cache flush).

## What you need

- A CAT-SOOP server reachable over SSH from GitHub-hosted runners (or a self-hosted runner).
- An SSH deploy key with the private half in GitHub Secrets.
- The path on the server where your course directory lives.

## Files

- [deploy.yaml.example](deploy.yaml.example): drop into `.github/workflows/` and adjust.

## Cache invalidation

CAT-SOOP caches rendered content. If edits don't appear, clear the cache. <!-- TODO: command / path. -->
