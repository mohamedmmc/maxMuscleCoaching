import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:max_muscle_coaching_front/theme/app_colors.dart';

class SnackbarService {
  SnackbarService._();

  static void showError({
    required String title,
    required String message,
  }) {
    Get.snackbar(
      title,
      message,
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: AppColors.errorBackground(),
      colorText: AppColors.white,
      borderColor: AppColors.errorBorder(),
      borderWidth: 1.5,
      margin: const EdgeInsets.all(12),
    );
  }

  static void showInfo({
    required String title,
    required String message,
  }) {
    Get.snackbar(
      title,
      message,
      snackPosition: SnackPosition.BOTTOM,
      backgroundColor: AppColors.black.withValues(alpha: 0.65),
      colorText: AppColors.white,
      margin: const EdgeInsets.all(12),
    );
  }

  static void showNoInternet() {
    showError(
      title: 'No internet connection',
      message: 'Please check your connection and try again.',
    );
  }
}
