import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

class PrimaryButton extends StatefulWidget {
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
  State<PrimaryButton> createState() => _PrimaryButtonState();
}

class _PrimaryButtonState extends State<PrimaryButton> {
  // Set synchronously inside the tap handler, before the parent has a chance
  // to flip isLoading. Reset on every rebuild so the next press works.
  bool _isFiring = false;

  void _handlePress() {
    if (_isFiring) return;
    _isFiring = true;
    HapticFeedback.mediumImpact();
    widget.onPressed?.call();
  }

  @override
  Widget build(BuildContext context) {
    _isFiring = false;

    final canPress = !widget.isLoading && widget.onPressed != null;
    final effectiveOnPressed = canPress ? _handlePress : null;

    return Semantics(
      button: true,
      enabled: effectiveOnPressed != null,
      label: widget.isLoading ? '${widget.label}, loading' : widget.label,
      excludeSemantics: true,
      child: FilledButton(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.volt,
          foregroundColor: AppColors.black,
          minimumSize: const Size.fromHeight(56),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
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
            if (widget.isLoading) ...[
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
            Text(widget.label.toUpperCase()),
            if (!widget.isLoading && widget.trailing != null) ...[
              const SizedBox(width: 8),
              widget.trailing!,
            ],
          ],
        ),
      ),
    );
  }
}
