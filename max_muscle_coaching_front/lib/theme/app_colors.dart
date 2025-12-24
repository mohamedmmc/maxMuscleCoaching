import 'package:flutter/material.dart';

class AppColors {
  static const volt = Color(0xFFCCFF00);
  static const voltDim = Color(0xFFAACC00);
  static const dark = Color(0xFF050505);
  static const darkSoft = Color(0xFF1A1A1A);
  static const surface = Color(0xFF121212);
  static const surfaceHighlight = Color(0xFF1E1E1E);
  static const border = Color(0xFF2A2A2A);

  static const transparent = Colors.transparent;
  static const white = Colors.white;
  static const black = Colors.black;
  static const white70 = Colors.white70;
  static const grey = Colors.grey;
  static const red = Colors.red;

  static Color get grey100 => Colors.grey.shade100;
  static Color get grey300 => Colors.grey.shade300;
  static Color get grey400 => Colors.grey.shade400;
  static Color get grey500 => Colors.grey.shade500;
  static Color get grey600 => Colors.grey.shade600;
  static Color get grey700 => Colors.grey.shade700;
  static Color get grey800 => Colors.grey.shade800;
  static Color get grey900 => Colors.grey.shade900;

  static Color get red300 => Colors.red.shade300;
  static Color get red400 => Colors.red.shade400;
  static Color get red900 => Colors.red.shade900;

  static const greenMint = Color(0xFF34D399);
  static const purple = Color(0xFFC084FC);

  static Color errorBackground({double alpha = 0.12}) => Colors.red.withValues(alpha: alpha);
  static Color errorBorder({double alpha = 0.35}) => Colors.red.withValues(alpha: alpha);
}
