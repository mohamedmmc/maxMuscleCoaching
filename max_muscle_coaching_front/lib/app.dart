import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';

import 'package:max_muscle_coaching_front/controllers/app_controller.dart';
import 'package:max_muscle_coaching_front/screens/home_shell/home_shell.dart';
import 'package:max_muscle_coaching_front/screens/login/login_screen.dart';
import 'package:max_muscle_coaching_front/theme/app_colors.dart';
import 'package:max_muscle_coaching_front/theme/app_text_styles.dart';

class MaxMuscleApp extends StatelessWidget {
  const MaxMuscleApp({super.key});

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: AppColors.transparent,
      statusBarIconBrightness: Brightness.light,
      statusBarBrightness: Brightness.dark,
    ));

    return GetMaterialApp(
      title: 'Max Muscle Coaching',
      debugShowCheckedModeBanner: false,
      // Clamp OS-level font scaling so the glass cards (hero, mini-stats,
      // dashboard tiles) don't blow out their constraints at large
      // accessibility text sizes — keeps the floor reasonable too.
      builder: (context, child) => MediaQuery(
        data: MediaQuery.of(context).copyWith(
          textScaler: MediaQuery.textScalerOf(context).clamp(
            minScaleFactor: 0.85,
            maxScaleFactor: 1.3,
          ),
        ),
        child: child ?? const SizedBox.shrink(),
      ),
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.dark,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.volt,
          secondary: AppColors.volt,
          surface: AppColors.surface,
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          ),
        ),
      ),
      home: const _RootGate(),
    );
  }
}

class _RootGate extends StatelessWidget {
  const _RootGate();

  @override
  Widget build(BuildContext context) {
    return GetBuilder<AppController>(
      builder: (app) {
        if (!app.isReady) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (!app.hasInternet) {
          return Scaffold(
            body: Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.wifi_off_rounded,
                      size: 56,
                      color: AppColors.white70,
                    ),
                    const SizedBox(height: 14),
                    Text(
                      'No internet connection',
                      style: AppTextStyles.title(size: 20, fontStyle: FontStyle.normal),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Connect to the internet to continue.',
                      textAlign: TextAlign.center,
                      style: AppTextStyles.body(color: AppColors.grey400, weight: FontWeight.w600),
                    ),
                    const SizedBox(height: 16),
                    FilledButton(
                      onPressed: AppController.find.refreshConnectivity,
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
            ),
          );
        }

        final user = app.user;
        if (user == null) return const LoginScreen();
        return const HomeShell();
      },
    );
  }
}
