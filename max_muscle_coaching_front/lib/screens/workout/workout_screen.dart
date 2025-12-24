import 'dart:async';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:max_muscle_coaching_front/controllers/app_controller.dart';
import 'package:max_muscle_coaching_front/models/models.dart';
import 'package:max_muscle_coaching_front/theme/app_colors.dart';
import 'package:max_muscle_coaching_front/theme/app_text_styles.dart';
import 'package:max_muscle_coaching_front/services/snackbar_service.dart';
import 'package:max_muscle_coaching_front/widgets/exercise_card.dart';
import 'package:max_muscle_coaching_front/widgets/exercise_motion_thumbnail.dart';
import 'package:max_muscle_coaching_front/widgets/primary_button.dart';

import 'workout_controller.dart';

part 'components/workout_preview_view.dart';
part 'components/workout_template_info_card.dart';
part 'components/workout_exercise_details_sheet.dart';
part 'components/workout_full_screen_gallery.dart';

class WorkoutScreen extends StatelessWidget {
  const WorkoutScreen({required this.onWorkoutFinished, super.key});

  final VoidCallback onWorkoutFinished;

  @override
  Widget build(BuildContext context) {
    return GetBuilder<WorkoutController>(
      init: WorkoutController(),
      builder: (controller) {
        final user = AppController.find.user;
        if (user == null) return const SizedBox.shrink();

        if (controller.loading) {
          return _LoadingView(splitLabel: _splitLabel(user.split));
        }

        final w = controller.workout;
        if (w == null) {
          if (controller.workoutAlreadyDone) {
            return const _AlreadyDoneView();
          }
          final message = controller.emptyStateMessage ?? 'Failed to load workout.';
          return SafeArea(child: Center(child: Text(message)));
        }

        if (w.isRestDay && !controller.active) {
          return const _RestDayView();
        }

        if (!controller.active) {
          return _PreviewView(workout: w, onStart: controller.start);
        }

        Future<void> handleFinish() async {
          final ok = await controller.finish();
          if (!ok) {
            SnackbarService.showError(
              title: 'Could not finish workout',
              message: controller.finishErrorMessage ?? 'Please try again.',
            );
            return;
          }
          onWorkoutFinished();
        }

        return SafeArea(
          child: Column(
            children: [
              _ActiveHeader(title: w.focus, onFinish: handleFinish, isSaving: controller.finishing),
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.fromLTRB(16, 14, 16, 120),
                  itemCount: w.exercises.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 14),
                  itemBuilder: (context, idx) {
                    final exercise = w.exercises[idx];
                    final logs = idx < controller.exerciseLogs.length ? controller.exerciseLogs[idx].sets : const <WorkoutSetLog>[];
                    return ExerciseCard(
                      exercise: exercise,
                      logs: logs,
                      onLogSet: (setIndex, weight, reps) => controller.logSet(idx, setIndex, weight, reps),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _LoadingView extends StatelessWidget {
  const _LoadingView({required this.splitLabel});

  final String splitLabel;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                width: 64,
                height: 64,
                child: Stack(
                  children: const [
                    Positioned.fill(
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation(AppColors.volt),
                        strokeWidth: 4,
                        backgroundColor: AppColors.surfaceHighlight,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              Text(
                'BUILDING PLAN',
                style: AppTextStyles.title(size: 22, letterSpacing: 1.2),
              ),
              const SizedBox(height: 8),
              Text(
                'Optimizing for $splitLabel...',
                style: AppTextStyles.body(color: AppColors.grey500, weight: FontWeight.w600),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

String _splitLabel(String? raw) {
  if (raw == null) return WorkoutSplit.ppl.label;
  for (final split in WorkoutSplit.values) {
    if (split.name == raw) return split.label;
  }
  return raw;
}

class _RestDayView extends StatelessWidget {
  const _RestDayView();

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(26),
                decoration: BoxDecoration(
                  color: AppColors.surfaceHighlight,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.volt.withValues(alpha: 0.16),
                      blurRadius: 40,
                      spreadRadius: 8,
                    ),
                  ],
                ),
                child: const Icon(Icons.schedule_rounded, color: AppColors.volt, size: 60),
              ),
              const SizedBox(height: 18),
              Text(
                'RECOVERY MODE',
                style: AppTextStyles.display(size: 30, letterSpacing: -1.2),
              ),
              const SizedBox(height: 10),
              Text(
                'Muscles grow during rest. Hit your macros and sleep well.',
                textAlign: TextAlign.center,
                style: AppTextStyles.body(color: AppColors.grey400, weight: FontWeight.w600),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _AlreadyDoneView extends StatelessWidget {
  const _AlreadyDoneView();

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(26),
                decoration: BoxDecoration(
                  color: AppColors.surfaceHighlight,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.volt.withValues(alpha: 0.18),
                      blurRadius: 44,
                      spreadRadius: 10,
                    ),
                  ],
                ),
                child: const Icon(Icons.verified_rounded, color: AppColors.volt, size: 60),
              ),
              const SizedBox(height: 18),
              Text(
                'WORKOUT DONE',
                style: AppTextStyles.display(size: 30, letterSpacing: -1.2),
              ),
              const SizedBox(height: 10),
              Text(
                'Today’s session is already completed. Come back tomorrow for your next plan.',
                textAlign: TextAlign.center,
                style: AppTextStyles.body(color: AppColors.grey400, weight: FontWeight.w600),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ActiveHeader extends StatelessWidget {
  const _ActiveHeader({required this.title, required this.onFinish, required this.isSaving});

  final String title;
  final Future<void> Function() onFinish;
  final bool isSaving;

  @override
  Widget build(BuildContext context) {
    return ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Container(
          padding: const EdgeInsets.fromLTRB(16, 14, 16, 14),
          decoration: BoxDecoration(
            color: AppColors.dark.withValues(alpha: 0.82),
            border: Border(bottom: BorderSide(color: AppColors.white.withValues(alpha: 0.05))),
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title.toUpperCase(),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppTextStyles.title(size: 16, letterSpacing: -0.4),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const SizedBox(
                          width: 6,
                          height: 6,
                          child: DecoratedBox(
                            decoration: BoxDecoration(color: AppColors.volt, shape: BoxShape.circle),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'SESSION ACTIVE',
                          style: AppTextStyles.caps(color: AppColors.volt.withValues(alpha: 0.95), letterSpacing: 2.0),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              FilledButton(
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.red900.withValues(alpha: 0.20),
                  foregroundColor: AppColors.red300,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                ),
                onPressed: isSaving ? null : () => unawaited(onFinish()),
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 160),
                  transitionBuilder: (child, anim) => FadeTransition(opacity: anim, child: child),
                  child: isSaving
                      ? Row(
                          key: const ValueKey('saving'),
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const SizedBox(
                              width: 14,
                              height: 14,
                              child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation(AppColors.white70)),
                            ),
                            const SizedBox(width: 10),
                            Text(
                              'SAVING',
                              style: AppTextStyles.label(size: 12, weight: FontWeight.w900, letterSpacing: 1.6),
                            ),
                          ],
                        )
                      : Text(
                          key: ValueKey('end'),
                          'END RUN',
                          style: AppTextStyles.label(size: 12, weight: FontWeight.w900, letterSpacing: 1.6),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
