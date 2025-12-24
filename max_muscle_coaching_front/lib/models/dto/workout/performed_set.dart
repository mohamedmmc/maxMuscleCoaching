class PerformedSet {
  const PerformedSet({
    required this.reps,
    this.setNumber,
    this.weight,
    this.notes,
  });

  final int? setNumber;
  final int reps;
  final double? weight;
  final String? notes;

  factory PerformedSet.fromJson(Map<String, dynamic> json) => PerformedSet(
        setNumber: (json['setNumber'] as num?)?.toInt(),
        reps: (json['reps'] as num?)?.toInt() ?? 0,
        weight: (json['weight'] as num?)?.toDouble(),
        notes: json['notes'] as String?,
      );

  Map<String, dynamic> toJson() => {
        if (setNumber != null) 'setNumber': setNumber,
        'reps': reps,
        if (weight != null) 'weight': weight,
        if (notes != null) 'notes': notes,
      };
}

