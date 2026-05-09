# Downloading Panopto videos on a schedule

The Panopto API lets you pull your own lecture videos out of MIT's hosted instance, on a schedule. Useful for backups, transcript generation, and **AI-assisted delivery coaching**: run an LLM over the audio / transcript to flag pacing, filler words, off-topic tangents. Private feedback before you watch the recording yourself.

Background: my AI-as-TA talk to the MIT Engineering Council covers the broader teaching applications of this pipeline.

## Generate API credentials

At `<your-host>.hosted.panopto.com/Panopto/Pages/Admin/Integrations/Edit.aspx`:

1. Create an API Client. Grant type: **Server-side Web Application**.
2. Set redirect URL to a localhost address (e.g., `http://localhost:9999/callback`).
3. Save the **Client ID** and **Client Secret**.

## OAuth dance (once)

Run a small script that:

- Opens `https://<host>/Panopto/oauth2/connect/authorize` in your browser.
- Catches the code at the localhost callback.
- Exchanges it for an access + refresh token at `/Panopto/oauth2/connect/token`.
- Saves the refresh token to disk for future runs.

Subsequent runs mint access tokens from the refresh token; no browser needed.

## Download loop

With an access token:

1. `GET /folders/search?searchQuery=<course-name>` → folder ID.
2. `GET /folders/<id>/sessions` → list sessions in the folder.
3. `GET /sessions/<session-id>/downloadUrl` → presigned URL (expires; fetch immediately).

Wrap in a cron or `launchd` job. Track which sessions you've already downloaded so reruns are idempotent.

## Reference implementation

Working setup in `~/code/course-admin-scripts/` (private):

- `panopto_auth.py` — OAuth2 flow + refresh token persistence.
- `panopto.py` — folder / session search, download URL fetch, file save.

<!-- TODO: sanitize and check in a starter script here. -->
