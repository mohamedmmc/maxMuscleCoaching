import 'dart:convert';

import 'package:max_muscle_coaching_front/models/dto/workout/performed_set.dart';
import 'package:max_muscle_coaching_front/models/dto/workout/workout_exercise_info.dart';

class WorkoutHistoryExerciseProgress {
  const WorkoutHistoryExerciseProgress({
    this.exercise,
    this.exerciseId,
    this.orderIndex,
    this.plannedSets,
    this.plannedReps,
    this.plannedRestSeconds,
    this.plannedNotes,
    required this.performedSets,
    required this.completed,
  });

  final WorkoutExerciseInfo? exercise;
  final int? exerciseId;
  final int? orderIndex;
  final int? plannedSets;
  final String? plannedReps;
  final int? plannedRestSeconds;
  final String? plannedNotes;
  final List<PerformedSet> performedSets;
  final bool completed;

  factory WorkoutHistoryExerciseProgress.fromJson(Map<String, dynamic> json) {
    final performedSets = _parsePerformedSets(json['performedSets']);

    return WorkoutHistoryExerciseProgress(
      exercise: (json['exercise'] is Map)
          ? WorkoutExerciseInfo.fromJson((json['exercise'] as Map).cast<String, dynamic>())
          : (json['Exercise'] is Map)
              ? WorkoutExerciseInfo.fromJson((json['Exercise'] as Map).cast<String, dynamic>())
              : null,
      exerciseId: (json['exerciseId'] as num?)?.toInt() ?? (json['id'] as num?)?.toInt(),
      orderIndex: (json['orderIndex'] as num?)?.toInt(),
      plannedSets: (json['plannedSets'] as num?)?.toInt(),
      plannedReps: json['plannedReps']?.toString(),
      plannedRestSeconds: (json['plannedRestSeconds'] as num?)?.toInt(),
      plannedNotes: json['plannedNotes'] as String?,
      performedSets: performedSets,
      completed: (json['completed'] as bool?) ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        if (exerciseId != null) 'exerciseId': exerciseId,
        if (orderIndex != null) 'orderIndex': orderIndex,
        if (plannedSets != null) 'plannedSets': plannedSets,
        if (plannedReps != null) 'plannedReps': plannedReps,
        if (plannedRestSeconds != null) 'plannedRestSeconds': plannedRestSeconds,
        if (plannedNotes != null) 'plannedNotes': plannedNotes,
        'performedSets': performedSets.map((s) => s.toJson()).toList(growable: false),
        'completed': completed,
        if (exercise != null) 'exercise': exercise!.toJson(),
      };
}

List<PerformedSet> _parsePerformedSets(dynamic raw) {
  dynamic decoded = raw;
  if (raw is String) {
    final trimmed = raw.trim();
    if (trimmed.isEmpty) return const <PerformedSet>[];
    try {
      decoded = jsonDecode(trimmed);
    } catch (_) {
      return const <PerformedSet>[];
    }
  }

  if (decoded is List) {
    return decoded.whereType<Map>().map((e) => PerformedSet.fromJson(e.cast<String, dynamic>())).toList(growable: false);
  }
  return const <PerformedSet>[];
}

