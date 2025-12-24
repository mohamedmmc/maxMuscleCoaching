import 'dart:convert';

class WorkoutTemplateInfo {
  const WorkoutTemplateInfo({
    this.id,
    this.name,
    this.dayOfWeek,
    this.focus,
    this.category,
    this.split,
    this.fitnessLevel,
    this.location,
    this.isRestDay,
    this.estimatedDurationMinutes,
    this.description,
    this.createdAt,
    this.updatedAt,
  });

  final int? id;
  final String? name;
  final String? dayOfWeek;
  final String? focus;
  final String? category;
  final String? split;
  final String? fitnessLevel;
  final String? location;
  final bool? isRestDay;
  final int? estimatedDurationMinutes;
  final String? description;
  final String? createdAt;
  final String? updatedAt;

  Map<String, Object?> toJson() {
    return {
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (dayOfWeek != null) 'dayOfWeek': dayOfWeek,
      if (focus != null) 'focus': focus,
      if (category != null) 'category': category,
      if (split != null) 'split': split,
      if (fitnessLevel != null) 'fitnessLevel': fitnessLevel,
      if (location != null) 'location': location,
      if (isRestDay != null) 'isRestDay': isRestDay,
      if (estimatedDurationMinutes != null) 'estimatedDurationMinutes': estimatedDurationMinutes,
      if (description != null) 'description': description,
      if (createdAt != null) 'createdAt': createdAt,
      if (updatedAt != null) 'updatedAt': updatedAt,
    };
  }

  factory WorkoutTemplateInfo.fromJson(Map<String, Object?> json) {
    return WorkoutTemplateInfo(
      id: (json['id'] as num?)?.toInt(),
      name: json['name'] as String?,
      dayOfWeek: json['dayOfWeek'] as String?,
      focus: json['focus'] as String?,
      category: json['category'] as String?,
      split: json['split'] as String?,
      fitnessLevel: json['fitnessLevel'] as String?,
      location: json['location'] as String?,
      isRestDay: json['isRestDay'] as bool?,
      estimatedDurationMinutes: (json['estimatedDurationMinutes'] as num?)?.toInt(),
      description: json['description'] as String?,
      createdAt: json['createdAt'] as String?,
      updatedAt: json['updatedAt'] as String?,
    );
  }
}

class DailyWorkout {
  const DailyWorkout({
    required this.dayOfWeek,
    required this.focus,
    required this.category,
    required this.isRestDay,
    required this.exercises,
    this.dateAssigned,
    this.workoutHistoryId,
    this.template,
  });

  final String dayOfWeek;
  final String focus;
  final String category;
  final bool isRestDay;
  final List<Exercise> exercises;
  final String? dateAssigned;
  final int? workoutHistoryId;
  final WorkoutTemplateInfo? template;

  Map<String, Object?> toJson() {
    return {
      'dayOfWeek': dayOfWeek,
      'focus': focus,
      'category': category,
      'isRestDay': isRestDay,
      'exercises': exercises.map((e) => e.toJson()).toList(growable: false),
      if (dateAssigned != null) 'dateAssigned': dateAssigned,
      if (workoutHistoryId != null) 'workoutHistoryId': workoutHistoryId,
      if (template != null) 'template': template!.toJson(),
    };
  }

  factory DailyWorkout.fromJson(Map<String, Object?> json) {
    final rawExercises = json['exercises'];
    final exercises = (rawExercises is List) ? rawExercises.whereType<Map>().map((e) => Exercise.fromJson(e.cast<String, Object?>())).toList(growable: false) : const <Exercise>[];
    final templateJson = json['template'];

    return DailyWorkout(
      dayOfWeek: (json['dayOfWeek'] as String?) ?? '',
      focus: (json['focus'] as String?) ?? '',
      category: (json['category'] as String?) ?? '',
      isRestDay: (json['isRestDay'] as bool?) ?? false,
      exercises: exercises,
      dateAssigned: json['dateAssigned'] as String?,
      workoutHistoryId: (json['workoutHistoryId'] as num?)?.toInt(),
      template: templateJson is Map ? WorkoutTemplateInfo.fromJson(templateJson.cast<String, Object?>()) : null,
    );
  }
}

class Exercise {
  const Exercise({
    required this.id,
    required this.name,
    required this.targetMuscle,
    required this.sets,
    required this.reps,
    required this.imageUrls,
    required this.instructions,
    this.force,
    this.level,
    this.mechanic,
    this.equipment,
    this.exerciseCategory,
    this.restSeconds,
    this.notes,
    this.orderIndex,
    this.createdAt,
    this.updatedAt,
  });

  final String id;
  final String name;
  final String targetMuscle;
  final int sets;
  final String reps;
  final List<String> imageUrls;
  final List<String> instructions;
  final String? force;
  final String? level;
  final String? mechanic;
  final String? equipment;
  final String? exerciseCategory;
  final int? restSeconds;
  final String? notes;
  final int? orderIndex;
  final String? createdAt;
  final String? updatedAt;

  String get imageUrl => imageUrls.isNotEmpty ? imageUrls.first : '';

  Map<String, Object?> toJson() {
    return {
      'id': id,
      'name': name,
      'targetMuscle': targetMuscle,
      'sets': sets,
      'reps': reps,
      'imageUrl': imageUrl,
      'imageUrls': imageUrls,
      'instructions': instructions,
      if (force != null) 'force': force,
      if (level != null) 'level': level,
      if (mechanic != null) 'mechanic': mechanic,
      if (equipment != null) 'equipment': equipment,
      if (exerciseCategory != null) 'exerciseCategory': exerciseCategory,
      if (restSeconds != null) 'restSeconds': restSeconds,
      if (notes != null) 'notes': notes,
      if (orderIndex != null) 'orderIndex': orderIndex,
      if (createdAt != null) 'createdAt': createdAt,
      if (updatedAt != null) 'updatedAt': updatedAt,
    };
  }

  factory Exercise.fromJson(Map<String, Object?> json) {
    final rawInstructions = json['instructions'];
    final instructions = (rawInstructions is List) ? rawInstructions.whereType<String>().toList(growable: false) : const <String>[];
    final rawImageUrls = json['imageUrls'];
    final imageUrls = (rawImageUrls is List)
        ? rawImageUrls.map((e) => e?.toString() ?? '').map((e) => e.trim()).where((e) => e.isNotEmpty).toList(growable: false)
        : <String>[
            if ((json['imageUrl'] as String?) != null) (json['imageUrl'] as String?)!.trim(),
          ].where((e) => e.isNotEmpty).toList(growable: false);

    return Exercise(
      id: (json['id'] as String?) ?? '',
      name: (json['name'] as String?) ?? '',
      targetMuscle: (json['targetMuscle'] as String?) ?? '',
      sets: (json['sets'] as num?)?.toInt() ?? 0,
      reps: (json['reps'] as String?) ?? '',
      imageUrls: imageUrls,
      instructions: instructions,
      force: json['force'] as String?,
      level: json['level'] as String?,
      mechanic: json['mechanic'] as String?,
      equipment: json['equipment'] as String?,
      exerciseCategory: json['exerciseCategory'] as String?,
      restSeconds: (json['restSeconds'] as num?)?.toInt(),
      notes: json['notes'] as String?,
      orderIndex: (json['orderIndex'] as num?)?.toInt(),
      createdAt: json['createdAt'] as String?,
      updatedAt: json['updatedAt'] as String?,
    );
  }
}

class WorkoutSetLog {
  const WorkoutSetLog({
    required this.setNumber,
    required this.reps,
    required this.weight,
    required this.completed,
  });

  final int setNumber;
  final double reps;
  final double weight;
  final bool completed;

  Map<String, Object?> toJson() {
    return {
      'setNumber': setNumber,
      'reps': reps,
      'weight': weight,
      'completed': completed,
    };
  }

  factory WorkoutSetLog.fromJson(Map<String, Object?> json) {
    return WorkoutSetLog(
      setNumber: (json['setNumber'] as num?)?.toInt() ?? 0,
      reps: (json['reps'] as num?)?.toDouble() ?? 0,
      weight: (json['weight'] as num?)?.toDouble() ?? 0,
      completed: (json['completed'] as bool?) ?? false,
    );
  }
}

class ExerciseLog {
  const ExerciseLog({
    required this.exerciseId,
    required this.exerciseName,
    required this.sets,
  });

  final String exerciseId;
  final String exerciseName;
  final List<WorkoutSetLog> sets;

  ExerciseLog copyWith({
    String? exerciseId,
    String? exerciseName,
    List<WorkoutSetLog>? sets,
  }) {
    return ExerciseLog(
      exerciseId: exerciseId ?? this.exerciseId,
      exerciseName: exerciseName ?? this.exerciseName,
      sets: sets ?? this.sets,
    );
  }

  Map<String, Object?> toJson() {
    return {
      'exerciseId': exerciseId,
      'exerciseName': exerciseName,
      'sets': sets.map((s) => s.toJson()).toList(growable: false),
    };
  }

  factory ExerciseLog.fromJson(Map<String, Object?> json) {
    final rawSets = json['sets'];
    final sets = (rawSets is List) ? rawSets.whereType<Map>().map((e) => WorkoutSetLog.fromJson(e.cast<String, Object?>())).toList(growable: false) : const <WorkoutSetLog>[];

    return ExerciseLog(
      exerciseId: (json['exerciseId'] as String?) ?? '',
      exerciseName: (json['exerciseName'] as String?) ?? '',
      sets: sets,
    );
  }
}

class WorkoutSessionLog {
  const WorkoutSessionLog({
    required this.id,
    required this.dateIso,
    required this.durationMinutes,
    required this.totalVolume,
    required this.category,
    required this.exercises,
  });

  final String id;
  final String dateIso;
  final int durationMinutes;
  final double totalVolume;
  final String category;
  final List<ExerciseLog> exercises;

  Map<String, Object?> toJson() {
    return {
      'id': id,
      'dateIso': dateIso,
      'durationMinutes': durationMinutes,
      'totalVolume': totalVolume,
      'category': category,
      'exercises': exercises.map((e) => e.toJson()).toList(growable: false),
    };
  }

  factory WorkoutSessionLog.fromJson(Map<String, Object?> json) {
    final rawExercises = json['exercises'];
    final exercises =
        (rawExercises is List) ? rawExercises.whereType<Map>().map((e) => ExerciseLog.fromJson(e.cast<String, Object?>())).toList(growable: false) : const <ExerciseLog>[];

    return WorkoutSessionLog(
      id: (json['id'] as String?) ?? '',
      dateIso: (json['dateIso'] as String?) ?? '',
      durationMinutes: (json['durationMinutes'] as num?)?.toInt() ?? 0,
      totalVolume: (json['totalVolume'] as num?)?.toDouble() ?? 0,
      category: (json['category'] as String?) ?? '',
      exercises: exercises,
    );
  }
}

class ActiveWorkoutSession {
  const ActiveWorkoutSession({
    required this.workout,
    required this.startTimeMs,
    required this.exerciseLogs,
  });

  final DailyWorkout workout;
  final int startTimeMs;
  final List<ExerciseLog> exerciseLogs;

  Map<String, Object?> toJson() {
    return {
      'workout': workout.toJson(),
      'startTimeMs': startTimeMs,
      'exerciseLogs': exerciseLogs.map((e) => e.toJson()).toList(growable: false),
    };
  }

  factory ActiveWorkoutSession.fromJson(Map<String, Object?> json) {
    final workoutJson = json['workout'];
    final rawExerciseLogs = json['exerciseLogs'];

    return ActiveWorkoutSession(
      workout: workoutJson is Map
          ? DailyWorkout.fromJson(workoutJson.cast<String, Object?>())
          : const DailyWorkout(
              dayOfWeek: '',
              focus: '',
              category: '',
              isRestDay: false,
              exercises: <Exercise>[],
            ),
      startTimeMs: (json['startTimeMs'] as num?)?.toInt() ?? 0,
      exerciseLogs:
          (rawExerciseLogs is List) ? rawExerciseLogs.whereType<Map>().map((e) => ExerciseLog.fromJson(e.cast<String, Object?>())).toList(growable: false) : const <ExerciseLog>[],
    );
  }

  static ActiveWorkoutSession? tryParse(String raw) {
    try {
      final decoded = jsonDecode(raw);
      if (decoded is! Map) return null;
      return ActiveWorkoutSession.fromJson(decoded.cast<String, Object?>());
    } catch (_) {
      return null;
    }
  }
}
