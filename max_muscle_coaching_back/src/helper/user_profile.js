/**
 * User profile normalization utilities.
 *
 * `buildUserProfileAttributes(payload)` extracts and sanitizes user profile fields
 * from an incoming request body (used during signup and profile updates).
 */
function toIntOrUndefined(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toFloatOrUndefined(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function dateOnlyOrUndefined(value) {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return undefined;
}

function buildUserProfileAttributes(payload) {
  const {
    name,
    firstName,
    lastName,
    age,
    weight,
    height,
    birthdate,
    gender,
    fitnessLevel,
    injuryHistory,
    split,
    daysPerWeek,
    sessionDurationMinutes,
    location,
  } = payload || {};

  return {
    ...(name !== undefined ? { name } : {}),
    ...(firstName !== undefined ? { firstName } : {}),
    ...(lastName !== undefined ? { lastName } : {}),
    ...(age !== undefined ? { age: toIntOrUndefined(age) } : {}),
    ...(weight !== undefined ? { weight: toFloatOrUndefined(weight) } : {}),
    ...(height !== undefined ? { height: toFloatOrUndefined(height) } : {}),
    ...(birthdate !== undefined
      ? { birthdate: dateOnlyOrUndefined(birthdate) }
      : {}),
    ...(gender !== undefined ? { gender } : {}),
    ...(fitnessLevel !== undefined ? { fitnessLevel } : {}),
    ...(injuryHistory !== undefined ? { injuryHistory } : {}),
    ...(split !== undefined ? { split } : {}),
    ...(daysPerWeek !== undefined ? { daysPerWeek: toIntOrUndefined(daysPerWeek) } : {}),
    ...(sessionDurationMinutes !== undefined
      ? { sessionDurationMinutes: toIntOrUndefined(sessionDurationMinutes) }
      : {}),
    ...(location !== undefined ? { location } : {}),
  };
}

module.exports = {
  buildUserProfileAttributes,
  toIntOrUndefined,
  toFloatOrUndefined,
  dateOnlyOrUndefined,
};
