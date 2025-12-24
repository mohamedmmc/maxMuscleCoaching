part of '../workout_screen.dart';

class _TemplateInfoCard extends StatefulWidget {
  const _TemplateInfoCard({
    required this.template,
    required this.dateAssigned,
    required this.workoutHistoryId,
  });

  final WorkoutTemplateInfo template;
  final String? dateAssigned;
  final int? workoutHistoryId;

  @override
  State<_TemplateInfoCard> createState() => _TemplateInfoCardState();
}

class _TemplateInfoCardState extends State<_TemplateInfoCard> with SingleTickerProviderStateMixin {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    final t = widget.template;
    final chips = <String>[
      if ((t.split ?? '').trim().isNotEmpty) t.split!.trim(),
      if ((t.fitnessLevel ?? '').trim().isNotEmpty) t.fitnessLevel!.trim(),
      if ((t.location ?? '').trim().isNotEmpty) t.location!.trim(),
      if (t.estimatedDurationMinutes != null) '${t.estimatedDurationMinutes} min',
    ];

    return AnimatedContainer(
      duration: const Duration(milliseconds: 220),
      curve: Curves.easeOut,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          InkWell(
            borderRadius: BorderRadius.circular(14),
            onTap: () => setState(() => _expanded = !_expanded),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                children: [
                  const Icon(Icons.fitness_center_rounded, size: 18, color: AppColors.volt),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      (t.name ?? 'Workout Template').toUpperCase(),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppTextStyles.label(weight: FontWeight.w900, letterSpacing: 1.1),
                    ),
                  ),
                  const SizedBox(width: 10),
                  AnimatedRotation(
                    turns: _expanded ? 0.5 : 0.0,
                    duration: const Duration(milliseconds: 200),
                    curve: Curves.easeOut,
                    child: Icon(Icons.keyboard_arrow_down_rounded, color: AppColors.grey600),
                  ),
                ],
              ),
            ),
          ),
          if (chips.isNotEmpty) ...[
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final c in chips)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceHighlight.withValues(alpha: 0.8),
                      borderRadius: BorderRadius.circular(999),
                      border: Border.all(color: AppColors.white.withValues(alpha: 0.06)),
                    ),
                    child: Text(
                      c.toUpperCase(),
                      style: AppTextStyles.caps(color: AppColors.grey500, letterSpacing: 1.4),
                    ),
                  ),
              ],
            ),
          ],
          AnimatedCrossFade(
            duration: const Duration(milliseconds: 220),
            crossFadeState: _expanded ? CrossFadeState.showFirst : CrossFadeState.showSecond,
            firstChild: Padding(
              padding: const EdgeInsets.only(top: 14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _InfoLine(label: 'Template ID', value: t.id?.toString() ?? ''),
                  if ((widget.dateAssigned ?? '').trim().isNotEmpty) _InfoLine(label: 'Date Assigned', value: widget.dateAssigned!.trim()),
                  if (widget.workoutHistoryId != null) _InfoLine(label: 'Workout History ID', value: widget.workoutHistoryId.toString()),
                  if ((t.dayOfWeek ?? '').trim().isNotEmpty) _InfoLine(label: 'Day', value: t.dayOfWeek!.trim()),
                  if ((t.focus ?? '').trim().isNotEmpty) _InfoLine(label: 'Focus', value: t.focus!.trim()),
                  if ((t.category ?? '').trim().isNotEmpty) _InfoLine(label: 'Category', value: t.category!.trim()),
                  if ((t.description ?? '').trim().isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text(
                      t.description!.trim(),
                      style: AppTextStyles.body(color: AppColors.grey400, weight: FontWeight.w600),
                    ),
                  ],
                ],
              ),
            ),
            secondChild: const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}

class _InfoLine extends StatelessWidget {
  const _InfoLine({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    if (value.trim().isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 130,
            child: Text(
              label.toUpperCase(),
              style: AppTextStyles.caps(color: AppColors.grey600, letterSpacing: 1.4),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              value,
              style: AppTextStyles.body(color: AppColors.grey300, weight: FontWeight.w700, height: 1.25),
            ),
          ),
        ],
      ),
    );
  }
}
