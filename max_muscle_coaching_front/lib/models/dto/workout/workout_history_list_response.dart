import 'package:max_muscle_coaching_front/models/dto/workout/workout_history.dart';

class WorkoutHistoryListResponse {
  const WorkoutHistoryListResponse({
    this.userId,
    this.histories = const <WorkoutHistory>[],
  });

  final int? userId;
  final List<WorkoutHistory> histories;

  factory WorkoutHistoryListResponse.fromJson(Map<String, dynamic> json) {
    final rawHistories = json['histories'];
    final histories = (rawHistories is List)
        ? rawHistories.whereType<Map>().map((e) => WorkoutHistory.fromJson(e.cast<String, dynamic>())).toList(growable: false)
        : const <WorkoutHistory>[];

    return WorkoutHistoryListResponse(
      userId: (json['userId'] as num?)?.toInt(),
      histories: histories,
    );
  }

  Map<String, dynamic> toJson() => {
        if (userId != null) 'userId': userId,
        'histories': histories.map((h) => h.toJson()).toList(growable: false),
      };
}

