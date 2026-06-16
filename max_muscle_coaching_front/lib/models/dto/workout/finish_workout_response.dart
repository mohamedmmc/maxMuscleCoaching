class FinishWorkoutResponse {
  const FinishWorkoutResponse({
    this.userId,
    this.workoutHistoryId,
    this.completed,
    this.message,
    this.streak,
  });

  final int? userId;
  final int? workoutHistoryId;
  final bool? completed;
  final String? message;
  final FinishWorkoutStreak? streak;

  factory FinishWorkoutResponse.fromJson(Map<String, dynamic> json) => FinishWorkoutResponse(
        userId: (json['userId'] as num?)?.toInt(),
        workoutHistoryId: (json['workoutHistoryId'] as num?)?.toInt(),
        completed: json['completed'] as bool?,
        message: json['message']?.toString(),
        streak: json['streak'] is Map
            ? FinishWorkoutStreak.fromJson(
                (json['streak'] as Map).cast<String, dynamic>())
            : null,
      );

  Map<String, dynamic> toJson() => {
        if (userId != null) 'userId': userId,
        if (workoutHistoryId != null) 'workoutHistoryId': workoutHistoryId,
        if (completed != null) 'completed': completed,
        if (message != null) 'message': message,
        if (streak != null) 'streak': streak!.toJson(),
      };
}

class FinishWorkoutStreak {
  const FinishWorkoutStreak({
    required this.current,
    required this.longest,
    required this.isActive,
    this.lastWorkoutDate,
  });

  final int current;
  final int longest;
  final bool isActive;
  final String? lastWorkoutDate;

  factory FinishWorkoutStreak.fromJson(Map<String, dynamic> json) =>
      FinishWorkoutStreak(
        current: (json['current'] as num?)?.toInt() ?? 0,
        longest: (json['longest'] as num?)?.toInt() ?? 0,
        isActive: json['isActive'] == true,
        lastWorkoutDate: json['lastWorkoutDate']?.toString(),
      );

  Map<String, dynamic> toJson() => {
        'current': current,
        'longest': longest,
        'isActive': isActive,
        if (lastWorkoutDate != null) 'lastWorkoutDate': lastWorkoutDate,
      };
}

