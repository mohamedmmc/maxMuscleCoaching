class BodyweightEntry {
  const BodyweightEntry({
    required this.id,
    required this.weight,
    required this.dateLogged,
  });

  final int id;
  final double weight;
  final String dateLogged;

  factory BodyweightEntry.fromJson(Map<String, dynamic> json) =>
      BodyweightEntry(
        id: (json['id'] as num?)?.toInt() ?? 0,
        weight: (json['weight'] as num?)?.toDouble() ?? 0,
        dateLogged: json['dateLogged']?.toString() ?? '',
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'weight': weight,
        'dateLogged': dateLogged,
      };
}
