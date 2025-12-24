import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:max_muscle_coaching_front/theme/app_colors.dart';
import 'package:max_muscle_coaching_front/theme/app_text_styles.dart';
import 'package:max_muscle_coaching_front/widgets/app_background.dart';
import 'package:max_muscle_coaching_front/widgets/primary_button.dart';

import 'forgot_password_controller.dart';

class ForgotPasswordScreen extends StatelessWidget {
  const ForgotPasswordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return GetBuilder<ForgotPasswordController>(
      init: ForgotPasswordController(),
      builder: (controller) {
        Future<void> handlePrimaryAction() async {
          if (controller.isLoading) return;
          if (!controller.codeSent) {
            await controller.sendVerificationCode();
            return;
          }

          final ok = await controller.resetPassword();
          if (!ok || !context.mounted) return;

          await showDialog<void>(
            context: context,
            barrierDismissible: false,
            builder: (context) => AlertDialog(
              backgroundColor: AppColors.surfaceHighlight,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(18),
              ),
              title: Row(
                children: [
                  Icon(Icons.check_circle_rounded, color: AppColors.volt, size: 32),
                  SizedBox(width: 12),
                  Text(
                    'Success!',
                    style: AppTextStyles.title(size: 18, fontStyle: FontStyle.normal),
                  ),
                ],
              ),
              content: Text(
                'Your password has been reset successfully. You can now login with your new password.',
                style: AppTextStyles.body(size: 13, weight: FontWeight.w600, color: AppColors.grey400),
              ),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.pop(context);
                  },
                  child: Text(
                    'OK',
                    style: AppTextStyles.label(weight: FontWeight.w900, letterSpacing: 1.2, color: AppColors.volt),
                  ),
                ),
              ],
            ),
          );
        }

        return Scaffold(
          body: AppBackground(
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_back,
                              color: AppColors.white, size: 24),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    _Header(codeSent: controller.codeSent),
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
                            if (controller.successMessage != null)
                              Container(
                                padding: const EdgeInsets.all(14),
                                margin: const EdgeInsets.only(bottom: 16),
                                decoration: BoxDecoration(
                                  color: AppColors.volt.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(18),
                                  border: Border.all(
                                    color:
                                        AppColors.volt.withValues(alpha: 0.3),
                                    width: 2,
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(
                                        Icons.check_circle_outline_rounded,
                                        color: AppColors.volt,
                                        size: 20),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: Text(
                                        controller.successMessage!,
                                        style: AppTextStyles.body(size: 12, weight: FontWeight.w600, color: AppColors.volt),
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
                              enabled: !controller.codeSent,
                            ),
                            if (controller.codeSent) ...[
                              const SizedBox(height: 14),
                              _Field(
                                label: 'Verification Code',
                                controller: controller.codeController,
                                keyboardType: TextInputType.number,
                                error: controller.codeError,
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 14),
                              _PasswordField(
                                label: 'New Password',
                                controller: controller.passwordController,
                                obscureText: controller.obscurePassword,
                                error: controller.passwordError,
                                onToggleVisibility:
                                    controller.togglePasswordVisibility,
                              ),
                              const SizedBox(height: 14),
                              _PasswordField(
                                label: 'Confirm Password',
                                controller:
                                    controller.confirmPasswordController,
                                obscureText:
                                    controller.obscureConfirmPassword,
                                error: controller.confirmPasswordError,
                                onToggleVisibility: controller
                                    .toggleConfirmPasswordVisibility,
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),
                    PrimaryButton(
                      label: controller.codeSent ? 'Reset Password' : 'Send Code',
                      isLoading: controller.isLoading,
                      onPressed: handlePrimaryAction,
                    ),
                    if (controller.codeSent) ...[
                      const SizedBox(height: 12),
                      TextButton(
                        onPressed:
                            controller.isLoading ? null : controller.resetFlow,
                        child: Text(
                          'RESEND CODE',
                          style: AppTextStyles.caps(color: AppColors.grey600, weight: FontWeight.w800, letterSpacing: 1.5),
                        ),
                      ),
                    ],
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
  const _Header({required this.codeSent});

  final bool codeSent;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text.rich(
          TextSpan(
            children: [
              const TextSpan(text: 'Reset '),
              TextSpan(text: 'Password', style: AppTextStyles.display(size: 34, height: 1.05, letterSpacing: -1.2, color: AppColors.volt)),
            ],
          ),
          style: AppTextStyles.display(size: 34, height: 1.05, letterSpacing: -1.2),
        ),
        const SizedBox(height: 8),
        Text(
          codeSent ? 'Enter the code and create a new password.' : 'Enter your email to receive a reset code.',
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
    this.enabled = true,
    this.textAlign = TextAlign.start,
  });

  final String label;
  final TextEditingController controller;
  final TextInputType keyboardType;
  final bool error;
  final bool enabled;
  final TextAlign textAlign;

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
          enabled: enabled,
          textAlign: textAlign,
          style: AppTextStyles.label(weight: FontWeight.w800).copyWith(color: enabled ? AppColors.white : AppColors.grey600),
          decoration: InputDecoration(
            filled: true,
            fillColor: AppColors.surfaceHighlight,
            suffixIcon: error ? Icon(Icons.error_outline_rounded, color: AppColors.red400) : null,
            border: border,
            enabledBorder: border,
            disabledBorder: border,
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
