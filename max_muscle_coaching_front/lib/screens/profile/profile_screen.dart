import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:max_muscle_coaching_front/controllers/app_controller.dart';
import 'package:max_muscle_coaching_front/models/user_profile.dart';
import 'package:max_muscle_coaching_front/theme/app_colors.dart';
import 'package:max_muscle_coaching_front/theme/app_text_styles.dart';
import 'package:max_muscle_coaching_front/widgets/glass_dock.dart';

import 'profile_controller.dart';
import 'components/profile_shimmer.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return GetBuilder<ProfileController>(
      init: ProfileController(),
      builder: (profileController) {
        return GetBuilder<AppController>(
          builder: (app) {
            final user = app.user;
            if (user == null) return const SizedBox.shrink();

            final displayName = (user.name ?? '').trim();
            final email = (user.email ?? '').trim();
            final headerStyle = AppTextStyles.display(letterSpacing: -1.4);
            final headerAccentStyle = headerStyle.copyWith(color: AppColors.volt);

            return SafeArea(
              child: SingleChildScrollView(
                padding: EdgeInsets.fromLTRB(20, 18, 20, GlassDock.heightWithinSafeArea(context) + 32),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text.rich(
                      TextSpan(
                        children: [
                          const TextSpan(text: 'Athlete\n'),
                          TextSpan(text: 'Profile', style: headerAccentStyle),
                        ],
                      ),
                      style: headerStyle,
                    ),
                    const SizedBox(height: 18),
                    if (profileController.isLoading) ...[
                      const ProfileShimmer(),
                    ] else ...[
                      Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(28),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Stack(
                          children: [
                            Positioned(
                              top: -6,
                              right: -6,
                              child: Icon(
                                Icons.person_rounded,
                                size: 120,
                                color: AppColors.white.withValues(alpha: 0.08),
                              ),
                            ),
                            Column(
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      width: 78,
                                      height: 78,
                                      decoration: const BoxDecoration(
                                        gradient: LinearGradient(colors: [
                                          AppColors.volt,
                                          AppColors.greenMint
                                        ]),
                                        shape: BoxShape.circle,
                                      ),
                                      padding: const EdgeInsets.all(2),
                                      child: Container(
                                        decoration: const BoxDecoration(
                                            color: AppColors.surface,
                                            shape: BoxShape.circle),
                                        child: Center(
                                          child: Text(
                                            displayName.isNotEmpty ? displayName.characters.first : '?',
                                            style: AppTextStyles.title(
                                              size: 30,
                                              weight: FontWeight.w900,
                                              fontStyle: FontStyle.normal,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            displayName.isEmpty ? 'Athlete' : displayName,
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: AppTextStyles.title(
                                              size: 22,
                                              weight: FontWeight.w900,
                                              fontStyle: FontStyle.normal,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            email.isEmpty ? '—' : email,
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: AppTextStyles.body(
                                              size: 14,
                                              weight: FontWeight.w600,
                                              color: AppColors.grey600,
                                            ),
                                          ),
                                          const SizedBox(height: 10),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 10, vertical: 6),
                                            decoration: BoxDecoration(
                                              color: AppColors.volt
                                                  .withValues(alpha: 0.10),
                                              borderRadius:
                                                  BorderRadius.circular(10),
                                            ),
                                            child: Text(
                                              _fitnessLabel(user.fitnessLevel).toUpperCase(),
                                              style: AppTextStyles.caps(
                                                size: 10,
                                                weight: FontWeight.w900,
                                                letterSpacing: 1.8,
                                                color: AppColors.volt,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                Row(
                                  children: [
                                    Expanded(
                                      child: _MiniStat(
                                        label: 'WEIGHT',
                                        value:
                                            user.weight == null ? '—' : '${user.weight!.toStringAsFixed(0)} kg',
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: _MiniStat(
                                        label: 'SPLIT',
                                        value: _splitLabel(user.split),
                                        valueStyle: AppTextStyles.title(
                                          size: 14,
                                          weight: FontWeight.w900,
                                          fontStyle: FontStyle.normal,
                                          height: 1.2,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 14),
                      FilledButton(
                        style: FilledButton.styleFrom(
                          backgroundColor: AppColors.surfaceHighlight,
                          foregroundColor: AppColors.red300,
                          minimumSize: const Size.fromHeight(56),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(18)),
                          side: BorderSide(color: AppColors.border),
                          textStyle: AppTextStyles.caps(
                            size: 12,
                            weight: FontWeight.w900,
                            letterSpacing: 2.4,
                            color: AppColors.red300,
                          ),
                        ),
                        onPressed: () => unawaited(profileController.logout()),
                        child: const Text('LOG OUT'),
                      ),
                    ],
                    const SizedBox(height: 26),
                    Opacity(
                      opacity: 0.35,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.bolt_rounded, size: 16),
                          const SizedBox(width: 8),
                          Text(
                            'MAX MUSCLE OS v2.0',
                            style: AppTextStyles.caps(
                              size: 11,
                              weight: FontWeight.w900,
                              letterSpacing: 2.0,
                              color: AppColors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}

class _MiniStat extends StatelessWidget {
  const _MiniStat({required this.label, required this.value, this.valueStyle});

  final String label;
  final String value;
  final TextStyle? valueStyle;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.black.withValues(alpha: 0.25),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: AppTextStyles.caps(
              size: 10,
              weight: FontWeight.w900,
              letterSpacing: 2,
              color: AppColors.grey600,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: valueStyle ??
                AppTextStyles.title(
                  size: 22,
                  weight: FontWeight.w900,
                  fontStyle: FontStyle.normal,
                  letterSpacing: -0.6,
                ),
          ),
        ],
      ),
    );
  }
}

String _fitnessLabel(String? raw) {
  if (raw == null) return FitnessLevel.beginner.label;
  for (final level in FitnessLevel.values) {
    if (level.name == raw) return level.label;
  }
  return raw;
}

String _splitLabel(String? raw) {
  if (raw == null) return WorkoutSplit.ppl.label;
  for (final split in WorkoutSplit.values) {
    if (split.name == raw) return split.label;
  }
  return raw;
}
