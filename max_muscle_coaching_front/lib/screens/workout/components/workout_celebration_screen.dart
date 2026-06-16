import 'package:flutter/material.dart';

import 'package:max_muscle_coaching_front/models/dto/workout_api_models.dart';
import 'package:max_muscle_coaching_front/theme/app_colors.dart';
import 'package:max_muscle_coaching_front/theme/app_text_styles.dart';
import 'package:max_muscle_coaching_front/widgets/primary_button.dart';

class WorkoutCelebrationScreen extends StatelessWidget {
  const WorkoutCelebrationScreen({
    required this.workoutName,
    required this.pointsEarned,
    this.streak,
    super.key,
  });

  final String workoutName;
  final int pointsEarned;
  final FinishWorkoutStreak? streak;

  @override
  Widget build(BuildContext context) {
    final s = streak;
    final hadStreakBefore = s != null && s.current > 1;
    final isNewLongest = s != null && s.current > 0 && s.current == s.longest && s.longest > 1;

    return Scaffold(
      backgroundColor: AppColors.dark,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Center(
                child: Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const LinearGradient(
                      colors: [AppColors.volt, AppColors.greenMint],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: const Icon(
                    Icons.check_rounded,
                    color: Colors.black,
                    size: 72,
                  ),
                ),
              ),
              const SizedBox(height: 28),
              Text(
                'You crushed it!',
                textAlign: TextAlign.center,
                style: AppTextStyles.display(size: 34, letterSpacing: -1.4),
              ),
              const SizedBox(height: 6),
              Text(
                workoutName,
                textAlign: TextAlign.center,
                style: AppTextStyles.label(size: 14, color: AppColors.grey600),
              ),
              const SizedBox(height: 32),
              _StatRow(
                icon: Icons.stars_rounded,
                iconColor: AppColors.volt,
                label: 'POINTS EARNED',
                value: '+$pointsEarned',
              ),
              if (s != null) ...[
                const SizedBox(height: 12),
                _StatRow(
                  icon: Icons.local_fire_department_rounded,
                  iconColor: const Color(0xFFFF7A1A),
                  label: hadStreakBefore ? 'STREAK EXTENDED' : 'STREAK STARTED',
                  value: '${s.current} day${s.current == 1 ? '' : 's'}',
                ),
                if (isNewLongest) ...[
                  const SizedBox(height: 12),
                  _StatRow(
                    icon: Icons.emoji_events_rounded,
                    iconColor: AppColors.greenMint,
                    label: 'NEW PERSONAL BEST',
                    value: '${s.longest} day streak',
                  ),
                ],
              ],
              const Spacer(),
              PrimaryButton(
                label: 'Continue',
                onPressed: () => Navigator.of(context).pop(),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatRow extends StatelessWidget {
  const _StatRow({
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final Color iconColor;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: iconColor.withValues(alpha: 0.14),
            ),
            child: Icon(icon, color: iconColor, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Text(
              label,
              style: AppTextStyles.caps(
                color: AppColors.grey600,
                letterSpacing: 1.6,
              ),
            ),
          ),
          Text(
            value,
            style: AppTextStyles.title(size: 20, letterSpacing: -0.4),
          ),
        ],
      ),
    );
  }
}
