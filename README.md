# 💪 Max Muscle Coaching

> Smart fitness coaching platform with real-time progress tracking, personalized workout recommendations, and gamification — built with **Node.js/Express** backend and **Flutter** mobile app.

---

## Overview

Max Muscle Coaching is a full-stack fitness coaching application that combines a robust REST API with a cross-platform mobile app. It features an intelligent workout recommendation engine that adapts to each user's profile, preferences, and schedule.

### Key Highlights

- **Smart Daily Workouts** — Automatic assignment based on user's split, fitness level, and weekly schedule
- **Real-Time Tracking** — Set-by-set logging with weight, reps, and notes
- **Advanced Analytics** — Gamification with points/levels, 7-day trends, muscle ranking
- **Multi-Auth** — Email/password, Google, Facebook, Apple sign-in
- **Multi-Language** — English, French, Spanish, Arabic
- **Cross-Platform** — iOS, Android, macOS from a single Flutter codebase

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18.x | Runtime |
| **Express.js** | 4.19.2 | HTTP framework |
| **MySQL** | 8.x | Database |
| **Sequelize** | 6.28.0 | ORM |
| **JWT** | — | Authentication |
| **Bcrypt** | 5.1.0 | Password hashing |
| **Nodemailer** | 6.9.9 | Email service |
| **Firebase Admin** | 12.3.0 | Push notifications |
| **Sharp** | 0.33.2 | Image processing |
| **Docker** | Alpine 18.19 | Containerization |

### Frontend (Mobile)

| Technology | Version | Purpose |
|---|---|---|
| **Flutter** | SDK 3.6.1+ | UI framework |
| **Dart** | 3.6.1+ | Language |
| **GetX** | 4.6.6 | State management & DI |
| **HTTP** | 1.2.0 | API communication |
| **Google Sign-In** | 6.2.2 | Social authentication |
| **SharedPreferences** | 2.3.3 | Local storage |
| **JWT Decoder** | 2.0.1 | Token handling |

---

## Architecture

```
┌──────────────────┐      HTTP/REST       ┌──────────────────┐      Sequelize      ┌──────────────┐
│   Flutter App    │ ◄──────────────────► │  Express.js API  │ ◄──────────────────► │    MySQL     │
│  iOS / Android   │      JWT Auth        │    Port 3001     │        ORM          │   Database   │
│     / macOS      │                      │                  │                      │              │
└──────────────────┘                      └──────────────────┘                      └──────────────┘
```

### Backend Architecture (MVC + Service Layer)

```
src/
├── models/           # 11 Sequelize models
├── controllers/      # Request handlers (user, workout)
├── services/         # Business logic (workout engine)
├── routes/           # Express route definitions
├── middlewares/       # JWT verification, validation
├── config/           # Database configuration
├── seed/             # Data population scripts
├── helper/           # Utilities
├── views/            # Email templates (EN, FR, AR)
└── public/           # Exercise images & assets
```

### Frontend Architecture (GetX + Repository Pattern)

```
lib/
├── controllers/      # Global app state (AppController)
├── screens/          # UI pages (login, dashboard, workout, profile, onboarding)
├── repository/       # API abstraction layer (user, workout)
├── models/           # Data classes & DTOs
├── networking/       # HTTP client, exceptions, logger
├── services/         # Auth, connectivity, preferences, snackbar
├── widgets/          # Reusable components (GlassDock, ExerciseCard, etc.)
├── theme/            # Colors, typography, translations (4 languages)
├── storage/          # SharedPreferences keys
└── helper/           # Constants & utilities
```

---

## Database Schema

11 MySQL tables with complex relationships:

| Model | Purpose |
|---|---|
| **User** | Profiles with auth methods, physical data, workout preferences |
| **Exercise** | Catalog with force, level, mechanic, equipment, category |
| **Muscle** | Muscle group definitions |
| **ExerciseMuscle** | Exercise ↔ Muscle (primary/secondary targeting) |
| **Gallery** | Exercise images and videos |
| **Instruction** | Step-by-step exercise instructions |
| **WorkoutTemplate** | Pre-designed plans (split, level, location, duration) |
| **WorkoutTemplateExercise** | Template ↔ Exercise config (sets, reps, order) |
| **WorkoutHistory** | User workout sessions (date, completion status) |
| **WorkoutHistoryExercise** | Per-exercise performance data (JSON performed sets) |
| **VerificationCode** | Email/phone OTP codes |

---

## API Endpoints

All workout endpoints require JWT Bearer authentication.

### User Routes — `/users`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users/signin` | Sign in (email/phone + password OR social IDs) |
| `POST` | `/users/signup` | Register with profile and fitness preferences |
| `POST` | `/users/renew` | Renew JWT access token via refresh token |
| `GET` | `/users/profile` | Get authenticated user profile |

### Workout Routes — `/workouts`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/workouts/recommended` | Get recommended templates based on user profile |
| `GET` | `/workouts/today` | Get or create today's workout session |
| `GET` | `/workouts/stats` | Complete stats (gamification, trends, top muscles) |
| `GET` | `/workouts/history` | Paginated workout history |
| `GET` | `/workouts/history/:id` | Single session detail with exercise progress |
| `PUT` | `/workouts/history/:id/exercises/:exerciseId` | Update exercise progress (performedSets) |
| `POST` | `/workouts/history/:id/finish` | Mark workout as completed |

---

## Smart Workout Engine

The recommendation engine uses a **5-tier fallback system** to always find the best workout:

1. **Strict Match** — Split + category + level + location + duration, avoiding recent repeats
2. **Ignore Duration** — Same criteria without duration constraint
3. **Allow Repeats** — Permits reusing recently assigned templates
4. **Broader Category** — Any template matching split and category
5. **Fallback** — Any available non-rest template

### Supported Splits

- **Push/Pull/Legs** — Movement-based separation (3-6 days/week)
- **Upper/Lower** — Upper and lower body alternation (4 days/week)
- **Full Body** — Complete training each session (2-3 days/week)
- **Bro Split** — One muscle group per day (5-6 days/week)

### Training Schedule

| Days/Week | Schedule |
|---|---|
| 3 | Mon, Wed, Fri |
| 4 | Mon, Tue, Thu, Fri |
| 5 | Mon–Wed, Fri, Sat |
| 6 | Mon–Sat |
| 7 | Every day |

---

## Mobile App Screens

| Screen | Features |
|---|---|
| **Login** | Email/password, Google Sign-In, "Stay logged in", forgot password |
| **Onboarding** | 3-step wizard: basic info → fitness level → workout preferences |
| **Dashboard** | Stats cards, 7-day chart, top muscles, active session banner, gamification |
| **Workout** | Daily workout preview, exercise details with images, set-by-set logging, rest timer |
| **Profile** | User info, fitness stats, preferences, linked accounts, settings |
| **Forgot Password** | Email → OTP verification → password reset |

### Design System

- **Theme**: Dark-only with Volt (#CCFF00) accent
- **Navigation**: Bottom tab bar with glassmorphic GlassDock
- **Components**: ExerciseCard, SimpleAreaChart, PrimaryButton, shimmer loading states
- **Orientation**: Portrait-only lock

---

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+
- Flutter SDK 3.6.1+
- Docker (optional)

### Backend Setup

```bash
cd max_muscle_coaching_back

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Start the server
npm start

# Seed exercise data
npm run seed:exercises

# Generate workout templates
npm run seed:templates

# (Optional) Create mock workout history
npm run seed:mockhistory
```

### Frontend Setup

```bash
cd max_muscle_coaching_front

# Get dependencies
flutter pub get

# Run on connected device/simulator
flutter run

# Build for release
flutter build apk      # Android
flutter build ios       # iOS
flutter build macos     # macOS
```

### Docker

```bash
cd max_muscle_coaching_back
docker build -t max-muscle-api .
docker run -p 3001:3001 max-muscle-api
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DB_HOST` | MySQL host |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_DB` | Database name |
| `DB_DIALECT` | Database dialect (mysql) |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRATION` | Access token TTL (e.g., `1m`) |
| `JWT_REFRESH_EXPIRATION` | Refresh token TTL (e.g., `90d`) |
| `AUTH_USER_EMAIL` | Email sender address |
| `AUTH_USER_PASSWORD` | Email sender password |
| `HOST_MAIL` | SMTP host |
| `MAIL_PORT` | SMTP port |

---

## Project Statistics

| Metric | Value |
|---|---|
| Database Models | 11 |
| API Endpoints | 10 |
| App Screens | 7 |
| Dart Files | 77 |
| Supported Languages | 4 (EN, FR, ES, AR) |
| Supported Splits | 4 (PPL, Upper/Lower, Full Body, Bro Split) |
| Auth Methods | 4 (Email, Google, Facebook, Apple) |

---

## Portfolio

Detailed technical portfolio documents are available:

- [Portfolio (Fran&ccedil;ais)](Max_Muscle_Coaching_Portfolio_FR.html)
- [Portfolio (English)](Max_Muscle_Coaching_Portfolio_EN.html)

---

## License

This project is private and proprietary.
