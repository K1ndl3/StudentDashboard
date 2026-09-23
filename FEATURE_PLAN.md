# Focus Category Feature Plan

## Implemented

- Add Study, Work, and Self-study as built-in timer categories.
- Let users create and immediately select custom categories.
- Lock the selected category after a work cycle starts so completed time is attributed correctly.
- Record each completed work cycle with its category, duration, and completion timestamp.
- Persist categories, timer state, and focus history in browser storage.
- Add a second timer view with a category histogram and total focused time.
- Let users switch between the timer and statistics without interrupting a running cycle.
- Save a daily category snapshot at 11:59 PM Pacific Time while the application remains open.
- Highlight calendar days that contain a saved focus snapshot.
- Open a saved daily histogram from the calendar's graph icon.

## Follow-up: daily email summary

At the end of each day, send the user an email summary of the number of hours worked in each category.

This phase requires authenticated, server-side storage for focus sessions, a user email preference and time zone, an email provider, and a scheduled backend job. Guest sessions should remain local unless the user signs in and explicitly syncs them.
