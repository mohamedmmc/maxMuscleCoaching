import 'package:max_muscle_coaching_front/models/dto/workout/workout_history_exercise_progress.dart';

class UpdateExerciseProgressResponse {
  const UpdateExerciseProgressResponse({
    this.userId,
    this.progress,
  });

  final int? userId;
  final WorkoutHistoryExerciseProgress? progress;

  factory UpdateExerciseProgressResponse.fromJson(Map<String, dynamic> json) => UpdateExerciseProgressResponse(
        userId: (json['userId'] as num?)?.toInt(),
        progress: json['progress'] is Map
            ? WorkoutHistoryExerciseProgress.fromJson((json['progress'] as Map).cast<String, dynamic>())
            : null,
      );

  Map<String, dynamic> toJson() => {
        if (userId != null) 'userId': userId,
        if (progress != null) 'progress': progress!.toJson(),
      };
}

