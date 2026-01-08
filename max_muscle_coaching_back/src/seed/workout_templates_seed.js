/**
 * Seed script: workout templates
 *
 * Builds workout templates by selecting eligible exercises from the exercise catalog,
 * then stores:
 * - WorkoutTemplate (metadata)
 * - WorkoutTemplateExercise (exercise order + sets/reps/rest/notes)
 *
 * Usage:
 * - `npm run seed:templates`
 */
const dotenv = require("dotenv");
const fs = require("fs/promises");
const path = require("path");

dotenv.config();

const { sequelize } = require("../config/db.config");

const WorkoutTemplate = require("../models/workout_template_model");
const WorkoutTemplateExercise = require("../models/workout_template_exercise_model");
const Exercise = require("../models/exercise_model");

const EXERCISES_ROOT = path.resolve(__dirname, "../../public/exercises");

const HOME_EQUIPMENT = new Set([
  "body only",
  "dumbbell",
  "bands",
  "kettlebells",
  "medicine ball",
  "exercise ball",
  "foam roll",
  "other",
]);

function normalizeKey(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function normalizeExerciseLevel(value) {
  const level = normalizeKey(value);
  if (level === "beginner") return "beginner";
  if (level === "intermediate") return "intermediate";
  if (level === "expert" || level === "advanced") return "expert";
  return "unknown";
}

function normalizeFitnessLevel(value) {
  const level = normalizeKey(value);
  if (level.startsWith("beg")) return "beginner";
  if (level.startsWith("int")) return "intermediate";
  if (level.startsWith("adv") || level.startsWith("exp")) return "expert";
  return "beginner";
}

function allowedExerciseLevelsForFitnessLevel(fitnessLevel) {
  const normalized = normalizeFitnessLevel(fitnessLevel);
  if (normalized === "beginner") return new Set(["beginner"]);
  if (normalized === "intermediate")
    return new Set(["beginner", "intermediate"]);
  return new Set(["beginner", "intermediate", "expert", "unknown"]);
}

function isEquipmentAllowedForLocation(equipment, location) {
  const normalizedLocation = normalizeKey(location);
  if (normalizedLocation !== "home") return true;
  return HOME_EQUIPMENT.has(normalizeKey(equipment));
}

function isAllowedStrengthCategory(category, fitnessLevel) {
  const normalizedCategory = normalizeKey(category);
  const level = normalizeFitnessLevel(fitnessLevel);

  if (normalizedCategory === "stretching" || normalizedCategory === "cardio") {
    return false;
  }

  if (level !== "expert" && normalizedCategory === "olympic weightlifting") {
    return false;
  }

  if (level === "beginner" && normalizedCategory === "plyometrics") {
    return false;
  }

  return true;
}

async function loadExerciseMetaByName(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const metaByName = new Map();

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const exerciseJsonPath = path.join(rootDir, entry.name, "exercise.json");

    let raw;
    try {
      raw = await fs.readFile(exerciseJsonPath, "utf8");
    } catch {
      continue;
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      continue;
    }

    const name = typeof payload?.name === "string" ? payload.name.trim() : "";
    if (!name) continue;

    const key = normalizeKey(name);
    metaByName.set(key, {
      name,
      level: normalizeKey(payload?.level),
      mechanic: normalizeKey(payload?.mechanic),
      equipment: normalizeKey(payload?.equipment),
      category: normalizeKey(payload?.category),
      primaryMuscles: Array.isArray(payload?.primaryMuscles)
        ? payload.primaryMuscles.map(normalizeKey).filter(Boolean)
        : [],
      secondaryMuscles: Array.isArray(payload?.secondaryMuscles)
        ? payload.secondaryMuscles.map(normalizeKey).filter(Boolean)
        : [],
    });
  }

  return metaByName;
}

function buildExerciseCatalog(dbExercises, fileMetaByName) {
  const catalog = [];

  for (const dbExercise of dbExercises) {
    const key = normalizeKey(dbExercise.name);
    const meta = fileMetaByName.get(key);

    const primaryMuscles = meta?.primaryMuscles ?? [];
    const secondaryMuscles = meta?.secondaryMuscles ?? [];
    const muscles = Array.from(
      new Set([...primaryMuscles, ...secondaryMuscles])
    );

    catalog.push({
      id: dbExercise.id,
      name: dbExercise.name,
      key,
      level: normalizeExerciseLevel(dbExercise.level || meta?.level),
      mechanic: normalizeKey(dbExercise.mechanic || meta?.mechanic),
      equipment: normalizeKey(dbExercise.equipment || meta?.equipment),
      category: normalizeKey(dbExercise.category || meta?.category),
      primaryMuscles,
      secondaryMuscles,
      muscles,
    });
  }

  return catalog.filter((exercise) => exercise.id && exercise.name);
}

function keywordMatchCount(nameKey, keywords) {
  if (!keywords?.length) return 0;
  let count = 0;
  for (const keyword of keywords) {
    const normalized = normalizeKey(keyword);
    if (!normalized) continue;
    if (nameKey.includes(normalized)) count += 1;
  }
  return count;
}

function muscleMatchScore(exercise, targetMuscles) {
  if (!targetMuscles?.length) return 0;

  let score = 0;
  for (const muscle of targetMuscles) {
    const m = normalizeKey(muscle);
    if (!m) continue;
    if (exercise.primaryMuscles.includes(m)) score = Math.max(score, 30);
    else if (exercise.secondaryMuscles.includes(m)) score = Math.max(score, 15);
  }

  return score;
}

function isEligibleExercise(exercise, criteria) {
  const allowedLevels = allowedExerciseLevelsForFitnessLevel(
    criteria.fitnessLevel
  );
  if (!allowedLevels.has(exercise.level)) return false;

  if (!isEquipmentAllowedForLocation(exercise.equipment, criteria.location)) {
    return false;
  }

  if (
    !criteria.isRestDay &&
    !isAllowedStrengthCategory(exercise.category, criteria.fitnessLevel)
  ) {
    return false;
  }

  if (criteria.isRestDay && exercise.category !== "stretching") {
    return false;
  }

  return true;
}

function slotMatchesExercise(exercise, slot) {
  if (slot.musclesAny?.length) {
    const hasMuscle = slot.musclesAny.some((m) =>
      exercise.muscles.includes(normalizeKey(m))
    );
    if (!hasMuscle) return false;
  }

  if (slot.mustBeMechanic) {
    if (exercise.mechanic !== slot.mustBeMechanic) return false;
  }

  if (slot.keywordsAny?.length && slot.requireKeywordMatch) {
    const matches = slot.keywordsAny.some((k) =>
      exercise.key.includes(normalizeKey(k))
    );
    if (!matches) return false;
  }

  return true;
}

function scoreExerciseForSlot(exercise, slot) {
  let score = 0;

  score += muscleMatchScore(exercise, slot.musclesAny);

  if (slot.preferMechanic && exercise.mechanic === slot.preferMechanic) {
    score += 12;
  }

  if (slot.keywordsAny?.length) {
    score += keywordMatchCount(exercise.key, slot.keywordsAny) * 3;
  }

  if (slot.avoidKeywordsAny?.length) {
    const hasAvoided = slot.avoidKeywordsAny.some((k) =>
      exercise.key.includes(normalizeKey(k))
    );
    if (hasAvoided) score -= 50;
  }

  return score;
}

function levelPreferenceScore(exerciseLevel, fitnessLevel) {
  const userLevel = normalizeFitnessLevel(fitnessLevel);
  const level = normalizeExerciseLevel(exerciseLevel);

  if (userLevel === "beginner") return level === "beginner" ? 8 : 0;
  if (userLevel === "intermediate") {
    if (level === "intermediate") return 10;
    if (level === "beginner") return 4;
    return 0;
  }

  // Advanced / expert users still do foundational lifts, but prefer harder variations.
  if (level === "expert") return 10;
  if (level === "intermediate") return 6;
  if (level === "beginner") return 3;
  return 0;
}

function scoreExerciseForSlotWithCriteria(exercise, slot, criteria) {
  return (
    scoreExerciseForSlot(exercise, slot) +
    levelPreferenceScore(exercise.level, criteria.fitnessLevel)
  );
}

function pickBestExercise(exercises, usedIds, criteria, slot) {
  const candidates = exercises
    .filter((exercise) => !usedIds.has(exercise.id))
    .filter((exercise) => isEligibleExercise(exercise, criteria))
    .filter((exercise) => slotMatchesExercise(exercise, slot))
    .map((exercise) => ({
      exercise,
      score: scoreExerciseForSlotWithCriteria(exercise, slot, criteria),
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.exercise.name.localeCompare(b.exercise.name, "en")
    );

  return candidates[0]?.exercise ?? null;
}

function prescriptionForSlot(fitnessLevel, exercise, slot) {
  const level = normalizeFitnessLevel(fitnessLevel);
  const slotType = slot.type || "accessory";
  const isCompound =
    slotType === "compound" || exercise.mechanic === "compound";

  if (slotType === "core") {
    if (level === "beginner")
      return { sets: 3, reps: "10-20", restSeconds: 45 };
    if (level === "intermediate")
      return { sets: 3, reps: "12-20", restSeconds: 45 };
    return { sets: 4, reps: "12-25", restSeconds: 45 };
  }

  if (level === "beginner") {
    return isCompound
      ? { sets: 3, reps: "8-12", restSeconds: 90 }
      : { sets: 3, reps: "10-15", restSeconds: 60 };
  }

  if (level === "intermediate") {
    return isCompound
      ? { sets: 4, reps: "6-10", restSeconds: 120 }
      : { sets: 3, reps: "10-15", restSeconds: 75 };
  }

  return isCompound
    ? { sets: 5, reps: "4-8", restSeconds: 150 }
    : { sets: 4, reps: "8-15", restSeconds: 90 };
}

function estimatedDurationMinutes(fitnessLevel, exerciseCount, location) {
  const level = normalizeFitnessLevel(fitnessLevel);
  const isHome = normalizeKey(location) === "home";
  let base = isHome ? 40 : 50;

  if (level === "beginner") base = isHome ? 35 : 45;
  if (level === "intermediate") base = isHome ? 45 : 55;
  if (level === "expert") base = isHome ? 50 : 60;

  const delta = Math.max(0, exerciseCount - 5);
  return base + delta * 5;
}

function focusForCategory(category) {
  switch (category) {
    case "Push":
      return "Chest, Shoulders & Triceps";
    case "Pull":
      return "Back & Biceps";
    case "Legs":
      return "Legs & Core";
    case "Upper":
      return "Upper Body";
    case "Lower":
      return "Lower Body";
    case "Full Body":
      return "Total Body Strength";
    case "Chest":
      return "Chest";
    case "Back":
      return "Back";
    case "Shoulders":
      return "Shoulders";
    case "Arms":
      return "Biceps & Triceps";
    default:
      return category;
  }
}

function slotsForCategory(category) {
  switch (category) {
    case "Push":
      return [
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Chest press",
          musclesAny: ["chest"],
          preferMechanic: "compound",
          keywordsAny: ["bench", "press", "push-up"],
        },
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Shoulder press",
          musclesAny: ["shoulders"],
          preferMechanic: "compound",
          keywordsAny: ["press"],
          avoidKeywordsAny: ["behind the neck"],
        },
        {
          type: "accessory",
          label: "Chest accessory",
          musclesAny: ["chest"],
          preferMechanic: "isolation",
          keywordsAny: ["fly", "cable", "pec", "incline"],
        },
        {
          type: "accessory",
          label: "Shoulder accessory",
          musclesAny: ["shoulders"],
          preferMechanic: "isolation",
          keywordsAny: ["lateral", "raise", "upright row"],
        },
        {
          type: "accessory",
          label: "Triceps",
          musclesAny: ["triceps"],
          preferMechanic: "isolation",
          keywordsAny: ["pushdown", "extension", "skull", "dip"],
        },
        {
          type: "core",
          label: "Core",
          musclesAny: ["abdominals"],
          keywordsAny: ["crunch", "plank", "sit-up", "rollout"],
        },
      ];
    case "Pull":
      return [
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Vertical pull",
          musclesAny: ["lats", "middle back"],
          preferMechanic: "compound",
          keywordsAny: ["pull-up", "pullup", "pulldown", "chin-up", "chinup"],
        },
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Row",
          musclesAny: ["middle back", "lats"],
          preferMechanic: "compound",
          keywordsAny: ["row"],
        },
        {
          type: "accessory",
          label: "Rear delt / traps",
          musclesAny: ["traps", "shoulders"],
          preferMechanic: "isolation",
          keywordsAny: ["face pull", "rear delt", "shrug"],
        },
        {
          type: "accessory",
          label: "Biceps",
          musclesAny: ["biceps"],
          preferMechanic: "isolation",
          keywordsAny: ["curl"],
        },
        {
          type: "accessory",
          label: "Forearms / grip",
          musclesAny: ["forearms"],
          preferMechanic: "isolation",
          keywordsAny: ["wrist", "grip", "roller", "carry"],
        },
        {
          type: "core",
          label: "Core",
          musclesAny: ["abdominals", "lower back"],
          keywordsAny: ["back extension", "hyperextension", "plank"],
        },
      ];
    case "Legs":
      return [
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Squat pattern",
          musclesAny: ["quadriceps", "glutes"],
          preferMechanic: "compound",
          keywordsAny: ["squat", "leg press"],
        },
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Hinge pattern",
          musclesAny: ["hamstrings", "glutes", "lower back"],
          preferMechanic: "compound",
          keywordsAny: [
            "deadlift",
            "romanian",
            "rdl",
            "hip thrust",
            "good morning",
          ],
        },
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Unilateral",
          musclesAny: ["quadriceps", "glutes"],
          preferMechanic: "compound",
          keywordsAny: ["lunge", "split squat", "step-up", "step up"],
        },
        {
          type: "accessory",
          label: "Hamstring isolation",
          musclesAny: ["hamstrings"],
          preferMechanic: "isolation",
          keywordsAny: ["leg curl", "hamstring curl"],
        },
        {
          type: "accessory",
          label: "Quad isolation",
          musclesAny: ["quadriceps"],
          preferMechanic: "isolation",
          keywordsAny: ["leg extension"],
        },
        {
          type: "accessory",
          label: "Calves",
          musclesAny: ["calves"],
          preferMechanic: "isolation",
          keywordsAny: ["calf"],
        },
        {
          type: "core",
          label: "Core",
          musclesAny: ["abdominals"],
          keywordsAny: ["plank", "crunch", "sit-up"],
        },
      ];
    case "Upper":
      return [
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Upper push",
          musclesAny: ["chest"],
          preferMechanic: "compound",
          keywordsAny: ["bench", "press", "push-up"],
        },
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Upper pull",
          musclesAny: ["lats", "middle back"],
          preferMechanic: "compound",
          keywordsAny: ["row", "pulldown", "pull-up", "pullup"],
        },
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Shoulders",
          musclesAny: ["shoulders"],
          preferMechanic: "compound",
          keywordsAny: ["press"],
        },
        {
          type: "accessory",
          label: "Chest accessory",
          musclesAny: ["chest"],
          preferMechanic: "isolation",
          keywordsAny: ["fly", "cable"],
        },
        {
          type: "accessory",
          label: "Back accessory",
          musclesAny: ["lats", "middle back"],
          preferMechanic: "isolation",
          keywordsAny: ["pullover", "face pull"],
        },
        {
          type: "accessory",
          label: "Arms",
          musclesAny: ["biceps", "triceps"],
          keywordsAny: ["curl", "extension", "pushdown"],
        },
      ];
    case "Lower":
      return [
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Squat pattern",
          musclesAny: ["quadriceps", "glutes"],
          preferMechanic: "compound",
          keywordsAny: ["squat", "leg press"],
        },
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Hinge pattern",
          musclesAny: ["hamstrings", "glutes"],
          preferMechanic: "compound",
          keywordsAny: ["deadlift", "rdl", "hip thrust", "good morning"],
        },
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Unilateral",
          musclesAny: ["quadriceps", "glutes"],
          preferMechanic: "compound",
          keywordsAny: ["lunge", "split squat", "step-up", "step up"],
        },
        {
          type: "accessory",
          label: "Hamstrings",
          musclesAny: ["hamstrings"],
          keywordsAny: ["leg curl"],
        },
        {
          type: "accessory",
          label: "Calves",
          musclesAny: ["calves"],
          keywordsAny: ["calf"],
        },
        {
          type: "core",
          label: "Core",
          musclesAny: ["abdominals"],
          keywordsAny: ["plank", "crunch", "sit-up"],
        },
      ];
    case "Full Body":
      return [
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Lower compound",
          musclesAny: ["quadriceps", "glutes"],
          preferMechanic: "compound",
          keywordsAny: ["squat", "deadlift", "leg press"],
        },
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Upper push",
          musclesAny: ["chest", "shoulders"],
          preferMechanic: "compound",
          keywordsAny: ["press", "push-up", "bench"],
        },
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Upper pull",
          musclesAny: ["lats", "middle back"],
          preferMechanic: "compound",
          keywordsAny: ["row", "pulldown", "pull-up", "pullup"],
        },
        {
          type: "accessory",
          label: "Posterior chain",
          musclesAny: ["hamstrings", "glutes", "lower back"],
          keywordsAny: ["hip thrust", "glute bridge", "back extension"],
        },
        {
          type: "core",
          label: "Core",
          musclesAny: ["abdominals"],
          keywordsAny: ["plank", "crunch", "rollout"],
        },
      ];
    case "Chest":
      return [
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Chest press",
          musclesAny: ["chest"],
          preferMechanic: "compound",
          keywordsAny: ["bench", "press", "push-up"],
        },
        {
          type: "accessory",
          label: "Chest accessory",
          musclesAny: ["chest"],
          preferMechanic: "isolation",
          keywordsAny: ["fly", "cable", "pec"],
        },
        {
          type: "accessory",
          label: "Triceps",
          musclesAny: ["triceps"],
          keywordsAny: ["pushdown", "extension", "dip"],
        },
        {
          type: "accessory",
          label: "Shoulders",
          musclesAny: ["shoulders"],
          keywordsAny: ["press", "raise"],
        },
      ];
    case "Back":
      return [
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Vertical pull",
          musclesAny: ["lats", "middle back"],
          preferMechanic: "compound",
          keywordsAny: ["pulldown", "pull-up", "pullup", "chin-up", "chinup"],
        },
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Row",
          musclesAny: ["middle back", "lats"],
          preferMechanic: "compound",
          keywordsAny: ["row"],
        },
        {
          type: "accessory",
          label: "Traps / rear delts",
          musclesAny: ["traps", "shoulders"],
          keywordsAny: ["shrug", "face pull", "rear delt"],
        },
        {
          type: "accessory",
          label: "Biceps",
          musclesAny: ["biceps"],
          keywordsAny: ["curl"],
        },
      ];
    case "Shoulders":
      return [
        {
          type: "compound",
          mustBeMechanic: "compound",
          label: "Overhead press",
          musclesAny: ["shoulders"],
          preferMechanic: "compound",
          keywordsAny: ["press"],
          avoidKeywordsAny: ["behind the neck"],
        },
        {
          type: "accessory",
          label: "Lateral delts",
          musclesAny: ["shoulders"],
          keywordsAny: ["lateral", "raise"],
        },
        {
          type: "accessory",
          label: "Rear delts / upper back",
          musclesAny: ["shoulders", "traps"],
          keywordsAny: ["rear delt", "face pull"],
        },
        {
          type: "accessory",
          label: "Traps",
          musclesAny: ["traps"],
          keywordsAny: ["shrug"],
        },
      ];
    case "Arms":
      return [
        {
          type: "accessory",
          label: "Biceps curl",
          musclesAny: ["biceps"],
          keywordsAny: ["curl"],
        },
        {
          type: "accessory",
          label: "Triceps extension",
          musclesAny: ["triceps"],
          keywordsAny: ["extension", "pushdown", "skull"],
        },
        {
          type: "accessory",
          label: "Biceps variation",
          musclesAny: ["biceps"],
          keywordsAny: ["curl", "hammer"],
        },
        {
          type: "accessory",
          label: "Triceps variation",
          musclesAny: ["triceps"],
          keywordsAny: ["extension", "dip", "pushdown"],
        },
      ];
    default:
      return [];
  }
}

async function createTemplateWithExercises(templateData, exercisesData) {
  return sequelize.transaction(async (transaction) => {
    const template = await WorkoutTemplate.create(templateData, {
      transaction,
    });

    const unique = new Map();
    for (const ex of exercisesData) {
      if (!ex?.exerciseId) continue;
      unique.set(ex.exerciseId, ex);
    }

    const entries = Array.from(unique.values()).map((ex, index) => ({
      workoutTemplateId: template.id,
      exerciseId: ex.exerciseId,
      orderIndex: index + 1,
      sets: ex.sets,
      reps: ex.reps,
      restSeconds: ex.restSeconds,
      notes: ex.notes || "",
    }));

    await WorkoutTemplateExercise.bulkCreate(entries, { transaction });
    return template;
  });
}

async function buildAndCreateTemplate({
  exercises,
  usedByGroup,
  split,
  category,
  fitnessLevel,
  location,
  variant,
}) {
  const groupKey = `${split}|${category}|${fitnessLevel}|${location}`;
  const groupUsedIds = usedByGroup.get(groupKey) || new Set();

  const criteria = {
    fitnessLevel,
    location,
    isRestDay: false,
  };

  const usedIds = new Set(groupUsedIds);
  const slots = slotsForCategory(category);

  const picked = [];
  for (const slot of slots) {
    const exercise = pickBestExercise(exercises, usedIds, criteria, slot);
    if (!exercise) {
      // If we can't satisfy a required slot, skip this template
      return { status: "skipped", reason: `no_match:${slot.label}` };
    }

    usedIds.add(exercise.id);

    const prescription = prescriptionForSlot(fitnessLevel, exercise, slot);
    picked.push({
      exerciseId: exercise.id,
      sets: prescription.sets,
      reps: prescription.reps,
      restSeconds: prescription.restSeconds,
      notes: slot.label,
    });
  }

  const name = `${category} Day ${variant} - ${fitnessLevel} ${location}`;
  const templateData = {
    name,
    dayOfWeek: "Any",
    category,
    split,
    fitnessLevel,
    location,
    focus: focusForCategory(category),
    estimatedDurationMinutes: estimatedDurationMinutes(
      fitnessLevel,
      picked.length,
      location
    ),
    isRestDay: false,
  };

  await createTemplateWithExercises(templateData, picked);

  for (const ex of picked) groupUsedIds.add(ex.exerciseId);
  usedByGroup.set(groupKey, groupUsedIds);

  return { status: "created", name };
}

async function seedWorkoutTemplates() {
  try {
    console.log("Starting workout templates seed (smart selector)...");
    await sequelize.authenticate();

    // Clear existing templates
    await WorkoutTemplateExercise.destroy({ where: {} });
    await WorkoutTemplate.destroy({ where: {} });

    const dbExercises = await Exercise.findAll({
      attributes: ["id", "name", "level", "mechanic", "equipment", "category"],
    });
    if (!dbExercises.length) {
      console.log(
        "No exercises found in database. Please seed exercises first."
      );
      return;
    }

    const fileMetaByName = await loadExerciseMetaByName(EXERCISES_ROOT);
    const exercises = buildExerciseCatalog(dbExercises, fileMetaByName);

    console.log(
      `Loaded ${exercises.length} exercises (with file metadata: ${fileMetaByName.size}).`
    );

    const usedByGroup = new Map();
    const results = { created: 0, skipped: 0, skippedReasons: {} };

    const fitnessLevels = ["Beginner", "Intermediate", "Advanced"];
    const locations = ["Gym", "Home"];

    const splitSpecs = [
      {
        split: "Push/Pull/Legs",
        categories: ["Push", "Pull", "Legs"],
        variants: ["A", "B"],
      },
      {
        split: "Upper/Lower",
        categories: ["Upper", "Lower"],
        variants: ["A", "B"],
      },
      {
        split: "Full Body",
        categories: ["Full Body"],
        variants: ["A", "B"],
      },
      {
        split: "Bro Split",
        categories: ["Chest", "Back", "Legs", "Shoulders", "Arms"],
        variants: ["A"],
      },
    ];

    for (const fitnessLevel of fitnessLevels) {
      for (const location of locations) {
        for (const spec of splitSpecs) {
          for (const category of spec.categories) {
            for (const variant of spec.variants) {
              const result = await buildAndCreateTemplate({
                exercises,
                usedByGroup,
                split: spec.split,
                category,
                fitnessLevel,
                location,
                variant,
              });

              if (result.status === "created") {
                results.created += 1;
              } else {
                results.skipped += 1;
                results.skippedReasons[result.reason] =
                  (results.skippedReasons[result.reason] || 0) + 1;
              }
            }
          }
        }
      }
    }

    // Rest day template
    await WorkoutTemplate.create({
      name: "Rest Day - Mobility & Stretching",
      dayOfWeek: "Any",
      category: "Rest",
      split: "Any",
      fitnessLevel: "Any",
      location: "Any",
      focus: "Rest & Recovery",
      estimatedDurationMinutes: 0,
      isRestDay: true,
    });

    const count = await WorkoutTemplate.count();
    console.log(`✅ Seeded ${count} workout templates successfully!`);
    console.log(`Created: ${results.created}, skipped: ${results.skipped}`);
    if (results.skipped) {
      console.log("Skipped reasons:", results.skippedReasons);
    }
  } catch (error) {
    console.error("Error seeding workout templates:", error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the seed function
seedWorkoutTemplates()
  .then(() => {
    console.log("\nSeed completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
