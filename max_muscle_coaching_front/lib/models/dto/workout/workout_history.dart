import 'package:max_muscle_coaching_front/models/dto/workout/workout_history_exercise_progress.dart';
import 'package:max_muscle_coaching_front/models/dto/workout/workout_template.dart';

class WorkoutHistory {
  const WorkoutHistory({
    this.workoutHistoryId,
    this.userId,
    this.dateAssigned,
    this.restDay,
    this.template,
    this.exerciseProgress,
  });

  final int? workoutHistoryId;
  final int? userId;
  final String? dateAssigned;
  final bool? restDay;
  final WorkoutTemplate? template;
  final List<WorkoutHistoryExerciseProgress>? exerciseProgress;

  factory WorkoutHistory.fromJson(Map<String, dynamic> json) {
    final rawProgress = json['exerciseProgress'];
    final progress = (rawProgress is List)
        ? rawProgress
            .whereType<Map>()
            .map((e) => WorkoutHistoryExerciseProgress.fromJson(e.cast<String, dynamic>()))
            .toList(growable: false)
        : null;

    return WorkoutHistory(
      workoutHistoryId: (json['workoutHistoryId'] as num?)?.toInt() ?? (json['id'] as num?)?.toInt(),
      userId: (json['userId'] as num?)?.toInt(),
      dateAssigned: json['dateAssigned']?.toString(),
      restDay: json['restDay'] as bool?,
      template: json['template'] is Map ? WorkoutTemplate.fromJson((json['template'] as Map).cast<String, dynamic>()) : null,
      exerciseProgress: progress,
    );
  }

  Map<String, dynamic> toJson() => {
        if (workoutHistoryId != null) 'workoutHistoryId': workoutHistoryId,
        if (userId != null) 'userId': userId,
        if (dateAssigned != null) 'dateAssigned': dateAssigned,
        if (restDay != null) 'restDay': restDay,
        if (template != null) 'template': template!.toJson(),
        if (exerciseProgress != null)
          'exerciseProgress': exerciseProgress!.map((p) => p.toJson()).toList(growable: false),
      };
}

