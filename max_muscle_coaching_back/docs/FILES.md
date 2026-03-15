# Project Files

This document is a quick “what lives where” map for the repo.

## Entry Points

- `index.js`: Main server bootstrap used by `npm start` (loads models, sets associations, syncs DB, registers routes, starts HTTP server).
- `app.js`: Express app configuration (body parsing, CORS, static exercise image serving).
- `bin/www`: Legacy Express generator entry point (not used by `npm start` in `package.json`).

## Routes (HTTP)

- `src/routes/user_route.js`: User/auth endpoints mounted under `\/users`.
- `src/routes/user_workout_route.js`: Workout endpoints mounted under `\/workouts`.

## Controllers (HTTP handlers)

- `src/controllers/user_controller.js`: Implements `\/users` handlers (`signin`, `signup`, `renew`, `profile`).
- `src/controllers/user_workout_controller.js`: Implements `\/workouts` handlers (recommended, today, history, history detail, update progress, finish).

## Services (business logic)

- `src/services/workout_service.js`: Core workout logic (template recommendation, today session creation, progress updates, finish session).

## Middlewares (auth/validation)

- `src/middlewares/authentificationHelper.js`: JWT validation (`tokenVerification`, `refreshTokenVerification`) + role helpers.
- `src/middlewares/check.js`: Shared request validation helpers (if used).

## Database / Sequelize

- `src/config/db.config.js`: Sequelize connection setup (host/user/password/dialect/pool).
- `src/config/db_sync.js`: Controlled DB sync + legacy table cleanup (drops old exercise history tables if present).

### Models

- `src/models/user_model.js`: `User` schema + associations.
- `src/models/verification_code.js`: Verification code schema (used by signup/verification flows).
- `src/models/exercise_model.js`: `Exercise` schema + associations.
- `src/models/gallery_model.js`: `Gallery` (exercise media).
- `src/models/instruction_model.js`: `Instruction` (exercise instructions).
- `src/models/muscle_model.js`: `Muscle` catalog.
- `src/models/exercise_muscle_model.js`: Join table between exercises and muscles (primary/secondary).
- `src/models/workout_template_model.js`: `WorkoutTemplate` (template metadata + association to exercises).
- `src/models/workout_template_exercise_model.js`: Join table for template exercises (order/sets/reps/rest/notes).
- `src/models/workout_history_model.js`: `WorkoutHistory` (one per user per day).
- `src/models/workout_history_exercise_model.js`: `WorkoutHistoryExercise` (progress per exercise in a session).

## Seeds (one-off scripts)

- `src/seed/exercises_seed.js`: Imports exercises from `public/exercises` into DB.
- `src/seed/workout_templates_seed.js`: Generates and seeds workout templates from the exercise catalog and user criteria.

## Helpers

- `src/helper/helper.js`: General helpers (JWT generation, parsing helpers, etc.).
- `src/helper/user_profile.js`: Builds/normalizes user profile fields (used during signup/update flows).
- `src/helper/image.js`: Image download/save helpers for user pictures, etc.
- `src/helper/time.js`: Date/time formatting helpers.
- `src/helper/colors.js`: Console color helpers.
- `src/helper/exercise_importer.js`: Exercise import utilities (if used by seeds).

## Email Templates / Views

- `src/views/template_email*.js`: Email HTML template generators (multi-language).
- `src/views/test_template.html`: Static HTML template used for testing.

## Public Assets

- `public/exercises/**`: Exercise JSON + images served by `app.js`.
