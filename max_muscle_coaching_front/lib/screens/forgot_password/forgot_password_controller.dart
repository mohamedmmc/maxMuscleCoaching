import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:max_muscle_coaching_front/repository/user_repository.dart';

class ForgotPasswordController extends GetxController {
  final UserRepository _authService = Get.find<UserRepository>();

  final emailController = TextEditingController();
  final codeController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  bool isLoading = false;
  bool obscurePassword = true;
  bool obscureConfirmPassword = true;
  bool codeSent = false;

  bool emailError = false;
  bool codeError = false;
  bool passwordError = false;
  bool confirmPasswordError = false;

  String? errorMessage;
  String? successMessage;

  void togglePasswordVisibility() {
    obscurePassword = !obscurePassword;
    update();
  }

  void toggleConfirmPasswordVisibility() {
    obscureConfirmPassword = !obscureConfirmPassword;
    update();
  }

  bool validateEmail() {
    final email = emailController.text.trim();
    emailError = email.isEmpty || !email.contains('@');
    update();
    return !emailError;
  }

  bool validateReset() {
    final code = codeController.text.trim();
    final password = passwordController.text;
    final confirmPassword = confirmPasswordController.text;

    codeError = code.isEmpty || code.length < 4;
    passwordError = password.isEmpty || password.length < 6;
    confirmPasswordError = confirmPassword != password;
    update();

    return !(codeError || passwordError || confirmPasswordError);
  }

  Future<bool> sendVerificationCode() async {
    if (!validateEmail()) return false;

    isLoading = true;
    errorMessage = null;
    successMessage = null;
    update();

    try {
      await _authService.sendChangePasswordCode(
        emailController.text.trim(),
      );
      codeSent = true;
      successMessage = 'Verification code sent to your email';
      return true;
    } catch (e) {
      errorMessage = e.toString().replaceAll('Exception: ', '');
      return false;
    } finally {
      isLoading = false;
      update();
    }
  }

  Future<bool> resetPassword() async {
    if (!validateReset()) return false;

    isLoading = true;
    errorMessage = null;
    successMessage = null;
    update();

    try {
      await _authService.forgotPassword(
        passwordController.text,
        codeController.text.trim(),
      );
      successMessage = 'Password reset successful';
      return true;
    } catch (e) {
      errorMessage = e.toString().replaceAll('Exception: ', '');
      return false;
    } finally {
      isLoading = false;
      update();
    }
  }

  void resetFlow() {
    codeSent = false;
    codeController.clear();
    passwordController.clear();
    confirmPasswordController.clear();
    errorMessage = null;
    successMessage = null;
    update();
  }

  @override
  void onClose() {
    emailController.dispose();
    codeController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.onClose();
  }
}
