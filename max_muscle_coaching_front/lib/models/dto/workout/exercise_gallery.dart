class ExerciseGallery {
  const ExerciseGallery({
    this.id,
    this.exerciseId,
    this.link,
    this.type,
    this.createdAt,
    this.updatedAt,
  });

  final int? id;
  final int? exerciseId;
  final String? link;
  final String? type;
  final String? createdAt;
  final String? updatedAt;

  factory ExerciseGallery.fromJson(Map<String, dynamic> json) => ExerciseGallery(
        id: (json['id'] as num?)?.toInt(),
        exerciseId: (json['exerciseId'] as num?)?.toInt(),
        link: json['link']?.toString(),
        type: json['type']?.toString(),
        createdAt: json['createdAt']?.toString(),
        updatedAt: json['updatedAt']?.toString(),
      );

  Map<String, dynamic> toJson() => {
        if (id != null) 'id': id,
        if (exerciseId != null) 'exerciseId': exerciseId,
        if (link != null) 'link': link,
        if (type != null) 'type': type,
        if (createdAt != null) 'createdAt': createdAt,
        if (updatedAt != null) 'updatedAt': updatedAt,
      };
}

