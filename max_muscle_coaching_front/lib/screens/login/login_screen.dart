import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:max_muscle_coaching_front/screens/forgot_password/forgot_password_screen.dart';
import 'package:max_muscle_coaching_front/screens/onboarding/onboarding_screen.dart';
import 'package:max_muscle_coaching_front/theme/app_colors.dart';
import 'package:max_muscle_coaching_front/theme/app_text_styles.dart';
import 'package:max_muscle_coaching_front/widgets/app_background.dart';
import 'package:max_muscle_coaching_front/widgets/primary_button.dart';

import 'login_controller.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return GetBuilder<LoginController>(
      init: LoginController(),
      builder: (controller) {
        return Scaffold(
          body: AppBackground(
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    const SizedBox(height: 40),
                    _Header(),
                    const SizedBox(height: 40),
                    Expanded(
                      child: SingleChildScrollView(
                        child: Column(
                          children: [
                            if (controller.errorMessage != null)
                              Container(
                                padding: const EdgeInsets.all(14),
                                margin: const EdgeInsets.only(bottom: 16),
                                decoration: BoxDecoration(
                                  color: AppColors.errorBackground(alpha: 0.10),
                                  borderRadius: BorderRadius.circular(18),
                                  border: Border.all(
                                    color: AppColors.errorBorder(alpha: 0.30),
                                    width: 2,
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(Icons.error_outline_rounded, color: AppColors.red, size: 20),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Text(
                                        controller.errorMessage!,
                                        style: AppTextStyles.body(size: 12, weight: FontWeight.w600, color: AppColors.red),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            _Field(
                              label: 'Email',
                              controller: controller.emailController,
                              keyboardType: TextInputType.emailAddress,
                              error: controller.emailError,
                            ),
                            const SizedBox(height: 14),
                            _PasswordField(
                              label: 'Password',
                              controller: controller.passwordController,
                              obscureText: controller.obscurePassword,
                              error: controller.passwordError,
                              onToggleVisibility: controller.togglePasswordVisibility,
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Checkbox(
                                  value: controller.stayLoggedIn,
                                  onChanged: controller.isLoading ? null : controller.setRememberMe,
                                  activeColor: AppColors.volt,
                                  checkColor: AppColors.dark,
                                  side: BorderSide(color: AppColors.grey600, width: 2),
                                ),
                                Text(
                                  'Remember me',
                                  style: AppTextStyles.body(size: 12, weight: FontWeight.w700, color: AppColors.grey600),
                                ),
                              ],
                            ),
                            Align(
                              alignment: Alignment.centerRight,
                              child: TextButton(
                                onPressed: controller.isLoading
                                    ? null
                                    : () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) => const ForgotPasswordScreen(),
                                          ),
                                        );
                                      },
                                child: Text(
                                  'FORGOT PASSWORD?',
                                  style: AppTextStyles.caps(color: AppColors.grey600, weight: FontWeight.w800, letterSpacing: 1.5),
                                ),
                              ),
                            ),
                            const SizedBox(height: 24),
                            PrimaryButton(
                              label: 'Login',
                              isLoading: controller.isLoading,
                              onPressed: controller.login,
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Don't have an account? ",
                          style: AppTextStyles.body(size: 12, weight: FontWeight.w600, color: AppColors.grey600, height: 1.2),
                        ),
                        TextButton(
                          onPressed: controller.isLoading
                              ? null
                              : () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => const OnboardingScreen(),
                                    ),
                                  );
                                },
                          child: Text(
                            'SIGN UP',
                            style: AppTextStyles.label(size: 12, weight: FontWeight.w900, letterSpacing: 1.2, color: AppColors.volt),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _Header extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text.rich(
          TextSpan(
            children: [
              const TextSpan(text: 'Welcome '),
              TextSpan(text: 'Back', style: AppTextStyles.display(size: 34, height: 1.05, letterSpacing: -1.2, color: AppColors.volt)),
            ],
          ),
          style: AppTextStyles.display(size: 34, height: 1.05, letterSpacing: -1.2),
        ),
        const SizedBox(height: 8),
        Text(
          'Sign in to continue your journey.',
          style: AppTextStyles.body(size: 13, weight: FontWeight.w600, color: AppColors.grey400, height: 1.2),
        ),
      ],
    );
  }
}

class _Field extends StatelessWidget {
  const _Field({
    required this.label,
    required this.controller,
    required this.keyboardType,
    required this.error,
  });

  final String label;
  final TextEditingController controller;
  final TextInputType keyboardType;
  final bool error;

  @override
  Widget build(BuildContext context) {
    final border = OutlineInputBorder(
      borderRadius: BorderRadius.circular(18),
      borderSide: BorderSide(
        color: error ? AppColors.red400 : AppColors.transparent,
        width: 2,
      ),
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 6, bottom: 6),
          child: Text(
            label.toUpperCase(),
            style: AppTextStyles.caps(color: AppColors.grey600, weight: FontWeight.w800, letterSpacing: 2),
          ),
        ),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          style: AppTextStyles.label(weight: FontWeight.w800),
          decoration: InputDecoration(
            filled: true,
            fillColor: AppColors.surfaceHighlight,
            suffixIcon: error ? Icon(Icons.error_outline_rounded, color: AppColors.red400) : null,
            border: border,
            enabledBorder: border,
            focusedBorder: border.copyWith(
              borderSide: BorderSide(
                color: error ? AppColors.red400 : AppColors.volt,
                width: 2,
              ),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
        ),
      ],
    );
  }
}

class _PasswordField extends StatelessWidget {
  const _PasswordField({
    required this.label,
    required this.controller,
    required this.obscureText,
    required this.error,
    required this.onToggleVisibility,
  });

  final String label;
  final TextEditingController controller;
  final bool obscureText;
  final bool error;
  final VoidCallback onToggleVisibility;

  @override
  Widget build(BuildContext context) {
    final border = OutlineInputBorder(
      borderRadius: BorderRadius.circular(18),
      borderSide: BorderSide(
        color: error ? AppColors.red400 : AppColors.transparent,
        width: 2,
      ),
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 6, bottom: 6),
          child: Text(
            label.toUpperCase(),
            style: AppTextStyles.caps(color: AppColors.grey600, weight: FontWeight.w800, letterSpacing: 2),
          ),
        ),
        TextField(
          controller: controller,
          obscureText: obscureText,
          style: AppTextStyles.label(weight: FontWeight.w800),
          decoration: InputDecoration(
            filled: true,
            fillColor: AppColors.surfaceHighlight,
            suffixIcon: IconButton(
              icon: Icon(
                obscureText ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                color: AppColors.grey600,
              ),
              onPressed: onToggleVisibility,
            ),
            border: border,
            enabledBorder: border,
            focusedBorder: border.copyWith(
              borderSide: BorderSide(
                color: error ? AppColors.red400 : AppColors.volt,
                width: 2,
              ),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
        ),
      ],
    );
  }
}
