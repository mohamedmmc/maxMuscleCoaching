import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:max_muscle_coaching_front/controllers/app_controller.dart';
import 'package:max_muscle_coaching_front/models/user_model.dart';
import 'package:max_muscle_coaching_front/repository/user_repository.dart';
import 'package:max_muscle_coaching_front/services/connectivity_service.dart';
import 'package:max_muscle_coaching_front/services/snackbar_service.dart';

class LoginController extends GetxController {
  final UserRepository _userRepository = Get.find<UserRepository>();

  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  bool isLoading = false;
  bool obscurePassword = true;
  bool emailError = false;
  bool passwordError = false;
  String? errorMessage;

  void togglePasswordVisibility() {
    obscurePassword = !obscurePassword;
    update();
  }

  bool validate() {
    final email = emailController.text.trim();
    final password = passwordController.text;

    emailError = email.isEmpty || !email.contains('@');
    passwordError = password.isEmpty;
    update();

    return !(emailError || passwordError);
  }

  Future<void> login() async {
    if (!validate()) return;

    final hasInternet = await ConnectivityService.hasInternet();
    if (!hasInternet) {
      SnackbarService.showNoInternet();
      return;
    }

    isLoading = true;
    errorMessage = null;
    update();

    try {
      final user = User(
        email: emailController.text.trim(),
        password: passwordController.text,
      );
      final loginDTO = await _userRepository.login(user: user);
      final jwt = loginDTO?.token;
      if (jwt == null) {
        throw Exception('Invalid credentials.');
      }
      await AppController.find.setJwt(jwt);
    } catch (e) {
      errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      isLoading = false;
      update();
    }
  }

  @override
  void onClose() {
    emailController.dispose();
    passwordController.dispose();
    super.onClose();
  }
}
