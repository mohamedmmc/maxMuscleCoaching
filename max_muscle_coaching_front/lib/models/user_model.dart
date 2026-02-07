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

const splitDescriptions = <WorkoutSplit, String>{
  WorkoutSplit.broSplit:
      'Focus on one major muscle group per day (e.g., Chest, Back, Legs).',
  WorkoutSplit.ppl: 'Divide training into pushing, pulling, and leg movements.',
  WorkoutSplit.fullBody: 'Train the entire body in every session.',
  WorkoutSplit.upperLower:
      'Alternate between upper body and lower body sessions.',
};

T? _enumOrNull<T extends Enum>(List<T> values, Object? raw) {
  final normalized = raw?.toString().trim();
  if (normalized == null || normalized.isEmpty) return null;
  for (final v in values) {
    if (v.name == normalized) return v;
  }
  final lower = normalized.toLowerCase();
  for (final v in values) {
    if (v.name.toLowerCase() == lower) return v;
  }
  return null;
}

DateTime? _dateTimeOrNull(Object? raw) {
  if (raw == null) return null;
  final text = raw.toString().trim();
  if (text.isEmpty) return null;
  return DateTime.tryParse(text);
}

class User {
  int? id;
  String? name;
  String? firstName;
  String? lastName;
  String? email;
  String? password;
  String? phoneNumber;
  String? googleId;
  String? facebookId;
  String? appleId;
  String? picture;
  bool? isVerified;
  int? age;
  double? weight;
  double? height;
  DateTime? birthdate;
  Gender? gender;
  FitnessLevel? fitnessLevel;
  String? injuryHistory;
  WorkoutSplit? split;
  int? daysPerWeek;
  int? sessionDurationMinutes;
  TrainingLocation? location;
  DateTime? createdAt;
  DateTime? updatedAt;

  User({
    this.id,
    this.name,
    this.firstName,
    this.lastName,
    this.email,
    this.password,
    this.phoneNumber,
    this.googleId,
    this.facebookId,
    this.appleId,
    this.picture,
    this.isVerified,
    this.age,
    this.weight,
    this.height,
    this.birthdate,
    this.gender,
    this.fitnessLevel,
    this.injuryHistory,
    this.split,
    this.daysPerWeek,
    this.sessionDurationMinutes,
    this.location,
    this.createdAt,
    this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: (json['id'] as num?)?.toInt(),
      name: json['name'] as String?,
      firstName: json['firstName'] as String?,
      lastName: json['lastName'] as String?,
      email: json['email'] as String?,
      password: json['password'] as String?,
      phoneNumber: json['phoneNumber'] as String?,
      googleId: json['googleId'] as String?,
      facebookId: json['facebookId'] as String?,
      appleId: json['appleId'] as String?,
      picture: json['picture'] as String?,
      isVerified: json['isVerified'] as bool?,
      age: (json['age'] as num?)?.toInt(),
      weight:
          json['weight'] != null ? (json['weight'] as num).toDouble() : null,
      height:
          json['height'] != null ? (json['height'] as num).toDouble() : null,
      birthdate: _dateTimeOrNull(json['birthdate']),
      gender: _enumOrNull(Gender.values, json['gender']),
      fitnessLevel: _enumOrNull(FitnessLevel.values, json['fitnessLevel']),
      injuryHistory: json['injuryHistory'] as String?,
      split: _enumOrNull(WorkoutSplit.values, json['split']),
      daysPerWeek: (json['daysPerWeek'] as num?)?.toInt(),
      sessionDurationMinutes: (json['sessionDurationMinutes'] as num?)?.toInt(),
      location: _enumOrNull(TrainingLocation.values, json['location']),
      createdAt: _dateTimeOrNull(json['createdAt']),
      updatedAt: _dateTimeOrNull(json['updatedAt']),
    );
  }

  factory User.fromToken(Map<String, dynamic> payload) => User(
        id: payload['id'],
        name: payload['name'],
        lastName: payload['lastName'],
        phoneNumber: payload['phone'],
        email: payload['email'],
        picture: payload['picture']?.toString(),
      );

  Map<String, dynamic> toSocialJson() {
    Map<String, dynamic> data = {};
    data['name'] = name;
    data['lastName'] = lastName;
    data['email'] = email;
    data['facebookId'] = facebookId;
    data['googleId'] = googleId;
    return data;
  }

  Map<String, dynamic> toUpdateJson() {
    Map<String, dynamic> data = {};
    data['id'] = id;
    data['email'] = email;
    data['name'] = name;
    data['lastName'] = lastName;
    data['phoneNumber'] = phoneNumber;

    return data;
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'password': password,
      'phoneNumber': phoneNumber,
      'googleId': googleId,
      'facebookId': facebookId,
      'appleId': appleId,
      'picture': picture,
      'isVerified': isVerified,
      'age': age,
      'weight': weight,
      'height': height,
      'birthdate': birthdate?.toIso8601String().split('T')[0],
      'gender': gender?.name,
      'fitnessLevel': fitnessLevel?.name,
      'injuryHistory': injuryHistory,
      'split': split?.name,
      'daysPerWeek': daysPerWeek,
      'sessionDurationMinutes': sessionDurationMinutes,
      'location': location?.name,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  User copyWith({
    int? id,
    String? name,
    String? firstName,
    String? lastName,
    String? email,
    String? password,
    String? phoneNumber,
    String? googleId,
    String? facebookId,
    String? appleId,
    String? picture,
    bool? isVerified,
    int? age,
    double? weight,
    double? height,
    DateTime? birthdate,
    Gender? gender,
    FitnessLevel? fitnessLevel,
    String? injuryHistory,
    WorkoutSplit? split,
    int? daysPerWeek,
    int? sessionDurationMinutes,
    TrainingLocation? location,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      email: email ?? this.email,
      password: password ?? this.password,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      googleId: googleId ?? this.googleId,
      facebookId: facebookId ?? this.facebookId,
      appleId: appleId ?? this.appleId,
      picture: picture ?? this.picture,
      isVerified: isVerified ?? this.isVerified,
      age: age ?? this.age,
      weight: weight ?? this.weight,
      height: height ?? this.height,
      birthdate: birthdate ?? this.birthdate,
      gender: gender ?? this.gender,
      fitnessLevel: fitnessLevel ?? this.fitnessLevel,
      injuryHistory: injuryHistory ?? this.injuryHistory,
      split: split ?? this.split,
      daysPerWeek: daysPerWeek ?? this.daysPerWeek,
      sessionDurationMinutes:
          sessionDurationMinutes ?? this.sessionDurationMinutes,
      location: location ?? this.location,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
