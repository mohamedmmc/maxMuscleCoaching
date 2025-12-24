import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

class PrimaryButton extends StatelessWidget {
  const PrimaryButton({
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.trailing,
    super.key,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final Widget? trailing;

  @override
  Widget build(BuildContext context) {
    final effectiveOnPressed = isLoading ? null : onPressed;

    return FilledButton(
      style: FilledButton.styleFrom(
        backgroundColor: AppColors.volt,
        foregroundColor: AppColors.black,
        minimumSize: const Size.fromHeight(56),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        textStyle: AppTextStyles.label(
          weight: FontWeight.w900,
          letterSpacing: 1.2,
          color: AppColors.black,
        ).copyWith(fontStyle: FontStyle.italic),
      ),
      onPressed: effectiveOnPressed,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (isLoading) ...[
            const SizedBox(
              width: 18,
              height: 18,
              child: CircularProgressIndicator(
                strokeWidth: 2.5,
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.black),
              ),
            ),
            const SizedBox(width: 10),
          ],
          Text(label.toUpperCase()),
          if (!isLoading && trailing != null) ...[
            const SizedBox(width: 8),
            trailing!,
          ],
        ],
      ),
    );
  }
}
