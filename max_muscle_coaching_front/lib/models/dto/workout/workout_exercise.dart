import 'package:max_muscle_coaching_front/models/dto/workout/workout_exercise_info.dart';

class WorkoutExercise {
  const WorkoutExercise({
    this.exercise,
    this.exerciseId,
    this.orderIndex,
    this.plannedSets,
    this.plannedReps,
    this.restSeconds,
    this.notes,
  });

  final WorkoutExerciseInfo? exercise;
  final int? exerciseId;
  final int? orderIndex;
  final int? plannedSets;
  final String? plannedReps;
  final int? restSeconds;
  final String? notes;

  factory WorkoutExercise.fromJson(Map<String, dynamic> json) {
    final join = json['WorkoutTemplateExercise'];
    final joinMap = join is Map ? join.cast<String, dynamic>() : null;

    final exercisePayload = (json['exercise'] is Map)
        ? (json['exercise'] as Map).cast<String, dynamic>()
        : (json['Exercise'] is Map)
            ? (json['Exercise'] as Map).cast<String, dynamic>()
            : json;

    return WorkoutExercise(
      exercise: WorkoutExerciseInfo.fromJson(exercisePayload),
      exerciseId: (json['exerciseId'] as num?)?.toInt() ?? (json['id'] as num?)?.toInt(),
      orderIndex: (json['orderIndex'] as num?)?.toInt() ?? (joinMap?['orderIndex'] as num?)?.toInt(),
      plannedSets: (json['plannedSets'] as num?)?.toInt() ??
          (joinMap?['sets'] as num?)?.toInt() ??
          (json['sets'] as num?)?.toInt(),
      plannedReps: json['plannedReps']?.toString() ?? joinMap?['reps']?.toString() ?? json['reps']?.toString(),
      restSeconds: (json['restSeconds'] as num?)?.toInt() ??
          (joinMap?['restSeconds'] as num?)?.toInt() ??
          (json['plannedRestSeconds'] as num?)?.toInt(),
      notes: (json['notes'] as String?) ?? (joinMap?['notes'] as String?) ?? (json['plannedNotes'] as String?),
    );
  }

  Map<String, dynamic> toJson() => {
        if (exerciseId != null) 'exerciseId': exerciseId,
        if (orderIndex != null) 'orderIndex': orderIndex,
        if (plannedSets != null) 'plannedSets': plannedSets,
        if (plannedReps != null) 'plannedReps': plannedReps,
        if (restSeconds != null) 'restSeconds': restSeconds,
        if (notes != null) 'notes': notes,
        if (exercise != null) 'exercise': exercise!.toJson(),
      };
}

