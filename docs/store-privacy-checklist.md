# Store Privacy Checklist

## Current Product Reality

This checklist reflects the current app behavior in the codebase.

### Data handled by the app

- Account data:
  - email
  - user id
  - profile info such as username, display name, avatar, birth date, gender when provided
- User content:
  - backlog status
  - ratings
  - notes
  - profile avatar
- Technical/auth data:
  - authentication session
  - secure local session persistence on device
- Optional media access:
  - photo library access only to let the user choose a profile picture

### What does not appear active today

- no ads SDK integrated
- no analytics SDK integrated
- no tracking SDK integrated
- no push notification setup
- no location access
- no camera usage
- no microphone usage
- no contacts access
- no health/fitness data

## Apple App Privacy Draft

### Data linked to the user

Likely yes:

- Contact info:
  - email address
- User content:
  - profile data
  - avatar
  - backlog data
  - notes
- Identifiers:
  - account user id

### Data used for tracking

Current expected answer:

- `No`

Only keep this answer if no tracking/ads SDK is added before release.

### Sensitive data

Current expected answer:

- `No`, unless you later introduce payments, health, contacts, location, or other sensitive categories.

## Google Play Data Safety Draft

### Data collected

Likely yes:

- Personal info:
  - email address
  - optional profile fields
- User-generated content:
  - notes
  - ratings
  - backlog content
- App activity:
  - user interactions related to backlog and catalog usage only if actually stored server-side

### Data shared with third parties

Current expected answer:

- infrastructure/service providers only as needed to operate the app
- not shared for advertising or tracking

### Is data encrypted in transit?

Expected answer:

- `Yes`

### Can users request deletion?

Expected answer:

- `Yes`

The app already includes account deletion flow, and the legal docs mention deletion support.

## Submission Blockers To Close Before First Store Submit

1. Host a public privacy policy URL.
2. Host a public support URL or landing page.
3. Confirm the real support email domain you want to expose publicly.
4. Double-check Apple App Privacy and Google Data Safety answers against the final production backend setup.
5. Re-verify that no analytics, crash reporting, or ad SDK was added after this checklist was written.

## Final Pre-Submission Sanity Check

Before filling the store forms, verify:

1. which user fields are persisted in Supabase
2. whether server logs store IPs, identifiers, or extra diagnostics
3. whether any third-party service beyond Supabase receives personal data
4. whether account deletion is complete and user-visible in production
