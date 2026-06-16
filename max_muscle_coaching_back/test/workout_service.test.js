const WorkoutService = require("../src/services/workout_service");

const svc = new WorkoutService();

describe("WorkoutService — input normalization", () => {
  describe("_normalizeFitnessLevel", () => {
    test.each([
      ["beginner", "Beginner"],
      ["BEG", "Beginner"],
      [" intermediate ", "Intermediate"],
      ["INT", "Intermediate"],
      ["advanced", "Advanced"],
      ["expert", "Advanced"],
      ["pro", "Advanced"],
      ["", "Beginner"],
      [null, "Beginner"],
      [undefined, "Beginner"],
      ["nonsense", "Beginner"],
    ])("%p -> %p", (input, expected) => {
      expect(svc._normalizeFitnessLevel(input)).toBe(expected);
    });
  });

  describe("_normalizeLocation", () => {
    test.each([
      ["home", "Home"],
      ["HOME GYM", "Home"],
      ["gym", "Gym"],
      ["GYM", "Gym"],
      ["", "Gym"],
      [null, "Gym"],
      ["outside", "Gym"],
    ])("%p -> %p", (input, expected) => {
      expect(svc._normalizeLocation(input)).toBe(expected);
    });
  });

  describe("_normalizeSplit", () => {
    test.each([
      ["ppl", "Push/Pull/Legs"],
      ["Push/Pull/Legs", "Push/Pull/Legs"],
      ["push pull legs", "Push/Pull/Legs"],
      ["upper/lower", "Upper/Lower"],
      ["Upper Lower", "Upper/Lower"],
      ["Full Body", "Full Body"],
      ["fullbody", "Full Body"],
      ["bro", "Bro Split"],
      ["Bro Split", "Bro Split"],
      ["", "Push/Pull/Legs"],
      [null, "Push/Pull/Legs"],
      ["xyz", "Push/Pull/Legs"],
    ])("%p -> %p", (input, expected) => {
      expect(svc._normalizeSplit(input)).toBe(expected);
    });
  });
});

describe("WorkoutService — candidate fallbacks", () => {
  test("Advanced cascades down through Intermediate then Beginner", () => {
    expect(svc._candidateFitnessLevels("Advanced")).toEqual([
      "Advanced",
      "Intermediate",
      "Beginner",
    ]);
  });

  test("Intermediate cascades to Beginner", () => {
    expect(svc._candidateFitnessLevels("Intermediate")).toEqual([
      "Intermediate",
      "Beginner",
    ]);
  });

  test("Beginner does NOT cascade higher (no advanced workouts for newbies)", () => {
    expect(svc._candidateFitnessLevels("Beginner")).toEqual(["Beginner"]);
  });

  test("Home location accepts Gym fallback", () => {
    expect(svc._candidateLocations("Home")).toEqual(["Home", "Gym"]);
  });

  test("Gym location accepts Home fallback", () => {
    expect(svc._candidateLocations("Gym")).toEqual(["Gym", "Home"]);
  });
});

describe("WorkoutService — training day schedule", () => {
  test("3 days/week trains Mon/Wed/Fri", () => {
    expect(svc._trainingDaysForDaysPerWeek(3)).toEqual([1, 3, 5]);
  });

  test("1 or 2 days/week still gets the 3-day schedule (bumps you up to 3)", () => {
    expect(svc._trainingDaysForDaysPerWeek(1)).toEqual([1, 3, 5]);
    expect(svc._trainingDaysForDaysPerWeek(2)).toEqual([1, 3, 5]);
  });

  test("4 days/week trains Mon/Tue/Thu/Fri", () => {
    expect(svc._trainingDaysForDaysPerWeek(4)).toEqual([1, 2, 4, 5]);
  });

  test("7 days/week trains every day", () => {
    expect(svc._trainingDaysForDaysPerWeek(7)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  test("invalid input falls back to 4-day default", () => {
    expect(svc._trainingDaysForDaysPerWeek(null)).toEqual([1, 2, 4, 5]);
    expect(svc._trainingDaysForDaysPerWeek("nope")).toEqual([1, 2, 4, 5]);
  });
});

describe("WorkoutService — _categoriesForSplit", () => {
  test("PPL has Push/Pull/Legs in order", () => {
    expect(svc._categoriesForSplit("Push/Pull/Legs")).toEqual([
      "Push",
      "Pull",
      "Legs",
    ]);
  });

  test("Upper/Lower has Upper, Lower", () => {
    expect(svc._categoriesForSplit("Upper/Lower")).toEqual(["Upper", "Lower"]);
  });

  test("Full Body has one category", () => {
    expect(svc._categoriesForSplit("Full Body")).toEqual(["Full Body"]);
  });

  test("Bro Split has 5 categories", () => {
    expect(svc._categoriesForSplit("Bro Split")).toEqual([
      "Chest",
      "Back",
      "Legs",
      "Shoulders",
      "Arms",
    ]);
  });
});

describe("WorkoutService — _pickCategoryForToday", () => {
  test("Returns null on rest day for established users", () => {
    // 3 days/week = Mon/Wed/Fri. Sunday (0) is rest.
    expect(
      svc._pickCategoryForToday({
        split: "Push/Pull/Legs",
        daysPerWeek: 3,
        dayIndex: 0,
      }),
    ).toBeNull();
  });

  test("Returns first category on training day", () => {
    expect(
      svc._pickCategoryForToday({
        split: "Push/Pull/Legs",
        daysPerWeek: 3,
        dayIndex: 1, // Mon = first training day
      }),
    ).toBe("Push");
  });

  test("Cycles through categories across the week", () => {
    expect(
      svc._pickCategoryForToday({
        split: "Push/Pull/Legs",
        daysPerWeek: 3,
        dayIndex: 3, // Wed = 2nd training day
      }),
    ).toBe("Pull");
    expect(
      svc._pickCategoryForToday({
        split: "Push/Pull/Legs",
        daysPerWeek: 3,
        dayIndex: 5, // Fri = 3rd training day
      }),
    ).toBe("Legs");
  });

  // ------ The first-day-not-rest-day fix ------

  test("First session lands on rest day → returns first training category instead of null", () => {
    expect(
      svc._pickCategoryForToday({
        split: "Push/Pull/Legs",
        daysPerWeek: 3,
        dayIndex: 0, // Sunday = rest
        isFirstSession: true,
      }),
    ).toBe("Push");
  });

  test("First session on actual training day still returns scheduled category (no shift)", () => {
    expect(
      svc._pickCategoryForToday({
        split: "Push/Pull/Legs",
        daysPerWeek: 3,
        dayIndex: 3, // Wed = scheduled Pull
        isFirstSession: true,
      }),
    ).toBe("Pull");
  });

  test("First session for Upper/Lower split on rest day returns Upper", () => {
    expect(
      svc._pickCategoryForToday({
        split: "Upper/Lower",
        daysPerWeek: 4,
        dayIndex: 0, // Sunday = rest
        isFirstSession: true,
      }),
    ).toBe("Upper");
  });

  test("First session for Full Body on rest day returns Full Body", () => {
    expect(
      svc._pickCategoryForToday({
        split: "Full Body",
        daysPerWeek: 3,
        dayIndex: 6, // Saturday = rest in a 3-day schedule
        isFirstSession: true,
      }),
    ).toBe("Full Body");
  });

  test("First session for Bro Split on rest day returns Chest", () => {
    expect(
      svc._pickCategoryForToday({
        split: "Bro Split",
        daysPerWeek: 5,
        dayIndex: 0, // Sunday = rest
        isFirstSession: true,
      }),
    ).toBe("Chest");
  });

  test("Default isFirstSession=false → still returns null on rest day (existing-user behavior unchanged)", () => {
    expect(
      svc._pickCategoryForToday({
        split: "Push/Pull/Legs",
        daysPerWeek: 3,
        dayIndex: 0,
      }),
    ).toBeNull();
  });
});

describe("WorkoutService — _computeStreakView", () => {
  const fixedToday = "2026-05-03";
  const realDateOnly = svc._dateOnly.bind(svc);
  beforeAll(() => {
    // Pin "today" so streak math is deterministic.
    svc._dateOnly = (date) => {
      if (!date) return fixedToday;
      return realDateOnly(date);
    };
  });
  afterAll(() => {
    svc._dateOnly = realDateOnly;
  });

  test("No user → all zeros, inactive", () => {
    expect(svc._computeStreakView(null)).toEqual({
      current: 0,
      stored: 0,
      longest: 0,
      lastWorkoutDate: null,
      isActive: false,
    });
  });

  test("Workout completed today → streak is active and current = stored", () => {
    const view = svc._computeStreakView({
      currentStreak: 5,
      longestStreak: 12,
      lastWorkoutDate: fixedToday,
    });
    expect(view.isActive).toBe(true);
    expect(view.current).toBe(5);
    expect(view.stored).toBe(5);
    expect(view.longest).toBe(12);
  });

  test("Workout completed yesterday → still active (streak alive)", () => {
    const view = svc._computeStreakView({
      currentStreak: 3,
      longestStreak: 3,
      lastWorkoutDate: "2026-05-02",
    });
    expect(view.isActive).toBe(true);
    expect(view.current).toBe(3);
  });

  test("Workout completed 2 days ago → broken (current=0) but stored preserved", () => {
    const view = svc._computeStreakView({
      currentStreak: 7,
      longestStreak: 7,
      lastWorkoutDate: "2026-05-01",
    });
    expect(view.isActive).toBe(false);
    expect(view.current).toBe(0);
    expect(view.stored).toBe(7);
    expect(view.longest).toBe(7);
  });

  test("No lastWorkoutDate → never started", () => {
    const view = svc._computeStreakView({
      currentStreak: 0,
      longestStreak: 0,
      lastWorkoutDate: null,
    });
    expect(view.isActive).toBe(false);
    expect(view.current).toBe(0);
  });
});
