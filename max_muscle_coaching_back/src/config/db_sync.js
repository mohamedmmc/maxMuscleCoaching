/**
 * DB sync helper.
 *
 * - Supports controlled `sequelize.sync()` based on env:
 *   - `DB_SYNC_FORCE=true` → `sync({ force: true })`
 *   - `DB_SYNC_ALTER=true` → `sync({ alter: true })`
 * - Drops legacy exercise history tables when present (helps migrate older schemas).
 */
function normalizeTableName(table) {
  if (!table) return null;
  if (typeof table === "string") return table;
  if (typeof table === "object") return table.tableName || table.name || null;
  return String(table);
}

function getSyncOptionsFromEnv() {
  const force = String(process.env.DB_SYNC_FORCE || "").toLowerCase() === "true";
  const alter = String(process.env.DB_SYNC_ALTER || "").toLowerCase() === "true";

  if (force) return { force: true };
  if (alter) return { alter: true };
  return {};
}

async function dropExerciseHistoryTableIfExists(sequelize) {
  const queryInterface = sequelize.getQueryInterface();
  const rawTables = await queryInterface.showAllTables();
  const tables = rawTables.map(normalizeTableName).filter(Boolean);

  const candidates = new Set(
    [
      "ExerciseHistories",
      "ExerciseHistory",
      "exercise_histories",
      "exercise_history",
      "exercisehistory",
    ].map((name) => name.toLowerCase())
  );

  const toDrop = tables.filter((name) => candidates.has(name.toLowerCase()));
  for (const tableName of toDrop) {
    await queryInterface.dropTable(tableName);
  }

  return toDrop;
}

async function syncDatabase(sequelize) {
  const dropped = await dropExerciseHistoryTableIfExists(sequelize);
  await sequelize.sync(getSyncOptionsFromEnv());
  return { dropped };
}

module.exports = {
  syncDatabase,
};
