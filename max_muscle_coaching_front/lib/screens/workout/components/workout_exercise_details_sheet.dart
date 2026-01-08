part of '../workout_screen.dart';

class _ExerciseDetailsSheet extends StatefulWidget {
  const _ExerciseDetailsSheet({required this.exercise});

  final Exercise exercise;

  static Future<void> show(BuildContext context, Exercise exercise) async {
    await showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.transparent,
      builder: (_) => _ExerciseDetailsSheet(exercise: exercise),
    );
  }

  @override
  State<_ExerciseDetailsSheet> createState() => _ExerciseDetailsSheetState();
}

class _ExerciseDetailsSheetState extends State<_ExerciseDetailsSheet> {
  late final PageController _pageController;
  int _pageIndex = 0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ex = widget.exercise;
    final images = ex.imageUrls.map((e) => e.trim()).where((e) => e.isNotEmpty).toList(growable: false);
    final paddingBottom = MediaQuery.of(context).padding.bottom;

    final tags = <String>[
      if ((ex.force ?? '').trim().isNotEmpty) ex.force!.trim(),
      if ((ex.level ?? '').trim().isNotEmpty) ex.level!.trim(),
      if ((ex.mechanic ?? '').trim().isNotEmpty) ex.mechanic!.trim(),
      if ((ex.equipment ?? '').trim().isNotEmpty) ex.equipment!.trim(),
      if ((ex.exerciseCategory ?? '').trim().isNotEmpty) ex.exerciseCategory!.trim(),
    ];

    return DraggableScrollableSheet(
      initialChildSize: 0.92,
      minChildSize: 0.55,
      maxChildSize: 0.95,
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: AppColors.dark,
            borderRadius: BorderRadius.vertical(top: Radius.circular(26)),
          ),
          child: ListView(
            controller: scrollController,
            padding: EdgeInsets.fromLTRB(16, 10, 16, 24 + paddingBottom),
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(color: AppColors.white.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(999)),
                ),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      ex.name,
                      style: AppTextStyles.title(size: 22, letterSpacing: -0.4),
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.of(context).maybePop(),
                    icon: const Icon(Icons.close_rounded),
                    color: AppColors.grey400,
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                '${ex.sets} Sets • ${ex.reps}${ex.restSeconds == null ? '' : ' • Rest ${ex.restSeconds}s'}',
                style: AppTextStyles.label(weight: FontWeight.w800, color: AppColors.grey500),
              ),
              const SizedBox(height: 14),
              if (images.isNotEmpty) ...[
                Hero(
                  tag: 'preview_exercise_${ex.id}',
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(20),
                    child: AspectRatio(
                      aspectRatio: 16 / 10,
                      child: Stack(
                        children: [
                          if (images.length == 2)
                            GestureDetector(
                              onTap: () => unawaited(
                                ExerciseMotionFullscreenViewer.show(
                                  context,
                                  title: ex.name,
                                  heroTag: 'preview_exercise_${ex.id}',
                                  imageUrls: images,
                                ),
                              ),
                              child: ExerciseMotionThumbnail(
                                imageUrls: images,
                                width: double.infinity,
                                height: double.infinity,
                                borderRadius: BorderRadius.zero,
                                opacity: 1,
                                fadeDuration: const Duration(milliseconds: 520),
                                fit: BoxFit.cover,
                              ),
                            )
                          else
                            PageView.builder(
                              controller: _pageController,
                              itemCount: images.length,
                              onPageChanged: (idx) => setState(() => _pageIndex = idx),
                              itemBuilder: (context, idx) {
                                final url = images[idx];
                                return GestureDetector(
                                  onTap: () => unawaited(
                                    ExerciseMotionFullscreenViewer.show(
                                      context,
                                      title: ex.name,
                                      heroTag: 'preview_exercise_${ex.id}',
                                      imageUrls: images,
                                      initialIndex: idx,
                                    ),
                                  ),
                                  child: Image.network(
                                    url,
                                    fit: BoxFit.cover,
                                    errorBuilder: (_, __, ___) => const SizedBox.shrink(),
                                  ),
                                );
                              },
                            ),
                          Positioned(
                            left: 12,
                            top: 12,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: AppColors.black.withValues(alpha: 0.55),
                                borderRadius: BorderRadius.circular(999),
                                border: Border.all(color: AppColors.white.withValues(alpha: 0.10)),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.zoom_out_map_rounded, size: 16, color: AppColors.white),
                                  const SizedBox(width: 8),
                                  Text(
                                    'TAP TO ZOOM',
                                    style: AppTextStyles.caps(color: AppColors.grey100, letterSpacing: 1.4),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          if (images.length > 1)
                            Positioned(
                              right: 12,
                              top: 12,
                              child: AnimatedSwitcher(
                                duration: const Duration(milliseconds: 180),
                                transitionBuilder: (child, anim) => FadeTransition(opacity: anim, child: child),
                                child: Container(
                                  key: ValueKey(images.length == 2 ? 'motion' : _pageIndex),
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: AppColors.black.withValues(alpha: 0.55),
                                    borderRadius: BorderRadius.circular(999),
                                    border: Border.all(color: AppColors.white.withValues(alpha: 0.10)),
                                  ),
                                  child: Text(
                                    images.length == 2 ? 'MOTION' : '${_pageIndex + 1}/${images.length}',
                                    style: AppTextStyles.caps(color: AppColors.grey100, letterSpacing: 1.2),
                                  ),
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 14),
              ],
              if (tags.isNotEmpty) ...[
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: [
                    for (final t in tags)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceHighlight.withValues(alpha: 0.85),
                          borderRadius: BorderRadius.circular(999),
                          border: Border.all(color: AppColors.white.withValues(alpha: 0.06)),
                        ),
                        child: Text(
                          t.toUpperCase(),
                          style: AppTextStyles.caps(color: AppColors.grey400, letterSpacing: 1.4),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 16),
              ],
              if ((ex.notes ?? '').trim().isNotEmpty) ...[
                Text(
                  'NOTES',
                  style: AppTextStyles.caps(color: AppColors.grey600, letterSpacing: 2.0),
                ),
                const SizedBox(height: 8),
                Text(
                  ex.notes!.trim(),
                  style: AppTextStyles.body(color: AppColors.grey300, weight: FontWeight.w600),
                ),
                const SizedBox(height: 16),
              ],
              if (ex.instructions.isNotEmpty) ...[
                Text(
                  'INSTRUCTIONS',
                  style: AppTextStyles.caps(color: AppColors.grey600, letterSpacing: 2.0),
                ),
                const SizedBox(height: 10),
                for (final line in ex.instructions.take(10)) ...[
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(width: 8, height: 8, child: DecoratedBox(decoration: BoxDecoration(color: AppColors.volt, shape: BoxShape.circle))),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          line,
                          style: AppTextStyles.body(color: AppColors.grey300, weight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                ],
              ],
            ],
          ),
        );
      },
    );
  }
}
