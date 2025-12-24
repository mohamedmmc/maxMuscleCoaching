import 'package:max_muscle_coaching_front/models/dto/workout/workout_exercise.dart';

class WorkoutTemplate {
  const WorkoutTemplate({
    this.id,
    this.name,
    this.dayOfWeek,
    this.focus,
    this.category,
    this.split,
    this.fitnessLevel,
    this.location,
    this.isRestDay,
    this.estimatedDurationMinutes,
    this.description,
    this.createdAt,
    this.updatedAt,
    this.exercises = const <WorkoutExercise>[],
  });

  final int? id;
  final String? name;
  final String? dayOfWeek;
  final String? focus;
  final String? category;
  final String? split;
  final String? fitnessLevel;
  final String? location;
  final bool? isRestDay;
  final int? estimatedDurationMinutes;
  final String? description;
  final String? createdAt;
  final String? updatedAt;
  final List<WorkoutExercise> exercises;

  factory WorkoutTemplate.fromJson(Map<String, dynamic> json) {
    final rawExercises = json['exercises'] ?? json['templateExercises'] ?? json['Exercises'];
    final exercises =
        (rawExercises is List) ? rawExercises.whereType<Map>().map((e) => WorkoutExercise.fromJson(e.cast<String, dynamic>())).toList(growable: false) : const <WorkoutExercise>[];

    return WorkoutTemplate(
      id: (json['id'] as num?)?.toInt() ?? (json['templateId'] as num?)?.toInt(),
      name: json['name'] as String?,
      dayOfWeek: json['dayOfWeek'] as String?,
      focus: json['focus'] as String?,
      category: json['category'] as String?,
      split: json['split'] as String?,
      fitnessLevel: json['fitnessLevel'] as String?,
      location: json['location'] as String?,
      isRestDay: json['isRestDay'] as bool?,
      estimatedDurationMinutes: (json['estimatedDurationMinutes'] as num?)?.toInt(),
      description: json['description'] as String?,
      createdAt: json['createdAt']?.toString(),
      updatedAt: json['updatedAt']?.toString(),
      exercises: exercises,
    );
  }

  Map<String, dynamic> toJson() => {
        if (id != null) 'id': id,
        if (name != null) 'name': name,
        if (dayOfWeek != null) 'dayOfWeek': dayOfWeek,
        if (focus != null) 'focus': focus,
        if (category != null) 'category': category,
        if (split != null) 'split': split,
        if (fitnessLevel != null) 'fitnessLevel': fitnessLevel,
        if (location != null) 'location': location,
        if (isRestDay != null) 'isRestDay': isRestDay,
        if (estimatedDurationMinutes != null) 'estimatedDurationMinutes': estimatedDurationMinutes,
        if (description != null) 'description': description,
        if (createdAt != null) 'createdAt': createdAt,
        if (updatedAt != null) 'updatedAt': updatedAt,
        'exercises': exercises.map((e) => e.toJson()).toList(growable: false),
      };
}
