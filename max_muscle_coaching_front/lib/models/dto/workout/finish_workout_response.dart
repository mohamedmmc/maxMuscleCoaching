class FinishWorkoutResponse {
  const FinishWorkoutResponse({
    this.userId,
    this.workoutHistoryId,
    this.completed,
    this.message,
  });

  final int? userId;
  final int? workoutHistoryId;
  final bool? completed;
  final String? message;

  factory FinishWorkoutResponse.fromJson(Map<String, dynamic> json) => FinishWorkoutResponse(
        userId: (json['userId'] as num?)?.toInt(),
        workoutHistoryId: (json['workoutHistoryId'] as num?)?.toInt(),
        completed: json['completed'] as bool?,
        message: json['message']?.toString(),
      );

  Map<String, dynamic> toJson() => {
        if (userId != null) 'userId': userId,
        if (workoutHistoryId != null) 'workoutHistoryId': workoutHistoryId,
        if (completed != null) 'completed': completed,
        if (message != null) 'message': message,
      };
}

