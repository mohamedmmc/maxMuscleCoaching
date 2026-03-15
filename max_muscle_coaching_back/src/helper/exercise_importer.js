/**
 * Exercise importer utilities.
 *
 * Imports exercises from `public/exercises/<folder>/exercise.json` into the DB, including:
 * - Exercise core fields (name/force/level/mechanic/equipment/category)
 * - Muscles (`ExerciseMuscles` join table)
 * - Instructions
 * - Gallery (image links)
 *
 * Used by seed scripts and maintenance tasks.
 */
const fs = require("fs/promises");
const path = require("path");

const { sequelize } = require("../config/db.config");

const Exercise = require("../models/exercise_model");
const Muscle = require("../models/muscle_model");
const ExerciseMuscle = require("../models/exercise_muscle_model");
const Instruction = require("../models/instruction_model");
const Gallery = require("../models/gallery_model");

function asNonEmptyString(value, fallback) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed ? trimmed : fallback;
}

function normalizeMuscleName(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed ? trimmed.toLowerCase() : "";
}

function isImageFilename(filename) {
  return /\.(jpe?g|png|gif|webp)$/i.test(filename);
}

async function listExerciseFolders(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getImageLinksForFolder({
  folderName,
  folderPath,
  publicBasePath,
}) {
  const imagesDir = path.join(folderPath, "images");
  if (!(await fileExists(imagesDir))) return [];

  const entries = await fs.readdir(imagesDir, { withFileTypes: true });
  const imageFiles = entries
    .filter((entry) => entry.isFile() && isImageFilename(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "en"));

  return imageFiles.map((filename) =>
    path.posix.join(publicBasePath, folderName, "images", filename)
  );
}

async function importExerciseFromFolder({
  folderName,
  folderPath,
  publicBasePath,
  upsert,
}) {
  const exerciseJsonPath = path.join(folderPath, "exercise.json");
  if (!(await fileExists(exerciseJsonPath))) {
    return { status: "skipped", reason: "missing_exercise_json" };
  }

  let payload;
  try {
    payload = JSON.parse(await fs.readFile(exerciseJsonPath, "utf8"));
  } catch (error) {
    return { status: "failed", reason: "invalid_json", message: error.message };
  }

  const name = asNonEmptyString(payload?.name, "");
  if (!name) {
    return { status: "failed", reason: "missing_name" };
  }

  const exerciseData = {
    name,
    force: asNonEmptyString(payload?.force, "unknown"),
    level: asNonEmptyString(payload?.level, "unknown"),
    mechanic: asNonEmptyString(payload?.mechanic, "unknown"),
    equipment: asNonEmptyString(payload?.equipment, "unknown"),
    category: asNonEmptyString(payload?.category, "unknown"),
  };

  const primaryMuscles = Array.isArray(payload?.primaryMuscles)
    ? payload.primaryMuscles
    : [];
  const secondaryMuscles = Array.isArray(payload?.secondaryMuscles)
    ? payload.secondaryMuscles
    : [];

  const primaryMuscleNames = [
    ...new Set(primaryMuscles.map(normalizeMuscleName).filter(Boolean)),
  ];
  const primaryMuscleSet = new Set(primaryMuscleNames);
  const secondaryMuscleNames = [
    ...new Set(
      secondaryMuscles
        .map(normalizeMuscleName)
        .filter((name) => name && !primaryMuscleSet.has(name))
    ),
  ];

  const instructionTexts = Array.isArray(payload?.instructions)
    ? payload.instructions
        .map((text) => asNonEmptyString(String(text ?? ""), ""))
        .filter(Boolean)
    : [];

  const imageLinks = await getImageLinksForFolder({
    folderName,
    folderPath,
    publicBasePath,
  });

  return sequelize.transaction(async (transaction) => {
    const existingExercise = await Exercise.findOne({
      where: { name: exerciseData.name },
      transaction,
    });

    if (existingExercise && !upsert) {
      return {
        status: "skipped",
        reason: "already_exists",
        id: existingExercise.id,
      };
    }

    const exercise = existingExercise
      ? await existingExercise.update(exerciseData, { transaction })
      : await Exercise.create(exerciseData, { transaction });

    const muscleByName = new Map();
    const uniqueNames = [...new Set([...primaryMuscleNames, ...secondaryMuscleNames])];
    for (const muscleName of uniqueNames) {
      const [muscle] = await Muscle.findOrCreate({
        where: { name: muscleName },
        defaults: { name: muscleName },
        transaction,
      });
      muscleByName.set(muscleName, muscle);
    }

    await ExerciseMuscle.destroy({
      where: { exerciseId: exercise.id },
      transaction,
    });
    const muscleRows = [];
    for (const muscleName of primaryMuscleNames) {
      const muscle = muscleByName.get(muscleName);
      if (!muscle) continue;
      muscleRows.push({
        exerciseId: exercise.id,
        muscleId: muscle.id,
        role: "primary",
      });
    }
    for (const muscleName of secondaryMuscleNames) {
      const muscle = muscleByName.get(muscleName);
      if (!muscle) continue;
      muscleRows.push({
        exerciseId: exercise.id,
        muscleId: muscle.id,
        role: "secondary",
      });
    }
    if (muscleRows.length) {
      await ExerciseMuscle.bulkCreate(muscleRows, {
        transaction,
        ignoreDuplicates: true,
      });
    }

    await Instruction.destroy({
      where: { ExerciseId: exercise.id },
      transaction,
    });
    if (instructionTexts.length) {
      await Instruction.bulkCreate(
        instructionTexts.map((text) => ({ text, ExerciseId: exercise.id })),
        { transaction }
      );
    }

    const galleryItems = [];
    for (const link of imageLinks) {
      galleryItems.push({ exerciseId: exercise.id, link, type: "image" });
    }
    await Gallery.destroy({ where: { exerciseId: exercise.id }, transaction });
    if (galleryItems.length) {
      await Gallery.bulkCreate(galleryItems, { transaction });
    }

    return {
      status: existingExercise ? "updated" : "created",
      id: exercise.id,
    };
  });
}

async function importExercisesFromPublicExercises(options = {}) {
  const {
    rootDir = path.resolve(__dirname, "../../public/exercises"),
    publicBasePath = "/exercises",
    upsert = true,
    limit,
    sync = true,
    syncOptions = { alter: true },
    onProgress,
  } = options;

  if (sync) {
    await sequelize.sync(syncOptions);
  }

  const folders = await listExerciseFolders(rootDir);
  const selectedFolders =
    typeof limit === "number" ? folders.slice(0, limit) : folders;

  const summary = {
    rootDir,
    processed: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  };

  for (const folderName of selectedFolders) {
    const folderPath = path.join(rootDir, folderName);
    const result = await importExerciseFromFolder({
      folderName,
      folderPath,
      publicBasePath,
      upsert,
    });

    summary.processed += 1;
    summary[result.status] = (summary[result.status] || 0) + 1;

    if (result.status === "failed") {
      summary.errors.push({ folderName, ...result });
    }

    if (typeof onProgress === "function") {
      onProgress({ folderName, result, summary });
    }
  }

  return summary;
}

module.exports = {
  importExercisesFromPublicExercises,
};
