# API Documentation

This server exposes a small REST API under two base paths:

- `\/users` (authentication + profile)
- `\/workouts` (workout templates, today session, history, progress)

## Authentication

Most endpoints require a valid JWT via:

- Header: `Authorization: Bearer <jwt>`

Token validation is implemented in `src/middlewares/authentificationHelper.js` (`tokenVerification`).

Refreshing a JWT uses:

- Body: `{ "refreshToken": "<jwt>" }`

## Users

### `POST /users/signup`

Creates a new user and returns a JWT.

- Body (typical): `email`, `phoneNumber`, `password` and profile fields (see `buildUserProfileAttributes()` in `src/helper/user_profile.js`)
- Success: `200 { "token": "<jwt>" }`
- Errors:
  - `400 { "message": "missing_password" }`
  - `400 { "message": "missing_credentials" }`
  - `404 { "message": "client_already_found" }`

### `POST /users/signin`

Signs in a user using email/phone + password, or social ids.

- Body (supported): `email`, `phoneNumber`, `password`, `googleId`, `facebookId`, `appleId`, `stayLoggedIn`
- Success: `200 { "token": "<jwt>", "refreshToken": "<jwt>"? }`
- Errors:
  - `404 { "message": "client_not_found" }`
  - `400 { "message": "missing_password" }`
  - `400 { "message": "missing_credentials" }`
  - `401 { "message": "invalid_credentials" }`

### `POST /users/renew`

Generates a new JWT (and refresh token) from a refresh token.

- Auth: body refresh token (`refreshTokenVerification`)
- Body: `{ "refreshToken": "<jwt>" }`
- Success: `200 { "token": "<jwt>", "refreshToken": "<jwt>" }`
- Errors:
  - `403 { "message": "no_token_provided" }`
  - `406 { "message": "session_expired" }`

### `GET /users/profile`

Returns the authenticated user profile.

- Auth: `Authorization: Bearer <jwt>`
- Success: `200 { "clientFound": { ...user } }`
- Errors:
  - `403 { "message": "no_token_provided" }`
  - `403 { "message": "session_expired" }`
  - `404 { "message": "client_not_found" }`

## Workouts

### `GET /workouts/recommended`

Returns recommended workout templates based on user preferences.

- Auth: `Authorization: Bearer <jwt>`
- Success: `200 { "userId": number, "templates": WorkoutTemplate[] }`

### `GET /workouts/today`

Returns (or creates) the user’s workout session for today.

- Auth: `Authorization: Bearer <jwt>`
- Success:
  - If session already completed: `200 { "message": "work_already_done", "dateAssigned": "YYYY-MM-DD", "workoutHistoryId": number }`
  - Otherwise: `200 { "dateAssigned": "YYYY-MM-DD", "restDay": boolean, "workoutHistoryId": number|null, "template": WorkoutTemplate|null, "exerciseProgress": WorkoutHistoryExercise[] }`
- Notes:
  - `template.Exercises` contains exercise details + `WorkoutTemplateExercise` (sets/reps/order/rest/notes).
  - `exerciseProgress` contains only progress rows (no nested `Exercise` object). Use `template.Exercises` to render exercise info.

### `GET /workouts/history`

Lists workout histories for the authenticated user.

- Auth: `Authorization: Bearer <jwt>`
- Query: `limit` (default 30), `offset` (default 0)
- Success: `200 { "userId": number, "histories": WorkoutHistory[] }`

### `GET /workouts/history/:workoutHistoryId`

Returns a single history with detailed `exerciseProgress`.

- Auth: `Authorization: Bearer <jwt>`
- Params: `workoutHistoryId` (number)
- Success: `200 { "userId": number, ...WorkoutHistory, "exerciseProgress": WorkoutHistoryExerciseWithExercise[] }`
- Errors:
  - `400 { "message": "invalid_workoutHistoryId" }`
  - `404 { "message": "not_found" }`

### `PUT /workouts/history/:workoutHistoryId/exercises/:exerciseId`

Updates progress for one exercise in a workout session.

- Auth: `Authorization: Bearer <jwt>`
- Body:
  - `performedSets` (optional): array of sets, e.g. `[{"setNumber":1,"reps":10,"weight":50}]`
  - `completed` (optional): boolean
- Success: `200 { "userId": number, "progress": WorkoutHistoryExercise }`
- Errors:
  - `400 { "message": "invalid_params" }`
  - `400 { "message": "invalid_performedSets" }`
  - `404 { "message": "not_found" }`

When `completed` is updated, the server automatically recalculates and persists `WorkoutHistory.completed`.

### `POST /workouts/history/:workoutHistoryId/finish`

Marks a workout session as finished (completed) if all exercises are completed.

- Auth: `Authorization: Bearer <jwt>`
- Params: `workoutHistoryId` (number)
- Success:
  - `200 { "userId": number, "workoutHistoryId": number, "completed": true }`
  - `200 { "message": "work_already_done" }` (already finished)
- Errors:
  - `400 { "message": "invalid_workoutHistoryId" }`
  - `400 { "message": "workout_not_completed" }` (not all exercises completed)
  - `404 { "message": "not_found" }`

