import 'package:max_muscle_coaching_front/models/dto/workout/workout_history_exercise_progress.dart';
import 'package:max_muscle_coaching_front/models/dto/workout/workout_template.dart';

class TodayWorkoutResponse {
  const TodayWorkoutResponse({
    this.userId,
    this.dateAssigned,
    this.message,
    required this.restDay,
    this.workoutHistoryId,
    this.template,
    this.exerciseProgress = const <WorkoutHistoryExerciseProgress>[],
  });

  final int? userId;
  final String? dateAssigned;
  final String? message;
  final bool restDay;
  final int? workoutHistoryId;
  final WorkoutTemplate? template;
  final List<WorkoutHistoryExerciseProgress> exerciseProgress;

  factory TodayWorkoutResponse.fromJson(Map<String, dynamic> json) {
    final rawProgress = json['exerciseProgress'];
    final progress = (rawProgress is List)
        ? rawProgress
            .whereType<Map>()
            .map((e) => WorkoutHistoryExerciseProgress.fromJson(e.cast<String, dynamic>()))
            .toList(growable: false)
        : const <WorkoutHistoryExerciseProgress>[];

    return TodayWorkoutResponse(
      userId: (json['userId'] as num?)?.toInt(),
      dateAssigned: json['dateAssigned']?.toString(),
      message: json['message']?.toString(),
      restDay: (json['restDay'] as bool?) ?? false,
      workoutHistoryId: (json['workoutHistoryId'] as num?)?.toInt(),
      template: json['template'] is Map ? WorkoutTemplate.fromJson((json['template'] as Map).cast<String, dynamic>()) : null,
      exerciseProgress: progress,
    );
  }

  Map<String, dynamic> toJson() => {
        if (userId != null) 'userId': userId,
        if (dateAssigned != null) 'dateAssigned': dateAssigned,
        if (message != null) 'message': message,
        'restDay': restDay,
        if (workoutHistoryId != null) 'workoutHistoryId': workoutHistoryId,
        if (template != null) 'template': template!.toJson(),
        'exerciseProgress': exerciseProgress.map((p) => p.toJson()).toList(growable: false),
      };
}
