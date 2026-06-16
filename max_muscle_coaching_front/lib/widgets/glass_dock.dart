import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/app_colors.dart';

class GlassDock extends StatelessWidget {
  const GlassDock({
    required this.currentIndex,
    required this.onTapDashboard,
    required this.onTapWorkout,
    required this.onTapProfile,
    super.key,
  });

  static const double contentHeight = 76.0;
  static const double minBottomPadding = 12.0;

  static double heightWithinSafeArea(BuildContext context) {
    final systemBottomInset = MediaQuery.of(context).padding.bottom;
    final extraPadding = (minBottomPadding - systemBottomInset).clamp(0.0, double.infinity);
    return contentHeight + extraPadding;
  }

  final int currentIndex;
  final VoidCallback onTapDashboard;
  final VoidCallback onTapWorkout;
  final VoidCallback onTapProfile;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      minimum: const EdgeInsets.only(bottom: 12),
      child: Center(
        child: ClipRRect(
          borderRadius: BorderRadius.circular(999),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: AppColors.surface.withValues(alpha: 0.80),
                border: Border.all(color: AppColors.white.withValues(alpha: 0.06)),
                borderRadius: BorderRadius.circular(999),
              ),
              child: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _IconButton(
                      isActive: currentIndex == 0,
                      icon: Icons.dashboard_rounded,
                      onTap: onTapDashboard,
                    ),
                    const SizedBox(width: 18),
                    _CenterButton(
                      isActive: currentIndex == 1,
                      onTap: onTapWorkout,
                    ),
                    const SizedBox(width: 18),
                    _IconButton(
                      isActive: currentIndex == 2,
                      icon: Icons.person_rounded,
                      onTap: onTapProfile,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _IconButton extends StatelessWidget {
  const _IconButton({
    required this.isActive,
    required this.icon,
    required this.onTap,
  });

  final bool isActive;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final color = isActive ? AppColors.volt : AppColors.grey500;
    return GestureDetector(
      onTap: () {
        HapticFeedback.selectionClick();
        onTap();
      },
      behavior: HitTestBehavior.opaque,
      child: AnimatedScale(
        scale: isActive ? 1.12 : 1.0,
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOut,
        child: Icon(icon, color: color, size: 26),
      ),
    );
  }
}

class _CenterButton extends StatelessWidget {
  const _CenterButton({required this.isActive, required this.onTap});

  final bool isActive;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        HapticFeedback.selectionClick();
        onTap();
      },
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeOut,
        decoration: BoxDecoration(
          color: AppColors.volt,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: AppColors.volt.withValues(alpha: 0.18),
              blurRadius: 24,
              spreadRadius: 2,
            ),
          ],
        ),
        padding: const EdgeInsets.all(14),
        child: Stack(
          alignment: Alignment.center,
          children: [
            Icon(Icons.fitness_center_rounded, color: AppColors.black, size: 28),
            if (isActive)
              Positioned.fill(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                        color: AppColors.volt.withValues(alpha: 0.25),
                        width: 6),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
