import 'package:max_muscle_coaching_front/models/dto/workout/exercise_gallery.dart';

class WorkoutExerciseInfo {
  const WorkoutExerciseInfo({
    this.id,
    this.name,
    this.targetMuscle,
    this.imageUrl,
    this.force,
    this.level,
    this.mechanic,
    this.equipment,
    this.category,
    this.createdAt,
    this.updatedAt,
    this.galleries = const <ExerciseGallery>[],
    this.instructions = const <String>[],
  });

  final int? id;
  final String? name;
  final String? targetMuscle;
  final String? imageUrl;
  final String? force;
  final String? level;
  final String? mechanic;
  final String? equipment;
  final String? category;
  final String? createdAt;
  final String? updatedAt;
  final List<ExerciseGallery> galleries;
  final List<String> instructions;

  List<String> get galleryLinks => galleries
      .map((g) => g.link)
      .whereType<String>()
      .map((e) => e.trim())
      .where((e) => e.isNotEmpty)
      .toList(growable: false);

  factory WorkoutExerciseInfo.fromJson(Map<String, dynamic> json) {
    final rawInstructions = json['Instructions'] ?? json['instructions'];
    final instructions = _parseInstructions(rawInstructions);

    final rawGalleries = json['Galleries'] ?? json['galleries'];
    final galleries = (rawGalleries is List)
        ? rawGalleries
            .whereType<Map>()
            .map((e) => ExerciseGallery.fromJson(e.cast<String, dynamic>()))
            .toList(growable: false)
        : const <ExerciseGallery>[];

    String? imageUrl = json['imageUrl'] as String?;
    if (imageUrl == null && galleries.isNotEmpty) {
      for (final g in galleries) {
        final link = g.link?.trim();
        if (link != null && link.isNotEmpty) {
          imageUrl = link;
          break;
        }
      }
    }

    return WorkoutExerciseInfo(
      id: (json['id'] as num?)?.toInt(),
      name: json['name'] as String?,
      targetMuscle: json['targetMuscle'] as String? ?? json['muscle'] as String?,
      imageUrl: imageUrl,
      force: json['force']?.toString(),
      level: json['level']?.toString(),
      mechanic: json['mechanic']?.toString(),
      equipment: json['equipment']?.toString(),
      category: json['category']?.toString(),
      createdAt: json['createdAt']?.toString(),
      updatedAt: json['updatedAt']?.toString(),
      galleries: galleries,
      instructions: instructions,
    );
  }

  static List<String> _parseInstructions(dynamic raw) {
    if (raw is! List) return const <String>[];

    return raw
        .map((e) => _instructionLine(e))
        .map((e) => e.trim())
        .where((e) => e.isNotEmpty)
        .toList(growable: false);
  }

  static String _instructionLine(dynamic entry) {
    if (entry == null) return '';
    if (entry is String) return entry;

    if (entry is Map) {
      final map = <String, dynamic>{};
      for (final e in entry.entries) {
        final key = e.key?.toString();
        if (key == null) continue;
        map[key.toLowerCase()] = e.value;
      }

      for (final key in const <String>[
        'instruction',
        'instructiontext',
        'instruction_text',
        'text',
        'description',
        'content',
        'value',
        'label',
        'name',
      ]) {
        final value = map[key];
        if (value == null) continue;
        return value.toString();
      }

      for (final entry in map.entries) {
        final key = entry.key;
        final value = entry.value;
        if (value is! String) continue;
        if (key == 'id' || key.endsWith('id') || key.contains('created') || key.contains('updated')) continue;
        final trimmed = value.trim();
        if (trimmed.isNotEmpty) return trimmed;
      }
    }

    return entry.toString();
  }

  Map<String, dynamic> toJson() => {
        if (id != null) 'id': id,
        if (name != null) 'name': name,
        if (targetMuscle != null) 'targetMuscle': targetMuscle,
        if (imageUrl != null) 'imageUrl': imageUrl,
        if (force != null) 'force': force,
        if (level != null) 'level': level,
        if (mechanic != null) 'mechanic': mechanic,
        if (equipment != null) 'equipment': equipment,
        if (category != null) 'category': category,
        if (createdAt != null) 'createdAt': createdAt,
        if (updatedAt != null) 'updatedAt': updatedAt,
        if (galleries.isNotEmpty) 'Galleries': galleries.map((g) => g.toJson()).toList(growable: false),
        if (instructions.isNotEmpty) 'Instructions': instructions,
      };
}
