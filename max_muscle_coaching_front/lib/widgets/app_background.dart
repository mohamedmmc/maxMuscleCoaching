import 'dart:ui';

import 'package:flutter/material.dart';

import '../theme/app_colors.dart';

class AppBackground extends StatelessWidget {
  const AppBackground({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        DecoratedBox(
          decoration: const BoxDecoration(
            gradient: RadialGradient(
              center: Alignment.topCenter,
              radius: 1.15,
              colors: [AppColors.darkSoft, AppColors.dark],
              stops: [0, 0.7],
            ),
          ),
          child: const SizedBox.expand(),
        ),
        Positioned(
          top: -140,
          right: -140,
          width: 300,
          height: 300,
          child: ImageFiltered(
            imageFilter: ImageFilter.blur(sigmaX: 90, sigmaY: 90),
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: AppColors.volt.withValues(alpha: 0.10),
                shape: BoxShape.circle,
              ),
            ),
          ),
        ),
        child,
      ],
    );
  }
}
