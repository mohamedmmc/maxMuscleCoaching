import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

import '../models/models.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import 'exercise_motion_thumbnail.dart';
import 'exercise_motion_fullscreen_viewer.dart';

class ExerciseCard extends StatefulWidget {
  const ExerciseCard({
    required this.exercise,
    required this.logs,
    required this.onLogSet,
    required this.expanded,
    required this.onExpandedChanged,
    this.onShowDetails,
    this.onExerciseCompleted,
    this.onAddSet,
    this.onRemoveSet,
    super.key,
  });

  final Exercise exercise;
  final List<WorkoutSetLog> logs;
  final void Function(int setIndex, double weight, double reps) onLogSet;
  final bool expanded;
  final ValueChanged<bool> onExpandedChanged;
  final VoidCallback? onShowDetails;
  final VoidCallback? onExerciseCompleted;
  final VoidCallback? onAddSet;
  final VoidCallback? onRemoveSet;

  @override
  State<ExerciseCard> createState() => _ExerciseCardState();
}

class _ExerciseCardState extends State<ExerciseCard> {
  late final List<TextEditingController> _weightControllers;
  late final List<TextEditingController> _repsControllers;
  bool _bulkUpdating = false;
  final GlobalKey _firstSetKey = GlobalKey();
  Timer? _scrollToFirstSetTimer;

  @override
  void initState() {
    super.initState();
    _weightControllers =
        List.generate(widget.exercise.sets, (_) => TextEditingController());
    _repsControllers =
        List.generate(widget.exercise.sets, (_) => TextEditingController());
    _seedDefaultValues();
    _applyLogsToControllers(widget.logs);
    _bindBulkSync();

    if (widget.expanded) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToFirstSet());
    }
  }

  @override
  void didUpdateWidget(covariant ExerciseCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.exercise.sets != widget.exercise.sets) {
      _syncControllersWithSets();
    }
    if (oldWidget.logs != widget.logs) {
      _applyLogsToControllers(widget.logs);
    }
    if (!oldWidget.expanded && widget.expanded) {
      _scrollToFirstSet();
    }
  }

  @override
  void dispose() {
    _scrollToFirstSetTimer?.cancel();
    for (final c in _weightControllers) {
      c.dispose();
    }
    for (final c in _repsControllers) {
      c.dispose();
    }
    super.dispose();
  }

  bool _isCompleted(int setIndex) {
    return widget.logs.any((l) => l.setNumber == setIndex + 1 && l.completed);
  }

  int _completedSets() => widget.logs.where((l) => l.completed).length;

  void _seedDefaultValues() {
    final defaultReps = _suggestedLowerReps(widget.exercise.reps);
    _bulkUpdating = true;
    for (final c in _repsControllers) {
      c.text = defaultReps;
    }
    _bulkUpdating = false;
  }

  void _applyLogsToControllers(List<WorkoutSetLog> logs) {
    _bulkUpdating = true;
    for (final log in logs) {
      if (!log.completed) continue;
      final index = log.setNumber - 1;
      if (index < 0 || index >= widget.exercise.sets) continue;
      _weightControllers[index].text = _formatNum(log.weight);
      _repsControllers[index].text = _formatNum(log.reps);
    }

    final last = logs.where((l) => l.completed).toList()
      ..sort((a, b) => a.setNumber.compareTo(b.setNumber));
    if (last.isNotEmpty) {
      final lastWeight = _formatNum(last.last.weight);
      final lastReps = _formatNum(last.last.reps);
      for (var i = 0; i < widget.exercise.sets; i++) {
        if (_isCompleted(i)) continue;
        _weightControllers[i].text = lastWeight;
        _repsControllers[i].text = lastReps;
      }
    }

    _bulkUpdating = false;
  }

  static String _formatNum(double value) {
    if (value % 1 == 0) return value.toInt().toString();
    return value.toString();
  }

  void _bindBulkSync() {
    for (var i = 0; i < _weightControllers.length; i++) {
      _bindBulkSyncForIndex(i);
    }
  }

  void _bindBulkSyncForIndex(int idx) {
    _weightControllers[idx].addListener(() {
      if (_bulkUpdating) return;
      if (_isCompleted(idx)) return;
      _syncAcrossSets(sourceIndex: idx, source: _weightControllers, target: _weightControllers);
    });
    _repsControllers[idx].addListener(() {
      if (_bulkUpdating) return;
      if (_isCompleted(idx)) return;
      _syncAcrossSets(sourceIndex: idx, source: _repsControllers, target: _repsControllers);
    });
  }

  void _syncAcrossSets({
    required int sourceIndex,
    required List<TextEditingController> source,
    required List<TextEditingController> target,
  }) {
    final value = source[sourceIndex].text;
    _bulkUpdating = true;
    for (var i = 0; i < target.length; i++) {
      if (i == sourceIndex) continue;
      if (_isCompleted(i)) continue;
      if (target[i].text == value) continue;
      target[i].text = value;
    }
    _bulkUpdating = false;
  }

  void _syncControllersWithSets() {
    final desiredSets = widget.exercise.sets;
    final currentSets = _weightControllers.length;
    if (desiredSets == currentSets) return;

    if (desiredSets > currentSets) {
      final defaultReps = _suggestedLowerReps(widget.exercise.reps);
      for (var i = currentSets; i < desiredSets; i++) {
        _weightControllers.add(TextEditingController());
        _repsControllers.add(TextEditingController(text: defaultReps));
        _bindBulkSyncForIndex(i);
      }
    } else {
      for (var i = currentSets - 1; i >= desiredSets; i--) {
        final w = _weightControllers.removeLast();
        final r = _repsControllers.removeLast();
        w.dispose();
        r.dispose();
      }
    }

    _applyLogsToControllers(widget.logs);
  }

  void _handleComplete(int setIndex) {
    if (_isCompleted(setIndex)) return;

    final weightText = _weightControllers[setIndex].text.trim();
    final repsText = _repsControllers[setIndex].text.trim();
    final weight = double.tryParse(weightText);
    final reps = double.tryParse(repsText);
    if (weight == null || reps == null) return;

    final willCompleteExercise = widget.exercise.sets > 0 && (_completedSets() + 1) >= widget.exercise.sets;
    widget.onLogSet(setIndex, weight, reps);
    if (willCompleteExercise) {
      widget.onExerciseCompleted?.call();
    }
  }

  void _handleAddSet() {
    widget.onAddSet?.call();
  }

  void _handleRemoveSet() {
    final nextSets = widget.exercise.sets - 1;
    if (nextSets < 1) return;
    final completedAfterTrim = widget.logs.where((l) => l.completed && l.setNumber <= nextSets).length >= nextSets;
    widget.onRemoveSet?.call();
    if (completedAfterTrim) widget.onExerciseCompleted?.call();
  }

  void _scrollToFirstSet() {
    _scrollToFirstSetTimer?.cancel();
    _scrollToFirstSetTimer = Timer(const Duration(milliseconds: 220), () {
      if (!mounted || !widget.expanded) return;
      final ctx = _firstSetKey.currentContext;
      if (ctx == null) return;
      _animateRevealClamped(ctx, alignment: 0.42);
    });
  }

  void _animateRevealClamped(BuildContext targetContext, {required double alignment}) {
    final renderObject = targetContext.findRenderObject();
    if (renderObject == null) return;
    final viewport = RenderAbstractViewport.of(renderObject);

    final position = Scrollable.of(targetContext).position;
    final targetOffset = viewport.getOffsetToReveal(renderObject, alignment).offset;
    final clamped = targetOffset.clamp(position.minScrollExtent, position.maxScrollExtent).toDouble();
    if ((position.pixels - clamped).abs() < 0.5) return;

    unawaited(
      position.animateTo(
        clamped,
        duration: const Duration(milliseconds: 320),
        curve: Curves.easeOutCubic,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final completedSets = _completedSets();
    final progress =
        widget.exercise.sets == 0 ? 0.0 : completedSets / widget.exercise.sets;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      curve: Curves.easeOut,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: widget.expanded ? AppColors.grey900 : AppColors.transparent,
        ),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          InkWell(
            onTap: () => widget.onExpandedChanged(!widget.expanded),
            child: Stack(
              children: [
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Stack(
                        children: [
                          ExerciseMotionThumbnail(
                            imageUrls: widget.exercise.imageUrls,
                            width: 96,
                            height: 96,
                            borderRadius: BorderRadius.circular(14),
                            opacity: 0.9,
                          ),
                          if (widget.onShowDetails != null)
                            Positioned(
                              top: 6,
                              right: 6,
                              child: Material(
                                color: AppColors.black.withValues(alpha: 0.45),
                                shape: const CircleBorder(),
                                child: InkWell(
                                  onTap: widget.onShowDetails,
                                  customBorder: const CircleBorder(),
                                  child: Padding(
                                    padding: const EdgeInsets.all(6),
                                    child: Icon(
                                      Icons.info_outline_rounded,
                                      size: 18,
                                      color: AppColors.volt.withValues(alpha: 0.95),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.exercise.name.toUpperCase(),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: AppTextStyles.title(size: 18),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              widget.exercise.targetMuscle.toUpperCase(),
                              style: AppTextStyles.label(
                                size: 11,
                                weight: FontWeight.w800,
                                letterSpacing: 1.2,
                                color: AppColors.grey600,
                              ),
                            ),
                          ],
                        ),
                      ),
                      DecoratedBox(
                        decoration: BoxDecoration(
                          color: AppColors.surfaceHighlight,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(6),
                        child: Icon(
                          widget.expanded
                              ? Icons.keyboard_arrow_up_rounded
                              : Icons.keyboard_arrow_down_rounded,
                          color: AppColors.grey500,
                        ),
                      ),
                    ),
                    ],
                  ),
                ),
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: 0,
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: FractionallySizedBox(
                      widthFactor: progress.clamp(0, 1),
                      child: const SizedBox(
                          height: 4, child: ColoredBox(color: AppColors.volt)),
                    ),
                  ),
                ),
              ],
            ),
          ),
          AnimatedCrossFade(
            duration: const Duration(milliseconds: 200),
            crossFadeState:
                widget.expanded ? CrossFadeState.showFirst : CrossFadeState.showSecond,
            firstChild: Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Column(
                children: [
                  const SizedBox(height: 8),
                  _ExerciseMotionBanner(exercise: widget.exercise, onInfo: widget.onShowDetails),
                  const SizedBox(height: 16),
                  if (widget.onAddSet != null || widget.onRemoveSet != null) ...[
                    Row(
                      children: [
                        Text(
                          'SETS',
                          style: AppTextStyles.caps(weight: FontWeight.w800, letterSpacing: 1.8, color: AppColors.grey700),
                        ),
                        const Spacer(),
                        _MiniIconButton(
                          icon: Icons.remove_rounded,
                          onPressed: (widget.onRemoveSet != null && widget.exercise.sets > 1) ? _handleRemoveSet : null,
                        ),
                        const SizedBox(width: 10),
                        Text(
                          '${widget.exercise.sets}',
                          style: AppTextStyles.label(weight: FontWeight.w900, color: AppColors.grey100),
                        ),
                        const SizedBox(width: 10),
                        _MiniIconButton(
                          icon: Icons.add_rounded,
                          onPressed: widget.onAddSet != null ? _handleAddSet : null,
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                  ],
                  _SetsHeader(),
                  const SizedBox(height: 10),
                  for (var i = 0; i < widget.exercise.sets; i++) ...[
                    if (i == 0)
                      Container(
                        key: _firstSetKey,
                        child: _SetRow(
                          setNumber: i + 1,
                          completed: _isCompleted(i),
                          weightController: _weightControllers[i],
                          repsController: _repsControllers[i],
                          suggestedReps: _suggestedLowerReps(widget.exercise.reps),
                          onComplete: () => _handleComplete(i),
                        ),
                      )
                    else
                      _SetRow(
                        setNumber: i + 1,
                        completed: _isCompleted(i),
                        weightController: _weightControllers[i],
                        repsController: _repsControllers[i],
                        suggestedReps: _suggestedLowerReps(widget.exercise.reps),
                        onComplete: () => _handleComplete(i),
                      ),
                    if (i != widget.exercise.sets - 1)
                      const SizedBox(height: 10),
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

  static String _suggestedLowerReps(String reps) {
    final parts = reps.split('-');
    return parts.isNotEmpty ? parts.first : reps;
  }
}

class _ExerciseMotionBanner extends StatelessWidget {
  const _ExerciseMotionBanner({required this.exercise, this.onInfo});

  final Exercise exercise;
  final VoidCallback? onInfo;

  @override
  Widget build(BuildContext context) {
    final urls = exercise.imageUrls.map((e) => e.trim()).where((e) => e.isNotEmpty).take(2).toList(growable: false);
    if (urls.isEmpty) return const SizedBox.shrink();

    final heroTag = 'active_exercise_media_${exercise.id}';

    return Hero(
      tag: heroTag,
      child: Material(
        color: AppColors.transparent,
        child: InkWell(
          onTap: () => unawaited(
            ExerciseMotionFullscreenViewer.show(
              context,
              title: exercise.name,
              heroTag: heroTag,
              imageUrls: urls,
            ),
          ),
          borderRadius: BorderRadius.circular(20),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: AspectRatio(
              aspectRatio: 16 / 10,
              child: Stack(
                children: [
                  Positioned.fill(
                    child: ExerciseMotionThumbnail(
                      imageUrls: urls,
                      width: double.infinity,
                      height: double.infinity,
                      borderRadius: BorderRadius.zero,
                      opacity: 1,
                      interval: const Duration(milliseconds: 1300),
                      fadeDuration: const Duration(milliseconds: 520),
                      fit: BoxFit.cover,
                    ),
                  ),
                  Positioned.fill(
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            AppColors.black.withValues(alpha: 0.55),
                            AppColors.transparent,
                          ],
                          begin: Alignment.bottomCenter,
                          end: Alignment.center,
                        ),
                      ),
                    ),
                  ),
                  if (onInfo != null)
                    Positioned(
                      right: 12,
                      top: 12,
                      child: Material(
                        color: AppColors.black.withValues(alpha: 0.45),
                        shape: const CircleBorder(),
                        child: InkWell(
                          onTap: onInfo,
                          customBorder: const CircleBorder(),
                          child: Padding(
                            padding: const EdgeInsets.all(6),
                            child: Icon(
                              Icons.info_outline_rounded,
                              size: 18,
                              color: AppColors.volt.withValues(alpha: 0.95),
                            ),
                          ),
                        ),
                      ),
                    ),
                  Positioned(
                    left: 14,
                    right: 14,
                    bottom: 12,
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppColors.black.withValues(alpha: 0.45),
                            borderRadius: BorderRadius.circular(999),
                            border: Border.all(color: AppColors.white.withValues(alpha: 0.12)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.zoom_out_map_rounded, size: 16, color: AppColors.volt),
                              const SizedBox(width: 8),
                              Text(
                                urls.length > 1 ? 'MOTION • TAP TO EXPAND' : 'TAP TO EXPAND',
                                style: AppTextStyles.caps(color: AppColors.grey100, letterSpacing: 1.4),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _SetsHeader extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final style = AppTextStyles.caps(weight: FontWeight.w800, letterSpacing: 1.8, color: AppColors.grey700);
    return Row(
      children: [
        SizedBox(width: 40, child: Center(child: Text('SET', style: style))),
        Expanded(child: Center(child: Text('KG', style: style))),
        Expanded(child: Center(child: Text('REPS', style: style))),
        const SizedBox(width: 46),
      ],
    );
  }
}

class _MiniIconButton extends StatelessWidget {
  const _MiniIconButton({required this.icon, required this.onPressed});

  final IconData icon;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 40,
      height: 40,
      child: FilledButton(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.surfaceHighlight,
          disabledBackgroundColor: AppColors.surfaceHighlight.withValues(alpha: 0.65),
          foregroundColor: AppColors.grey300,
          disabledForegroundColor: AppColors.grey700,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          padding: EdgeInsets.zero,
        ),
        onPressed: onPressed,
        child: Icon(icon, size: 22),
      ),
    );
  }
}

class _SetRow extends StatelessWidget {
  const _SetRow({
    required this.setNumber,
    required this.completed,
    required this.weightController,
    required this.repsController,
    required this.suggestedReps,
    required this.onComplete,
  });

  final int setNumber;
  final bool completed;
  final TextEditingController weightController;
  final TextEditingController repsController;
  final String suggestedReps;
  final VoidCallback onComplete;

  @override
  Widget build(BuildContext context) {
    final inputStyle = AppTextStyles.label(size: 16, weight: FontWeight.w800, color: AppColors.white);

    return AnimatedContainer(
      duration: const Duration(milliseconds: 220),
      curve: Curves.easeOut,
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: completed ? AppColors.volt.withValues(alpha: 0.10) : AppColors.transparent,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: completed ? AppColors.volt.withValues(alpha: 0.55) : AppColors.white.withValues(alpha: 0.06),
        ),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 40,
            child: Center(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 160),
                transitionBuilder: (child, animation) => ScaleTransition(scale: animation, child: FadeTransition(opacity: animation, child: child)),
                child: completed
                    ? const Icon(Icons.check_circle_rounded, key: ValueKey('done'), color: AppColors.volt, size: 22)
                    : Text(
                        '$setNumber',
                        key: const ValueKey('num'),
                        style: AppTextStyles.title(size: 18, color: AppColors.volt),
                      ),
              ),
            ),
          ),
          Expanded(
            child: _NumberField(
              enabled: !completed,
              controller: weightController,
              hintText: '0',
              style: inputStyle,
              fillColor: completed ? AppColors.surfaceHighlight.withValues(alpha: 0.55) : AppColors.surfaceHighlight,
              borderColor: completed ? AppColors.volt.withValues(alpha: 0.35) : AppColors.transparent,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: _NumberField(
              enabled: !completed,
              controller: repsController,
              hintText: suggestedReps,
              style: inputStyle,
              fillColor: completed ? AppColors.surfaceHighlight.withValues(alpha: 0.55) : AppColors.surfaceHighlight,
              borderColor: completed ? AppColors.volt.withValues(alpha: 0.35) : AppColors.transparent,
            ),
          ),
          const SizedBox(width: 10),
          SizedBox(
            width: 48,
            height: 48,
            child: FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: completed ? AppColors.volt : AppColors.surfaceHighlight,
                disabledBackgroundColor: AppColors.volt,
                foregroundColor: completed ? AppColors.black : AppColors.grey500,
                disabledForegroundColor: AppColors.black,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                padding: EdgeInsets.zero,
              ),
              onPressed: completed ? null : onComplete,
              child: Icon(completed ? Icons.check_rounded : Icons.check_rounded, size: 22),
            ),
          ),
        ],
      ),
    );
  }
}

class _NumberField extends StatelessWidget {
  const _NumberField({
    required this.enabled,
    required this.controller,
    required this.hintText,
    required this.style,
    required this.fillColor,
    required this.borderColor,
  });

  final bool enabled;
  final TextEditingController controller;
  final String hintText;
  final TextStyle style;
  final Color fillColor;
  final Color borderColor;

  @override
  Widget build(BuildContext context) {
    return TextField(
      enabled: enabled,
      controller: controller,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      textAlign: TextAlign.center,
      style: style,
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: AppTextStyles.label(weight: FontWeight.w800, color: AppColors.grey700),
        filled: true,
        fillColor: fillColor,
        contentPadding: const EdgeInsets.symmetric(vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: borderColor == AppColors.transparent ? BorderSide.none : BorderSide(color: borderColor),
        ),
      ),
    );
  }
}
