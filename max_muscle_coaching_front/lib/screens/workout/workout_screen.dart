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
import 'package:max_muscle_coaching_front/widgets/exercise_motion_fullscreen_viewer.dart';
import 'package:max_muscle_coaching_front/widgets/glass_dock.dart';
import 'package:max_muscle_coaching_front/widgets/primary_button.dart';

import 'workout_controller.dart';

part 'components/workout_preview_view.dart';
part 'components/workout_template_info_card.dart';
part 'components/workout_exercise_details_sheet.dart';

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
          return _LoadingView(
              splitLabel: user.split?.label ?? WorkoutSplit.ppl.label);
        }

        final w = controller.workout;
        if (w == null) {
          if (controller.workoutAlreadyDone) {
            return const _AlreadyDoneView();
          }
          final message =
              controller.emptyStateMessage ?? 'Failed to load workout.';
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
          child: _ActiveWorkoutView(
            workout: w,
            exerciseLogs: controller.exerciseLogs,
            onLogSet: controller.logSet,
            onAddSet: controller.addSet,
            onRemoveSet: controller.removeSet,
            onRemoveSetAt: controller.removeSetAt,
            onExerciseCompleted: controller.onExerciseCompleted,
            onFinish: handleFinish,
            isSaving: controller.finishing,
            restLocked: controller.isRestTimerActive,
          ),
        );
      },
    );
  }
}

class _ActiveWorkoutView extends StatefulWidget {
  const _ActiveWorkoutView({
    required this.workout,
    required this.exerciseLogs,
    required this.onLogSet,
    required this.onAddSet,
    required this.onRemoveSet,
    required this.onRemoveSetAt,
    required this.onExerciseCompleted,
    required this.onFinish,
    required this.isSaving,
    required this.restLocked,
  });

  final DailyWorkout workout;
  final List<ExerciseLog> exerciseLogs;
  final void Function(
      int exerciseIndex, int setIndex, double weight, double reps) onLogSet;
  final void Function(int exerciseIndex) onAddSet;
  final void Function(int exerciseIndex) onRemoveSet;
  final void Function(int exerciseIndex, int setIndex) onRemoveSetAt;
  final void Function(int exerciseIndex) onExerciseCompleted;
  final Future<void> Function() onFinish;
  final bool isSaving;
  final bool restLocked;

  @override
  State<_ActiveWorkoutView> createState() => _ActiveWorkoutViewState();
}

class _ActiveWorkoutViewState extends State<_ActiveWorkoutView> {
  late final ScrollController _scrollController;
  late List<GlobalKey> _exerciseKeys;
  int _expandedIndex = 0;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController();
    _exerciseKeys =
        List.generate(widget.workout.exercises.length, (_) => GlobalKey());
  }

  @override
  void didUpdateWidget(covariant _ActiveWorkoutView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.workout.exercises.length != widget.workout.exercises.length) {
      _exerciseKeys =
          List.generate(widget.workout.exercises.length, (_) => GlobalKey());
      if (_expandedIndex >= widget.workout.exercises.length) {
        _expandedIndex = widget.workout.exercises.isEmpty ? -1 : 0;
      }
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _advanceTo(int currentIndex) {
    final nextIndex = currentIndex + 1;
    if (nextIndex >= widget.workout.exercises.length) {
      setState(() => _expandedIndex = -1);
      return;
    }

    setState(() => _expandedIndex = nextIndex);
  }

  @override
  Widget build(BuildContext context) {
    final w = widget.workout;
    final dockHeight = GlassDock.heightWithinSafeArea(context);
    const restBannerBottomMargin = 16.0;
    const restBannerHeight = 72.0;
    const listExtraBottom = 32.0;
    const listExtraWhenResting =
        restBannerBottomMargin + restBannerHeight + 24.0;
    final listBottomPadding = dockHeight +
        (widget.restLocked ? listExtraWhenResting : listExtraBottom);
    final bannerBottom = dockHeight + restBannerBottomMargin;

    return Column(
      children: [
        _ActiveHeader(
            title: w.focus,
            onFinish: widget.onFinish,
            isSaving: widget.isSaving),
        Expanded(
          child: Stack(
            children: [
              ListView.separated(
                controller: _scrollController,
                padding: EdgeInsets.fromLTRB(16, 14, 16, listBottomPadding),
                cacheExtent: 2400,
                itemCount: w.exercises.length,
                separatorBuilder: (_, __) => const SizedBox(height: 14),
                itemBuilder: (context, idx) {
                  final exercise = w.exercises[idx];
                  final logs = idx < widget.exerciseLogs.length
                      ? widget.exerciseLogs[idx].sets
                      : const <WorkoutSetLog>[];

                  return Container(
                    key: _exerciseKeys[idx],
                    child: ExerciseCard(
                      key: ValueKey(exercise.id),
                      exercise: exercise,
                      logs: logs,
                      editingEnabled: !widget.restLocked,
                      expanded: idx == _expandedIndex,
                      onExpandedChanged: (value) =>
                          setState(() => _expandedIndex = value ? idx : -1),
                      onShowDetails: () =>
                          _ExerciseDetailsSheet.show(context, exercise),
                      onExerciseCompleted: () {
                        widget.onExerciseCompleted(idx);
                        _advanceTo(idx);
                      },
                      onAddSet: () => widget.onAddSet(idx),
                      onRemoveSet: () => widget.onRemoveSet(idx),
                      onRemoveSetAt: (setIndex) =>
                          widget.onRemoveSetAt(idx, setIndex),
                      onLogSet: (setIndex, weight, reps) =>
                          widget.onLogSet(idx, setIndex, weight, reps),
                    ),
                  );
                },
              ),
              Positioned(
                left: 16,
                right: 16,
                bottom: bannerBottom,
                child: GetBuilder<WorkoutController>(
                  id: WorkoutController.restTimerUpdateId,
                  builder: (controller) {
                    final remainingSeconds = controller.restRemainingSeconds;
                    if (remainingSeconds <= 0) return const SizedBox.shrink();

                    return _RestTimerBanner(
                      remainingSeconds: remainingSeconds,
                      onAdd15: () => controller.adjustRestTimerBySeconds(15),
                      onRemove15: () =>
                          controller.adjustRestTimerBySeconds(-15),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _RestTimerBanner extends StatelessWidget {
  const _RestTimerBanner({
    required this.remainingSeconds,
    required this.onRemove15,
    required this.onAdd15,
  });

  final int remainingSeconds;
  final VoidCallback onRemove15;
  final VoidCallback onAdd15;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(22),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.dark.withValues(alpha: 0.86),
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: AppColors.white.withValues(alpha: 0.10)),
            boxShadow: [
              BoxShadow(
                color: AppColors.black.withValues(alpha: 0.35),
                blurRadius: 26,
                offset: const Offset(0, 14),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.volt.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(16),
                  border:
                      Border.all(color: AppColors.volt.withValues(alpha: 0.22)),
                ),
                child: const Icon(Icons.timer_rounded,
                    color: AppColors.volt, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'REST',
                      style: AppTextStyles.caps(
                          weight: FontWeight.w900,
                          letterSpacing: 2.0,
                          color: AppColors.grey500),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      _formatSeconds(remainingSeconds),
                      style: AppTextStyles.title(
                          size: 22,
                          weight: FontWeight.w900,
                          letterSpacing: -0.6),
                    ),
                  ],
                ),
              ),
              _RestTimerAdjustButton(
                icon: Icons.remove_rounded,
                label: '15s',
                onPressed: onRemove15,
              ),
              const SizedBox(width: 10),
              _RestTimerAdjustButton(
                icon: Icons.add_rounded,
                label: '15s',
                onPressed: onAdd15,
              ),
            ],
          ),
        ),
      ),
    );
  }

  static String _formatSeconds(int seconds) {
    final m = (seconds ~/ 60).toString().padLeft(2, '0');
    final s = (seconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }
}

class _RestTimerAdjustButton extends StatelessWidget {
  const _RestTimerAdjustButton({
    required this.icon,
    required this.label,
    required this.onPressed,
  });

  final IconData icon;
  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 44,
      child: FilledButton(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.surfaceHighlight,
          foregroundColor: AppColors.grey100,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          padding: const EdgeInsets.symmetric(horizontal: 12),
        ),
        onPressed: onPressed,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 18),
            const SizedBox(width: 6),
            Text(
              label,
              style: AppTextStyles.label(
                  size: 12, weight: FontWeight.w900, letterSpacing: 0.2),
            ),
          ],
        ),
      ),
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
                style: AppTextStyles.body(
                    color: AppColors.grey500, weight: FontWeight.w600),
              ),
            ],
          ),
        ),
      ),
    );
  }
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
                child: const Icon(Icons.schedule_rounded,
                    color: AppColors.volt, size: 60),
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
                style: AppTextStyles.body(
                    color: AppColors.grey400, weight: FontWeight.w600),
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
                child: const Icon(Icons.verified_rounded,
                    color: AppColors.volt, size: 60),
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
                style: AppTextStyles.body(
                    color: AppColors.grey400, weight: FontWeight.w600),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ActiveHeader extends StatelessWidget {
  const _ActiveHeader(
      {required this.title, required this.onFinish, required this.isSaving});

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
            border: Border(
                bottom:
                    BorderSide(color: AppColors.white.withValues(alpha: 0.05))),
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
                            decoration: BoxDecoration(
                                color: AppColors.volt, shape: BoxShape.circle),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'SESSION ACTIVE',
                          style: AppTextStyles.caps(
                              color: AppColors.volt.withValues(alpha: 0.95),
                              letterSpacing: 2.0),
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
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(999)),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                ),
                onPressed: isSaving ? null : () => unawaited(onFinish()),
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 160),
                  transitionBuilder: (child, anim) =>
                      FadeTransition(opacity: anim, child: child),
                  child: isSaving
                      ? Row(
                          key: const ValueKey('saving'),
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const SizedBox(
                              width: 14,
                              height: 14,
                              child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  valueColor: AlwaysStoppedAnimation(
                                      AppColors.white70)),
                            ),
                            const SizedBox(width: 10),
                            Text(
                              'SAVING',
                              style: AppTextStyles.label(
                                  size: 12,
                                  weight: FontWeight.w900,
                                  letterSpacing: 1.6),
                            ),
                          ],
                        )
                      : Text(
                          key: ValueKey('end'),
                          'END RUN',
                          style: AppTextStyles.label(
                              size: 12,
                              weight: FontWeight.w900,
                              letterSpacing: 1.6),
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
