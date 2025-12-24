import 'dart:convert';

enum Gender {
  male,
  female;

  String get label => switch (this) {
        Gender.male => 'Male',
        Gender.female => 'Female',
      };
}

enum WorkoutSplit {
  ppl,
  upperLower,
  fullBody,
  broSplit;

  String get label => switch (this) {
        WorkoutSplit.ppl => 'PPL',
        WorkoutSplit.upperLower => 'Upper/Lower',
        WorkoutSplit.fullBody => 'Full Body',
        WorkoutSplit.broSplit => 'Bro Split',
      };
}

enum FitnessLevel {
  beginner,
  intermediate,
  advanced;

  String get label => switch (this) {
        FitnessLevel.beginner => 'Beginner',
        FitnessLevel.intermediate => 'Intermediate',
        FitnessLevel.advanced => 'Advanced',
      };
}

enum TrainingLocation {
  gym,
  home;

  String get label => switch (this) {
        TrainingLocation.gym => 'Gym',
        TrainingLocation.home => 'Home',
      };
}

class UserProfile {
  const UserProfile({
    required this.name,
    required this.email,
    required this.birthdate,
    required this.age,
    required this.weightKg,
    required this.heightCm,
    required this.gender,
    required this.fitnessLevel,
    required this.injuryHistory,
    required this.split,
    required this.daysPerWeek,
    required this.sessionDurationMinutes,
    required this.location,
  });

  final String name;
  final String email;
  final String birthdate;
  final int age;
  final double weightKg;
  final double heightCm;
  final Gender gender;
  final FitnessLevel fitnessLevel;
  final String injuryHistory;
  final WorkoutSplit split;
  final int daysPerWeek;
  final int sessionDurationMinutes;
  final TrainingLocation location;

  UserProfile copyWith({
    String? name,
    String? email,
    String? birthdate,
    int? age,
    double? weightKg,
    double? heightCm,
    Gender? gender,
    FitnessLevel? fitnessLevel,
    String? injuryHistory,
    WorkoutSplit? split,
    int? daysPerWeek,
    int? sessionDurationMinutes,
    TrainingLocation? location,
  }) {
    return UserProfile(
      name: name ?? this.name,
      email: email ?? this.email,
      birthdate: birthdate ?? this.birthdate,
      age: age ?? this.age,
      weightKg: weightKg ?? this.weightKg,
      heightCm: heightCm ?? this.heightCm,
      gender: gender ?? this.gender,
      fitnessLevel: fitnessLevel ?? this.fitnessLevel,
      injuryHistory: injuryHistory ?? this.injuryHistory,
      split: split ?? this.split,
      daysPerWeek: daysPerWeek ?? this.daysPerWeek,
      sessionDurationMinutes: sessionDurationMinutes ?? this.sessionDurationMinutes,
      location: location ?? this.location,
    );
  }

  Map<String, Object?> toJson() {
    return {
      'name': name,
      'email': email,
      'birthdate': birthdate,
      'age': age,
      'weightKg': weightKg,
      'heightCm': heightCm,
      'gender': gender.name,
      'fitnessLevel': fitnessLevel.name,
      'injuryHistory': injuryHistory,
      'split': split.name,
      'daysPerWeek': daysPerWeek,
      'sessionDurationMinutes': sessionDurationMinutes,
      'location': location.name,
    };
  }

  factory UserProfile.fromJson(Map<String, Object?> json) {
    return UserProfile(
      name: (json['name'] as String?) ?? '',
      email: (json['email'] as String?) ?? '',
      birthdate: (json['birthdate'] as String?) ?? '',
      age: (json['age'] as num?)?.toInt() ?? 0,
      weightKg: (json['weightKg'] as num?)?.toDouble() ?? 0,
      heightCm: (json['heightCm'] as num?)?.toDouble() ?? 0,
      gender: _enumOrDefault(Gender.values, json['gender'], Gender.male),
      fitnessLevel: _enumOrDefault(FitnessLevel.values, json['fitnessLevel'], FitnessLevel.beginner),
      injuryHistory: (json['injuryHistory'] as String?) ?? '',
      split: _enumOrDefault(WorkoutSplit.values, json['split'], WorkoutSplit.ppl),
      daysPerWeek: (json['daysPerWeek'] as num?)?.toInt() ?? 4,
      sessionDurationMinutes: (json['sessionDurationMinutes'] as num?)?.toInt() ?? 45,
      location: _enumOrDefault(TrainingLocation.values, json['location'], TrainingLocation.gym),
    );
  }

  static UserProfile? tryParse(String raw) {
    try {
      final decoded = jsonDecode(raw);
      if (decoded is! Map) return null;
      return UserProfile.fromJson(decoded.cast<String, Object?>());
    } catch (_) {
      return null;
    }
  }
}

T _enumOrDefault<T extends Enum>(List<T> values, Object? raw, T fallback) {
  if (raw is! String) return fallback;
  for (final v in values) {
    if (v.name == raw) return v;
  }
  return fallback;
}

const splitDescriptions = <WorkoutSplit, String>{
  WorkoutSplit.broSplit: 'Focus on one major muscle group per day (e.g., Chest, Back, Legs).',
  WorkoutSplit.ppl: 'Divide training into pushing, pulling, and leg movements.',
  WorkoutSplit.fullBody: 'Train the entire body in every session.',
  WorkoutSplit.upperLower: 'Alternate between upper body and lower body sessions.',
};
