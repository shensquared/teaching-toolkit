# Porting gotchas

## Staff sync drift

`__USERS__/<kerb>.py` and the staff display preload must stay in sync. Adding to one and forgetting the other silently breaks permissions or hides someone from the staff page.

## Forgotten plugin renames

End-of-term plugins (post-semester grade displays, archived-content banners) need to be disabled at the start of the new term. The `post_load.py` ↔ `disabled_post_load.py` rename is easy to forget.

## Asset paths

Term-specific folders sometimes get deleted on port. Move long-lived fallback assets (e.g., `nopicture.jpg`) to a permanent location like `__STATIC__/logos/`.

## Stale external links

Piazza, schedule sheets, feedback forms all default to the prior term. Sweep `preload.py` for the old term string.

## Date strings vs. weekday strings

Hardcoded weekday names ("Monday, Sep 8") must be regenerated. Searching for the old first-day date string usually surfaces the rest.

<!-- TODO: add more as you encounter them. -->
