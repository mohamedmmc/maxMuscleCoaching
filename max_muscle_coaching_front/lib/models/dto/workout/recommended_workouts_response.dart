import 'package:max_muscle_coaching_front/models/dto/workout/workout_template.dart';

class RecommendedWorkoutsResponse {
  const RecommendedWorkoutsResponse({
    this.userId,
    this.templates = const <WorkoutTemplate>[],
  });

  final int? userId;
  final List<WorkoutTemplate> templates;

  factory RecommendedWorkoutsResponse.fromJson(Map<String, dynamic> json) {
    final rawTemplates = json['templates'];
    final templates = (rawTemplates is List)
        ? rawTemplates.whereType<Map>().map((e) => WorkoutTemplate.fromJson(e.cast<String, dynamic>())).toList(growable: false)
        : const <WorkoutTemplate>[];

    return RecommendedWorkoutsResponse(
      userId: (json['userId'] as num?)?.toInt(),
      templates: templates,
    );
  }

  Map<String, dynamic> toJson() => {
        if (userId != null) 'userId': userId,
        'templates': templates.map((t) => t.toJson()).toList(growable: false),
      };
}

