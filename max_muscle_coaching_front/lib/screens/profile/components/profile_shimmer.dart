import 'package:flutter/material.dart';
import 'package:max_muscle_coaching_front/theme/app_colors.dart';

class ProfileShimmer extends StatelessWidget {
  const ProfileShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return const _Shimmer(
      child: Column(
        children: [
          _ProfileCardSkeleton(),
          SizedBox(height: 14),
          _ButtonSkeleton(),
        ],
      ),
    );
  }
}

class _ProfileCardSkeleton extends StatelessWidget {
  const _ProfileCardSkeleton();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Row(
            children: [
              const _SkeletonBox(
                width: 78,
                height: 78,
                radius: 999,
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    _SkeletonBox(width: 140, height: 18, radius: 8),
                    SizedBox(height: 10),
                    _SkeletonBox(width: 190, height: 12, radius: 8),
                    SizedBox(height: 12),
                    _SkeletonBox(width: 92, height: 22, radius: 10),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: const [
              Expanded(child: _MiniStatSkeleton()),
              SizedBox(width: 12),
              Expanded(child: _MiniStatSkeleton()),
            ],
          ),
        ],
      ),
    );
  }
}

class _MiniStatSkeleton extends StatelessWidget {
  const _MiniStatSkeleton();

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
        children: const [
          _SkeletonBox(width: 64, height: 10, radius: 6),
          SizedBox(height: 10),
          _SkeletonBox(width: 96, height: 22, radius: 10),
        ],
      ),
    );
  }
}

class _ButtonSkeleton extends StatelessWidget {
  const _ButtonSkeleton();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56,
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppColors.surfaceHighlight,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
      ),
      child: const Center(
        child: _SkeletonBox(width: 110, height: 12, radius: 8),
      ),
    );
  }
}

class _SkeletonBox extends StatelessWidget {
  const _SkeletonBox({
    required this.width,
    required this.height,
    required this.radius,
  });

  final double width;
  final double height;
  final double radius;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: AppColors.white.withValues(alpha: 0.10),
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }
}

class _Shimmer extends StatefulWidget {
  const _Shimmer({required this.child});

  final Widget child;

  @override
  State<_Shimmer> createState() => _ShimmerState();
}

class _ShimmerState extends State<_Shimmer> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final baseColor = AppColors.white.withValues(alpha: 0.07);
    final highlightColor = AppColors.white.withValues(alpha: 0.18);

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, _) {
        final slidePercent = (_controller.value * 2) - 1; // -1..1
        return ShaderMask(
          blendMode: BlendMode.srcATop,
          shaderCallback: (bounds) {
            return LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [
                baseColor,
                highlightColor,
                baseColor,
              ],
              stops: const [0.25, 0.5, 0.75],
              transform: _SlidingGradientTransform(slidePercent),
            ).createShader(bounds);
          },
          child: widget.child,
        );
      },
    );
  }
}

class _SlidingGradientTransform extends GradientTransform {
  const _SlidingGradientTransform(this.slidePercent);

  final double slidePercent;

  @override
  Matrix4 transform(Rect bounds, {TextDirection? textDirection}) {
    return Matrix4.translationValues(bounds.width * slidePercent, 0.0, 0.0);
  }
}
