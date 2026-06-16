import 'dart:async';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import 'package:max_muscle_coaching_front/theme/app_colors.dart';
import 'package:max_muscle_coaching_front/theme/app_text_styles.dart';

class ExerciseMotionFullscreenViewer extends StatefulWidget {
  const ExerciseMotionFullscreenViewer({
    required this.title,
    required this.heroTag,
    required this.imageUrls,
    required this.initialIndex,
    this.interval = const Duration(milliseconds: 1400),
    this.fadeDuration = const Duration(milliseconds: 520),
    super.key,
  });

  final String title;
  final String heroTag;
  final List<String> imageUrls;
  final int initialIndex;
  final Duration interval;
  final Duration fadeDuration;

  static Future<void> show(
    BuildContext context, {
    required String title,
    required String heroTag,
    required List<String> imageUrls,
    int initialIndex = 0,
  }) async {
    final urls = imageUrls.map((e) => e.trim()).where((e) => e.isNotEmpty).toList(growable: false);
    if (urls.isEmpty) return;
    final clampedInitial = initialIndex.clamp(0, urls.length - 1).toInt();

    await showGeneralDialog<void>(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Close',
      barrierColor: AppColors.black.withValues(alpha: 0.92),
      transitionDuration: const Duration(milliseconds: 220),
      pageBuilder: (_, __, ___) => ExerciseMotionFullscreenViewer(title: title, heroTag: heroTag, imageUrls: urls, initialIndex: clampedInitial),
      transitionBuilder: (_, animation, __, child) {
        final curved = CurvedAnimation(parent: animation, curve: Curves.easeOut, reverseCurve: Curves.easeIn);
        return FadeTransition(
          opacity: curved,
          child: ScaleTransition(
            scale: Tween<double>(begin: 0.985, end: 1.0).animate(curved),
            child: child,
          ),
        );
      },
    );
  }

  @override
  State<ExerciseMotionFullscreenViewer> createState() => _ExerciseMotionFullscreenViewerState();
}

class _ExerciseMotionFullscreenViewerState extends State<ExerciseMotionFullscreenViewer> {
  Timer? _timer;
  bool _showSecond = false;
  PageController? _pageController;
  int _index = 0;

  List<String> get _urls => widget.imageUrls.map((e) => e.trim()).where((e) => e.isNotEmpty).toList(growable: false);

  @override
  void initState() {
    super.initState();
    _configure();
  }

  @override
  void didUpdateWidget(covariant ExerciseMotionFullscreenViewer oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.imageUrls != widget.imageUrls || oldWidget.initialIndex != widget.initialIndex) {
      _configure();
    }
  }

  void _configure() {
    _timer?.cancel();
    _timer = null;
    _pageController?.dispose();
    _pageController = null;

    final urls = _urls;
    if (urls.isEmpty) return;

    _index = widget.initialIndex.clamp(0, urls.length - 1).toInt();
    if (urls.length == 2) {
      _showSecond = _index == 1;
      _timer = Timer.periodic(widget.interval, (_) {
        if (!mounted) return;
        setState(() => _showSecond = !_showSecond);
      });
      return;
    }

    _showSecond = false;
    _pageController = PageController(initialPage: _index);
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final urls = _urls;
    final isMotion = urls.length == 2;
    final hasSecond = urls.length >= 2;
    final primary = urls.isNotEmpty ? urls.first : '';
    final secondary = hasSecond ? urls[1] : '';
    final paddingTop = MediaQuery.of(context).padding.top;

    return Material(
      color: AppColors.transparent,
      child: Stack(
        children: [
          Positioned.fill(
            child: Hero(
              tag: widget.heroTag,
              child: isMotion
                  ? InteractiveViewer(
                      minScale: 1,
                      maxScale: 4,
                      child: Center(
                        child: Stack(
                          fit: StackFit.passthrough,
                          alignment: Alignment.center,
                          children: [
                            if (primary.isNotEmpty)
                              CachedNetworkImage(
                                imageUrl: primary,
                                fit: BoxFit.contain,
                                errorWidget: (_, __, ___) => const SizedBox.shrink(),
                                placeholder: (_, __) => const SizedBox.shrink(),
                              ),
                            if (hasSecond && secondary.isNotEmpty)
                              AnimatedOpacity(
                                opacity: _showSecond ? 1 : 0,
                                duration: widget.fadeDuration,
                                curve: Curves.easeInOut,
                                child: CachedNetworkImage(
                                  imageUrl: secondary,
                                  fit: BoxFit.contain,
                                  errorWidget: (_, __, ___) => const SizedBox.shrink(),
                                  placeholder: (_, __) => const SizedBox.shrink(),
                                ),
                              ),
                          ],
                        ),
                      ),
                    )
                  : PageView.builder(
                      controller: _pageController,
                      itemCount: urls.length,
                      onPageChanged: (idx) => setState(() => _index = idx),
                      itemBuilder: (context, idx) {
                        final url = urls[idx];
                        return InteractiveViewer(
                          minScale: 1,
                          maxScale: 4,
                          child: Center(
                            child: CachedNetworkImage(
                              imageUrl: url,
                              fit: BoxFit.contain,
                              errorWidget: (_, __, ___) => const SizedBox.shrink(),
                              placeholder: (_, __) => const SizedBox.shrink(),
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ),
          Positioned(
            left: 16,
            right: 16,
            top: 12 + paddingTop,
            child: Row(
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: AppColors.black.withValues(alpha: 0.45),
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(color: AppColors.white.withValues(alpha: 0.12)),
                  ),
                  child: IconButton(
                    onPressed: () => Navigator.of(context).maybePop(),
                    icon: const Icon(Icons.close_rounded),
                    color: AppColors.white,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    widget.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppTextStyles.title(
                      size: 18,
                      letterSpacing: -0.2,
                      color: AppColors.white,
                    ),
                  ),
                ),
                if (urls.length > 1)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.black.withValues(alpha: 0.45),
                      borderRadius: BorderRadius.circular(999),
                      border: Border.all(color: AppColors.white.withValues(alpha: 0.12)),
                    ),
                    child: Text(
                      isMotion ? 'MOTION' : '${_index + 1}/${urls.length}',
                      style: AppTextStyles.caps(color: AppColors.grey100),
                    ),
                  ),
              ],
            ),
          ),
          Positioned(
            left: 16,
            right: 16,
            bottom: 18,
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      color: AppColors.black.withValues(alpha: 0.45),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.white.withValues(alpha: 0.10)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.pinch_rounded, color: AppColors.volt, size: 18),
                        const SizedBox(width: 10),
                        Text(
                          isMotion
                              ? 'Pinch to zoom • Motion preview'
                              : urls.length > 1
                                  ? 'Pinch to zoom • Swipe'
                                  : 'Pinch to zoom',
                          style: AppTextStyles.body(color: AppColors.grey300, weight: FontWeight.w700, height: 1.2),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
