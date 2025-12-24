part of '../workout_screen.dart';

class _PreviewView extends StatelessWidget {
  const _PreviewView({required this.workout, required this.onStart});

  final DailyWorkout workout;
  final VoidCallback onStart;

  @override
  Widget build(BuildContext context) {
    final template = workout.template;

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 18, 20, 120),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(color: AppColors.volt, borderRadius: BorderRadius.circular(999)),
                  child: Text(
                    'TODAY',
                    style: AppTextStyles.caps(color: AppColors.black),
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  workout.dayOfWeek.toUpperCase(),
                  style: AppTextStyles.caps(color: AppColors.grey600, letterSpacing: 2.4),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              workout.focus.toUpperCase(),
              style: AppTextStyles.display(size: 34, letterSpacing: -1.2),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Row(
                  children: [
                    const Icon(Icons.local_fire_department_rounded, color: AppColors.volt, size: 18),
                    const SizedBox(width: 6),
                    Text('High Intensity', style: AppTextStyles.label(weight: FontWeight.w700, color: AppColors.grey)),
                  ],
                ),
                const SizedBox(width: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(color: AppColors.grey800),
                  ),
                  child: Text(
                    workout.category,
                    style: AppTextStyles.label(size: 12, weight: FontWeight.w800),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),
            if (template != null) ...[
              _TemplateInfoCard(
                template: template,
                dateAssigned: workout.dateAssigned,
                workoutHistoryId: workout.workoutHistoryId,
              ),
              const SizedBox(height: 18),
            ],
            for (final ex in workout.exercises) ...[
              _PreviewExerciseRow(exercise: ex),
              const SizedBox(height: 10),
            ],
            PrimaryButton(
              label: 'Initialize',
              trailing: const Icon(Icons.play_arrow_rounded, color: AppColors.black, size: 26),
              onPressed: onStart,
            ),
          ],
        ),
      ),
    );
  }
}

class _PreviewExerciseRow extends StatelessWidget {
  const _PreviewExerciseRow({required this.exercise});

  final Exercise exercise;

  @override
  Widget build(BuildContext context) {
    final metaParts = <String>[
      if ((exercise.equipment ?? '').trim().isNotEmpty) exercise.equipment!.trim(),
      if ((exercise.level ?? '').trim().isNotEmpty) exercise.level!.trim(),
      if ((exercise.mechanic ?? '').trim().isNotEmpty) exercise.mechanic!.trim(),
    ];
    final meta = metaParts.join(' • ');

    final rest = (exercise.restSeconds != null && exercise.restSeconds! > 0) ? '${exercise.restSeconds}s rest' : '';

    return _AnimatedPressable(
      onTap: () => _ExerciseDetailsSheet.show(context, exercise),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Hero(
              tag: 'preview_exercise_${exercise.id}',
              child: ExerciseMotionThumbnail(
                imageUrls: exercise.imageUrls,
                width: 72,
                height: 72,
                borderRadius: BorderRadius.circular(12),
                opacity: 0.82,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          exercise.name,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: AppTextStyles.title(
                            size: 18,
                            weight: FontWeight.w800,
                            fontStyle: FontStyle.normal,
                            height: 1.1,
                            letterSpacing: -0.2,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Icon(Icons.chevron_right_rounded, color: AppColors.grey600),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '${exercise.sets} Sets × ${exercise.reps}'.toUpperCase(),
                    style: AppTextStyles.label(size: 11, weight: FontWeight.w900, letterSpacing: 1.4, color: AppColors.volt),
                  ),
                  if (meta.isNotEmpty || rest.isNotEmpty) ...[
                    const SizedBox(height: 6),
                    Text(
                      [meta, rest].where((e) => e.trim().isNotEmpty).join('  •  '),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppTextStyles.body(size: 12, color: AppColors.grey500, weight: FontWeight.w700, height: 1.2),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _AnimatedPressable extends StatefulWidget {
  const _AnimatedPressable({required this.onTap, required this.child});

  final VoidCallback onTap;
  final Widget child;

  @override
  State<_AnimatedPressable> createState() => _AnimatedPressableState();
}

class _AnimatedPressableState extends State<_AnimatedPressable> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    return AnimatedScale(
      scale: _pressed ? 0.985 : 1,
      duration: const Duration(milliseconds: 120),
      curve: Curves.easeOut,
      child: GestureDetector(
        onTapDown: (_) => setState(() => _pressed = true),
        onTapCancel: () => setState(() => _pressed = false),
        onTapUp: (_) => setState(() => _pressed = false),
        onTap: widget.onTap,
        child: widget.child,
      ),
    );
  }
}
