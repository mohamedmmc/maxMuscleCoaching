import 'dart:async';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import 'package:max_muscle_coaching_front/theme/app_colors.dart';

class ExerciseMotionThumbnail extends StatefulWidget {
  const ExerciseMotionThumbnail({
    required this.imageUrls,
    this.width = 72,
    this.height = 72,
    this.borderRadius = const BorderRadius.all(Radius.circular(12)),
    this.opacity = 0.9,
    this.interval = const Duration(milliseconds: 1400),
    this.fadeDuration = const Duration(milliseconds: 420),
    this.fit = BoxFit.cover,
    super.key,
  });

  final List<String> imageUrls;
  final double width;
  final double height;
  final BorderRadius borderRadius;
  final double opacity;
  final Duration interval;
  final Duration fadeDuration;
  final BoxFit fit;

  @override
  State<ExerciseMotionThumbnail> createState() => _ExerciseMotionThumbnailState();
}

class _ExerciseMotionThumbnailState extends State<ExerciseMotionThumbnail> {
  Timer? _timer;
  int _index = 0;

  List<String> get _urls => widget.imageUrls.map((e) => e.trim()).where((e) => e.isNotEmpty).take(2).toList(growable: false);

  @override
  void initState() {
    super.initState();
    _start();
  }

  @override
  void didUpdateWidget(covariant ExerciseMotionThumbnail oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.imageUrls != widget.imageUrls) {
      _index = 0;
      _start();
    }
  }

  void _start() {
    _timer?.cancel();
    final urls = _urls;
    if (urls.length < 2) return;
    _timer = Timer.periodic(widget.interval, (_) {
      if (!mounted) return;
      setState(() => _index = (_index + 1) % urls.length);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final urls = _urls;
    final url = urls.isEmpty ? '' : urls[_index % urls.length];

    return ClipRRect(
      borderRadius: widget.borderRadius,
      child: SizedBox(
        width: widget.width,
        height: widget.height,
        child: ColoredBox(
          color: AppColors.surfaceHighlight,
          child: AnimatedSwitcher(
            duration: widget.fadeDuration,
            switchInCurve: Curves.easeOut,
            switchOutCurve: Curves.easeIn,
            transitionBuilder: (child, animation) => FadeTransition(opacity: animation, child: child),
            child: url.isEmpty
                ? const SizedBox.shrink()
                : Opacity(
                    key: ValueKey(url),
                    opacity: widget.opacity,
                    child: LayoutBuilder(
                      builder: (context, constraints) {
                        final dpr = MediaQuery.of(context).devicePixelRatio;
                        return CachedNetworkImage(
                          imageUrl: url,
                          fit: widget.fit,
                          memCacheWidth:
                              (constraints.maxWidth * dpr).round().clamp(1, 2000),
                          memCacheHeight:
                              (constraints.maxHeight * dpr).round().clamp(1, 2000),
                          errorWidget: (_, __, ___) => const SizedBox.shrink(),
                          placeholder: (_, __) => const SizedBox.shrink(),
                          fadeInDuration: const Duration(milliseconds: 200),
                        );
                      },
                    ),
                  ),
          ),
        ),
      ),
    );
  }
}

