import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:max_muscle_coaching_front/models/models.dart';
import 'package:max_muscle_coaching_front/theme/app_colors.dart';
import 'package:max_muscle_coaching_front/theme/app_text_styles.dart';
import 'package:max_muscle_coaching_front/widgets/app_background.dart';
import 'package:max_muscle_coaching_front/widgets/primary_button.dart';

import 'onboarding_controller.dart';

part 'components/onboarding_step1.dart';
part 'components/onboarding_step2.dart';
part 'components/onboarding_step3.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return GetBuilder<OnboardingController>(
      init: OnboardingController(),
      builder: (controller) {
        Future<void> handleSubmit() async {
          final ok = await controller.submit();
          if (!ok || !context.mounted) return;
          Navigator.of(context).popUntil((route) => route.isFirst);
        }

        return Scaffold(
          body: AppBackground(
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    _StepIndicator(step: controller.step),
                    const SizedBox(height: 28),
                    _Header(step: controller.step),
                    const SizedBox(height: 20),
                    if (controller.errorMessage != null) ...[
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
	                                style: AppTextStyles.body(
	                                  size: 12,
	                                  weight: FontWeight.w600,
	                                  color: AppColors.red,
	                                ),
	                              ),
	                            ),
	                          ],
	                        ),
	                      ),
                    ],
                    Expanded(
                      child: AnimatedSwitcher(
                        duration: const Duration(milliseconds: 220),
                        transitionBuilder: (child, animation) {
                          final offset = Tween<Offset>(
                            begin: const Offset(0, 0.08),
                            end: Offset.zero,
                          ).animate(
                            CurvedAnimation(
                              parent: animation,
                              curve: Curves.easeOut,
                            ),
                          );
                          return FadeTransition(
                            opacity: animation,
                            child: SlideTransition(
                              position: offset,
                              child: child,
                            ),
                          );
                        },
                        child: switch (controller.step) {
                          1 => _Step1(
                              key: const ValueKey('s1'),
                              nameController: controller.nameController,
                              emailController: controller.emailController,
                              passwordController: controller.passwordController,
                              confirmPasswordController: controller.confirmPasswordController,
                              ageController: controller.ageController,
                              weightController: controller.weightController,
                              heightController: controller.heightController,
                              gender: controller.gender,
                              onChangeGender: controller.setGender,
                              obscurePassword: controller.obscurePassword,
                              obscureConfirmPassword: controller.obscureConfirmPassword,
                              onTogglePasswordVisibility: controller.togglePasswordVisibility,
                              onToggleConfirmPasswordVisibility: controller.toggleConfirmPasswordVisibility,
                              nameError: controller.nameError,
                              emailError: controller.emailError,
                              passwordError: controller.passwordError,
                              confirmPasswordError: controller.confirmPasswordError,
                              ageError: controller.ageError,
                              weightError: controller.weightError,
                              heightError: controller.heightError,
                            ),
                          2 => _Step2(
                              key: const ValueKey('s2'),
                              split: controller.split,
                              fitnessLevel: controller.fitnessLevel,
                              onChangeSplit: controller.setSplit,
                              onChangeLevel: controller.setFitnessLevel,
                            ),
                          _ => _Step3(
                              key: const ValueKey('s3'),
                              location: controller.location,
                              daysPerWeek: controller.daysPerWeek,
                              sessionDuration: controller.sessionDuration,
                              injuryController: controller.injuryController,
                              onChangeLocation: controller.setLocation,
                              onChangeDaysPerWeek: controller.setDaysPerWeek,
                              onChangeDuration: controller.setSessionDuration,
                            ),
                        },
                      ),
                    ),
                    const SizedBox(height: 18),
                    PrimaryButton(
                      label: controller.step == 3 ? 'Create Account' : 'Next Phase',
                      isLoading: controller.isLoading,
	                      trailing: controller.step == 3
	                          ? null
	                          : const Icon(
	                              Icons.chevron_right_rounded,
	                              size: 24,
	                              color: AppColors.black,
	                            ),
	                      onPressed: controller.step == 3 ? handleSubmit : controller.nextStep,
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

class _StepIndicator extends StatelessWidget {
  const _StepIndicator({required this.step});

  final int step;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        for (var i = 1; i <= 3; i++) ...[
          Expanded(
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              height: 6,
              decoration: BoxDecoration(
                color: i <= step ? AppColors.volt : AppColors.grey900,
                borderRadius: BorderRadius.circular(99),
              ),
            ),
          ),
          if (i != 3) const SizedBox(width: 8),
        ],
      ],
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({required this.step});

  final int step;

  @override
  Widget build(BuildContext context) {
    final (titleA, titleB, subtitle) = switch (step) {
      1 => ('The', 'Base', 'Calibrating your biometrics.'),
      2 => ('The', 'Goal', 'Designing your training matrix.'),
      _ => ('The', 'Plan', 'Fine-tuning volume and frequency.'),
    };
    final headerStyle = AppTextStyles.display(height: 1.05, letterSpacing: -1.2);
    final headerAccentStyle = headerStyle.copyWith(color: AppColors.volt);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text.rich(
          TextSpan(
            children: [
              TextSpan(text: '$titleA '),
              TextSpan(text: titleB, style: headerAccentStyle),
            ],
          ),
          style: headerStyle,
        ),
        const SizedBox(height: 8),
        Text(
          subtitle,
          style: AppTextStyles.body(size: 13, weight: FontWeight.w600, color: AppColors.grey400),
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
    this.textAlign = TextAlign.start,
    this.maxLines = 1,
  });

  final String label;
  final TextEditingController controller;
  final TextInputType keyboardType;
  final bool error;
  final TextAlign textAlign;
  final int maxLines;

  @override
  Widget build(BuildContext context) {
    final border = OutlineInputBorder(
      borderRadius: BorderRadius.circular(18),
      borderSide: BorderSide(color: error ? AppColors.red400 : AppColors.transparent, width: 2),
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 6, bottom: 6),
          child: Text(
            label.toUpperCase(),
            style: AppTextStyles.caps(
              size: 10,
              weight: FontWeight.w800,
              letterSpacing: 2,
              color: AppColors.grey600,
            ),
          ),
        ),
        TextField(
          controller: controller,
          keyboardType: keyboardType,
          textAlign: textAlign,
          maxLines: maxLines,
          style: AppTextStyles.label(size: 14, weight: FontWeight.w800, color: AppColors.white),
          decoration: InputDecoration(
            filled: true,
            fillColor: AppColors.surfaceHighlight,
            suffixIcon: error ? Icon(Icons.error_outline_rounded, color: AppColors.red400) : null,
            border: border,
            enabledBorder: border,
            focusedBorder: border.copyWith(
              borderSide: BorderSide(color: error ? AppColors.red400 : AppColors.volt, width: 2),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
        ),
      ],
    );
  }
}
