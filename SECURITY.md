# Security

## Secret rotation (do this NOW if any of these were ever committed, shared, or copied into a container image)

The following secrets live in `max_muscle_coaching_back/.env`:

- `JWT_SECRET`
- `AUTH_USER_PASSWORD` (SMTP)
- `ENCRYPTION_KEY` (if used for at-rest field encryption)
- `DB_PASSWORD`

Rotate **all of them** if any of the following ever happened:

- `.env` was committed to git (even briefly).
- The Dockerfile copied `.env` into an image layer (no `.dockerignore` before).
- The path-traversal bug in `app.js` was deployed (any version before the fix at `253de65`).

### How to rotate

1. **JWT_SECRET** — generate a fresh 64-byte hex string:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Update `.env`, restart the API. Every outstanding access + refresh token will be invalidated. Users will be forced to sign in again — by design.

2. **SMTP password (`AUTH_USER_PASSWORD`)** — rotate from the mail provider's dashboard (OVH webmail → account settings → password). Update `.env`. Restart the API.

3. **`ENCRYPTION_KEY`** — only relevant if the app encrypts fields at rest. Rotating it requires re-encrypting existing data; coordinate before rotating.

4. **`DB_PASSWORD`** — issue `ALTER USER ... IDENTIFIED BY '<new>'` on MySQL, update `.env`, restart the API.

5. Audit any container registry the image may have been pushed to. If unsure, delete affected tags and rebuild.

## Image hygiene

`.dockerignore` now excludes `.env*`, `.git`, `node_modules`, logs, tests, docs. Build images from a clean checkout; inject runtime secrets via `docker run --env-file <path-outside-image>` or a secrets manager (Doppler, AWS Secrets Manager, Vault).

## Android release signing

`android/app/build.gradle` now loads `android/key.properties` (gitignored) and uses it for the `release` build type. Without `key.properties`, the build falls back to debug keys — Play Store will reject those, so do this BEFORE shipping:

1. Generate an upload keystore **outside the repo**:
   ```bash
   keytool -genkey -v -keystore ~/keys/max-muscle-upload.jks \
     -keyalg RSA -keysize 2048 -validity 10000 -alias upload
   ```

2. Copy the template:
   ```bash
   cp max_muscle_coaching_front/android/key.properties.example \
      max_muscle_coaching_front/android/key.properties
   ```
   Fill in `storePassword`, `keyPassword`, `keyAlias=upload`, and the absolute path to the `.jks`.

3. Enroll in **Play App Signing** on the first upload so Google holds the app signing key — losing the upload key then only means rotating the upload key, not losing the app forever.

4. Back up `key.properties` + the `.jks` to a password manager / secrets vault. Never commit them. Never let CI cache them outside of secret stores.

5. Verify with `./gradlew signingReport` from `max_muscle_coaching_front/android`.

## Reporting vulnerabilities

Email the maintainer privately rather than opening a public issue.
