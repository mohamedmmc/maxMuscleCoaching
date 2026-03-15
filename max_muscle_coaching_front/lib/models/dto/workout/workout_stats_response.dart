class WorkoutStatsResponse {
  const WorkoutStatsResponse({
    this.userId,
    this.range,
    this.summary,
    this.gamification,
    this.allTime,
    this.topMuscles = const <WorkoutStatsMuscle>[],
    this.byDay = const <WorkoutStatsByDay>[],
  });

  final int? userId;
  final WorkoutStatsRange? range;
  final WorkoutStatsSummary? summary;
  final WorkoutStatsGamification? gamification;
  final WorkoutStatsAllTime? allTime;
  final List<WorkoutStatsMuscle> topMuscles;
  final List<WorkoutStatsByDay> byDay;

  factory WorkoutStatsResponse.fromJson(Map<String, dynamic> json) {
    final rawTopMuscles = json['topMuscles'];
    final topMuscles = (rawTopMuscles is List)
        ? rawTopMuscles
            .whereType<Map>()
            .map((e) => WorkoutStatsMuscle.fromJson(e.cast<String, dynamic>()))
            .toList(growable: false)
        : const <WorkoutStatsMuscle>[];

    final rawByDay = json['byDay'];
    final byDay = (rawByDay is List)
        ? rawByDay
            .whereType<Map>()
            .map((e) => WorkoutStatsByDay.fromJson(e.cast<String, dynamic>()))
            .toList(growable: false)
        : const <WorkoutStatsByDay>[];

    return WorkoutStatsResponse(
      userId: (json['userId'] as num?)?.toInt(),
      range: json['range'] is Map
          ? WorkoutStatsRange.fromJson(
              (json['range'] as Map).cast<String, dynamic>())
          : null,
      summary: json['summary'] is Map
          ? WorkoutStatsSummary.fromJson(
              (json['summary'] as Map).cast<String, dynamic>())
          : null,
      gamification: json['gamification'] is Map
          ? WorkoutStatsGamification.fromJson(
              (json['gamification'] as Map).cast<String, dynamic>())
          : null,
      allTime: json['allTime'] is Map
          ? WorkoutStatsAllTime.fromJson(
              (json['allTime'] as Map).cast<String, dynamic>())
          : null,
      topMuscles: topMuscles,
      byDay: byDay,
    );
  }

  Map<String, dynamic> toJson() => {
        if (userId != null) 'userId': userId,
        if (range != null) 'range': range!.toJson(),
        if (summary != null) 'summary': summary!.toJson(),
        if (gamification != null) 'gamification': gamification!.toJson(),
        if (allTime != null) 'allTime': allTime!.toJson(),
        'topMuscles': topMuscles.map((m) => m.toJson()).toList(growable: false),
        'byDay': byDay.map((d) => d.toJson()).toList(growable: false),
      };
}

class WorkoutStatsRange {
  const WorkoutStatsRange({
    required this.startDate,
    required this.endDate,
    required this.days,
  });

  final String startDate;
  final String endDate;
  final int days;

  factory WorkoutStatsRange.fromJson(Map<String, dynamic> json) {
    return WorkoutStatsRange(
      startDate: json['startDate']?.toString() ?? '',
      endDate: json['endDate']?.toString() ?? '',
      days: (json['days'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        'startDate': startDate,
        'endDate': endDate,
        'days': days,
      };
}

class WorkoutStatsSummary {
  const WorkoutStatsSummary({
    required this.sessionsFinished,
    this.avgEstimatedDurationMinutes,
    this.avgElapsedMinutesApprox,
  });

  final int sessionsFinished;
  final int? avgEstimatedDurationMinutes;
  final int? avgElapsedMinutesApprox;

  factory WorkoutStatsSummary.fromJson(Map<String, dynamic> json) {
    return WorkoutStatsSummary(
      sessionsFinished: (json['sessionsFinished'] as num?)?.toInt() ?? 0,
      avgEstimatedDurationMinutes:
          (json['avgEstimatedDurationMinutes'] as num?)?.toInt(),
      avgElapsedMinutesApprox:
          (json['avgElapsedMinutesApprox'] as num?)?.toInt(),
    );
  }

  Map<String, dynamic> toJson() => {
        'sessionsFinished': sessionsFinished,
        if (avgEstimatedDurationMinutes != null)
          'avgEstimatedDurationMinutes': avgEstimatedDurationMinutes,
        if (avgElapsedMinutesApprox != null)
          'avgElapsedMinutesApprox': avgElapsedMinutesApprox,
      };
}

class WorkoutStatsGamification {
  const WorkoutStatsGamification({required this.points, required this.level});

  final int points;
  final int level;

  factory WorkoutStatsGamification.fromJson(Map<String, dynamic> json) {
    return WorkoutStatsGamification(
      points: (json['points'] as num?)?.toInt() ?? 0,
      level: (json['level'] as num?)?.toInt() ?? 1,
    );
  }

  Map<String, dynamic> toJson() => {
        'points': points,
        'level': level,
      };
}

class WorkoutStatsAllTime {
  const WorkoutStatsAllTime({
    required this.sessionsFinished,
    required this.points,
    required this.level,
  });

  final int sessionsFinished;
  final int points;
  final int level;

  factory WorkoutStatsAllTime.fromJson(Map<String, dynamic> json) {
    return WorkoutStatsAllTime(
      sessionsFinished: (json['sessionsFinished'] as num?)?.toInt() ?? 0,
      points: (json['points'] as num?)?.toInt() ?? 0,
      level: (json['level'] as num?)?.toInt() ?? 1,
    );
  }

  Map<String, dynamic> toJson() => {
        'sessionsFinished': sessionsFinished,
        'points': points,
        'level': level,
      };
}

class WorkoutStatsMuscle {
  const WorkoutStatsMuscle({
    required this.id,
    required this.name,
    required this.score,
    this.daysWorked,
  });

  final int id;
  final String name;
  final double score;
  final int? daysWorked;

  factory WorkoutStatsMuscle.fromJson(Map<String, dynamic> json) {
    return WorkoutStatsMuscle(
      id: (json['id'] as num?)?.toInt() ?? 0,
      name: json['name']?.toString() ?? '',
      score: (json['score'] as num?)?.toDouble() ?? 0,
      daysWorked: (json['daysWorked'] as num?)?.toInt(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'score': score,
        if (daysWorked != null) 'daysWorked': daysWorked,
      };
}

class WorkoutStatsByDay {
  const WorkoutStatsByDay({
    required this.date,
    this.metrics,
    this.performance,
    this.muscles = const <WorkoutStatsMuscle>[],
  });

  final String date;
  final WorkoutStatsByDayMetrics? metrics;
  final WorkoutStatsByDayPerformance? performance;
  final List<WorkoutStatsMuscle> muscles;

  factory WorkoutStatsByDay.fromJson(Map<String, dynamic> json) {
    final rawMuscles = json['muscles'];
    final muscles = (rawMuscles is List)
        ? rawMuscles
            .whereType<Map>()
            .map((e) => WorkoutStatsMuscle.fromJson(e.cast<String, dynamic>()))
            .toList(growable: false)
        : const <WorkoutStatsMuscle>[];

    return WorkoutStatsByDay(
      date: json['date']?.toString() ?? '',
      metrics: json['metrics'] is Map
          ? WorkoutStatsByDayMetrics.fromJson(
              (json['metrics'] as Map).cast<String, dynamic>())
          : null,
      performance: json['performance'] is Map
          ? WorkoutStatsByDayPerformance.fromJson(
              (json['performance'] as Map).cast<String, dynamic>())
          : null,
      muscles: muscles,
    );
  }

  Map<String, dynamic> toJson() => {
        'date': date,
        if (metrics != null) 'metrics': metrics!.toJson(),
        if (performance != null) 'performance': performance!.toJson(),
        'muscles': muscles.map((m) => m.toJson()).toList(growable: false),
      };
}

class WorkoutStatsByDayMetrics {
  const WorkoutStatsByDayMetrics({this.completionRate});

  final double? completionRate;

  factory WorkoutStatsByDayMetrics.fromJson(Map<String, dynamic> json) {
    return WorkoutStatsByDayMetrics(
      completionRate: (json['completionRate'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
        if (completionRate != null) 'completionRate': completionRate,
      };
}

class WorkoutStatsByDayPerformance {
  const WorkoutStatsByDayPerformance({this.label});

  final String? label;

  factory WorkoutStatsByDayPerformance.fromJson(Map<String, dynamic> json) {
    return WorkoutStatsByDayPerformance(label: json['label']?.toString());
  }

  Map<String, dynamic> toJson() => {
        if (label != null) 'label': label,
      };
}
