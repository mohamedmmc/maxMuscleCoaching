import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:max_muscle_coaching_front/controllers/app_controller.dart';
import 'package:max_muscle_coaching_front/models/models.dart';
import 'package:max_muscle_coaching_front/models/user_model.dart';
import 'package:max_muscle_coaching_front/repository/user_repository.dart';
import 'package:max_muscle_coaching_front/services/connectivity_service.dart';
import 'package:max_muscle_coaching_front/services/snackbar_service.dart';

class OnboardingController extends GetxController {
  final UserRepository _userRepository = Get.find<UserRepository>();

  User draftUser = User();

  int step = 1;

  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  final ageController = TextEditingController();
  final weightController = TextEditingController();
  final heightController = TextEditingController();
  final injuryController = TextEditingController();

  Gender gender = Gender.male;
  WorkoutSplit split = WorkoutSplit.ppl;
  FitnessLevel fitnessLevel = FitnessLevel.beginner;
  TrainingLocation location = TrainingLocation.gym;
  int daysPerWeek = 4;
  int sessionDuration = 45;

  bool nameError = false;
  bool emailError = false;
  bool ageError = false;
  bool weightError = false;
  bool heightError = false;
  bool passwordError = false;
  bool confirmPasswordError = false;

  bool obscurePassword = true;
  bool obscureConfirmPassword = true;

  bool isLoading = false;
  String? errorMessage;

  void _syncDraftFromFields() {
    final name = nameController.text.trim();
    final email = emailController.text.trim();
    final age = int.tryParse(ageController.text.trim());
    final weight = double.tryParse(weightController.text.trim());
    final height = double.tryParse(heightController.text.trim());
    final injuryHistory = injuryController.text.trim();

    draftUser = draftUser.copyWith(
      name: name.isEmpty ? null : name,
      email: email.isEmpty ? null : email,
      password: passwordController.text,
      age: age,
      weight: weight,
      height: height,
      gender: gender.name,
      fitnessLevel: fitnessLevel.name,
      injuryHistory: injuryHistory.isEmpty ? null : injuryHistory,
      split: split.name,
      daysPerWeek: daysPerWeek,
      sessionDurationMinutes: sessionDuration,
      location: location.name,
    );
  }

  void togglePasswordVisibility() {
    obscurePassword = !obscurePassword;
    update();
  }

  void toggleConfirmPasswordVisibility() {
    obscureConfirmPassword = !obscureConfirmPassword;
    update();
  }

  void setGender(Gender value) {
    gender = value;
    _syncDraftFromFields();
    update();
  }

  void setSplit(WorkoutSplit value) {
    split = value;
    _syncDraftFromFields();
    update();
  }

  void setFitnessLevel(FitnessLevel value) {
    fitnessLevel = value;
    _syncDraftFromFields();
    update();
  }

  void setLocation(TrainingLocation value) {
    location = value;
    _syncDraftFromFields();
    update();
  }

  void setDaysPerWeek(int value) {
    daysPerWeek = value;
    _syncDraftFromFields();
    update();
  }

  void setSessionDuration(int value) {
    sessionDuration = value;
    _syncDraftFromFields();
    update();
  }

  bool validateStep1() {
    _syncDraftFromFields();

    final name = nameController.text.trim();
    final email = emailController.text.trim();
    final age = int.tryParse(ageController.text.trim());
    final weight = double.tryParse(weightController.text.trim());
    final height = double.tryParse(heightController.text.trim());
    final password = passwordController.text;
    final confirmPassword = confirmPasswordController.text;

    nameError = name.isEmpty;
    emailError = email.isEmpty || !email.contains('@');
    ageError = age == null || age <= 0;
    weightError = weight == null || weight <= 0;
    heightError = height == null || height <= 0;
    passwordError = password.isEmpty || password.length < 6;
    confirmPasswordError = confirmPassword != password;
    update();

    return !(nameError || emailError || ageError || weightError || heightError || passwordError || confirmPasswordError);
  }

  void nextStep() {
    if (step == 1 && !validateStep1()) return;
    step = (step + 1).clamp(1, 3);
    update();
  }

  Future<bool> submit() async {
    if (!validateStep1()) return false;

    _syncDraftFromFields();

    final hasInternet = await ConnectivityService.hasInternet();
    if (!hasInternet) {
      SnackbarService.showNoInternet();
      return false;
    }

    isLoading = true;
    errorMessage = null;
    update();

    try {
      final jwt = await _userRepository.signup(user: draftUser);
      if (jwt == null) {
        throw Exception('Signup failed. Please try again.');
      }

      await AppController.find.setJwt(jwt);
      return true;
    } catch (e) {
      errorMessage = e.toString().replaceAll('Exception: ', '');
      return false;
    } finally {
      isLoading = false;
      update();
    }
  }

  @override
  void onInit() {
    super.onInit();
    for (final controller in [
      nameController,
      emailController,
      passwordController,
      confirmPasswordController,
      ageController,
      weightController,
      heightController,
      injuryController,
    ]) {
      controller.addListener(_syncDraftFromFields);
    }
    _syncDraftFromFields();
  }

  @override
  void onClose() {
    for (final controller in [
      nameController,
      emailController,
      passwordController,
      confirmPasswordController,
      ageController,
      weightController,
      heightController,
      injuryController,
    ]) {
      controller.removeListener(_syncDraftFromFields);
    }
    nameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    ageController.dispose();
    weightController.dispose();
    heightController.dispose();
    injuryController.dispose();
    super.onClose();
  }
}
