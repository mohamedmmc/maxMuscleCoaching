import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:max_muscle_coaching_front/screens/dashboard/dashboard_screen.dart';
import 'package:max_muscle_coaching_front/screens/profile/profile_screen.dart';
import 'package:max_muscle_coaching_front/screens/workout/workout_screen.dart';
import 'package:max_muscle_coaching_front/widgets/app_background.dart';
import 'package:max_muscle_coaching_front/widgets/glass_dock.dart';

import 'home_shell_controller.dart';

class HomeShell extends StatelessWidget {
  const HomeShell({super.key});

  @override
  Widget build(BuildContext context) {
    return GetBuilder<HomeShellController>(
      init: HomeShellController(),
      builder: (controller) {
        return Scaffold(
          body: AppBackground(
            child: Stack(
              children: [
                Positioned.fill(
                  child: PageView(
                    controller: controller.pageController,
                    onPageChanged: controller.onPageChanged,
                    physics: const BouncingScrollPhysics(),
                    children: [
                      DashboardScreen(onResumeSession: () => controller.setIndex(1)),
                      WorkoutScreen(onWorkoutFinished: () => controller.setIndex(0)),
                      const ProfileScreen(),
                    ],
                  ),
                ),
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: 0,
                  child: GlassDock(
                    currentIndex: controller.currentIndex,
                    onTapDashboard: () => controller.setIndex(0),
                    onTapWorkout: () => controller.setIndex(1),
                    onTapProfile: () => controller.setIndex(2),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
