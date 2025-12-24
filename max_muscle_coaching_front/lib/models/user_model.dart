import 'package:max_muscle_coaching_front/networking/api_base_helper.dart';

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
  String? gender;
  String? fitnessLevel;
  String? injuryHistory;
  String? split;
  int? daysPerWeek;
  int? sessionDurationMinutes;
  String? location;
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
      id: json['id'] as int?,
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
      age: json['age'] as int?,
      weight: json['weight'] != null ? (json['weight'] as num).toDouble() : null,
      height: json['height'] != null ? (json['height'] as num).toDouble() : null,
      birthdate: json['birthdate'] != null ? DateTime.parse(json['birthdate'] as String) : null,
      gender: json['gender'] as String?,
      fitnessLevel: json['fitnessLevel'] as String?,
      injuryHistory: json['injuryHistory'] as String?,
      split: json['split'] as String?,
      daysPerWeek: json['daysPerWeek'] as int?,
      sessionDurationMinutes: json['sessionDurationMinutes'] as int?,
      location: json['location'] as String?,
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt'] as String) : null,
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt'] as String) : null,
    );
  }
  factory User.fromToken(Map<String, dynamic> payload) => User(
        id: payload['id'],
        name: payload['name'],
        lastName: payload['lastName'],
        phoneNumber: payload['phone'],
        email: payload['email'],
        picture: payload['picture'] != null ? ApiBaseHelper().getClientImage(payload['picture']) : null,
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
      'gender': gender,
      'fitnessLevel': fitnessLevel,
      'injuryHistory': injuryHistory,
      'split': split,
      'daysPerWeek': daysPerWeek,
      'sessionDurationMinutes': sessionDurationMinutes,
      'location': location,
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
    String? gender,
    String? fitnessLevel,
    String? injuryHistory,
    String? split,
    int? daysPerWeek,
    int? sessionDurationMinutes,
    String? location,
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
      sessionDurationMinutes: sessionDurationMinutes ?? this.sessionDurationMinutes,
      location: location ?? this.location,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
