import 'package:flutter/material.dart';

import 'app_colors.dart';

class AppTextStyles {
  AppTextStyles._();

  static TextStyle display({
    double size = 34,
    FontWeight weight = FontWeight.w900,
    FontStyle fontStyle = FontStyle.italic,
    double height = 1.0,
    double? letterSpacing = -1.2,
    Color color = AppColors.white,
  }) {
    return TextStyle(
      fontSize: size,
      fontWeight: weight,
      fontStyle: fontStyle,
      height: height,
      letterSpacing: letterSpacing,
      color: color,
    );
  }

  static TextStyle title({
    double size = 18,
    FontWeight weight = FontWeight.w900,
    FontStyle fontStyle = FontStyle.italic,
    double height = 1.0,
    double? letterSpacing = -0.5,
    Color color = AppColors.white,
  }) {
    return TextStyle(
      fontSize: size,
      fontWeight: weight,
      fontStyle: fontStyle,
      height: height,
      letterSpacing: letterSpacing,
      color: color,
    );
  }

  static TextStyle label({
    double size = 12,
    FontWeight weight = FontWeight.w800,
    double? letterSpacing,
    Color color = AppColors.white,
  }) {
    return TextStyle(
      fontSize: size,
      fontWeight: weight,
      letterSpacing: letterSpacing,
      color: color,
    );
  }

  static TextStyle caps({
    double size = 10,
    FontWeight weight = FontWeight.w900,
    double letterSpacing = 1.6,
    Color? color,
  }) {
    return TextStyle(
      fontSize: size,
      fontWeight: weight,
      letterSpacing: letterSpacing,
      color: color ?? AppColors.grey600,
    );
  }

  static TextStyle body({
    double size = 14,
    FontWeight weight = FontWeight.w600,
    double height = 1.35,
    Color? color,
    FontStyle? fontStyle,
  }) {
    return TextStyle(
      fontSize: size,
      fontWeight: weight,
      height: height,
      color: color ?? AppColors.grey400,
      fontStyle: fontStyle,
    );
  }
}
