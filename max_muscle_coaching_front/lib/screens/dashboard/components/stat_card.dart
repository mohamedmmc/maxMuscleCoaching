part of '../dashboard_screen.dart';

class _StatCard extends StatelessWidget {
  const _StatCard({
    required this.icon,
    required this.iconColor,
    required this.label,
    required this.value,
    this.suffix,
  });

  final IconData icon;
  final Color iconColor;
  final String label;
  final String value;
  final String? suffix;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(color: AppColors.surfaceHighlight, borderRadius: BorderRadius.circular(999)),
            child: Icon(icon, color: iconColor),
          ),
          const SizedBox(height: 12),
          Text(
            label,
            style: AppTextStyles.caps(color: AppColors.grey600, letterSpacing: 2.2),
          ),
          const SizedBox(height: 6),
          Text.rich(
            TextSpan(
              children: [
                TextSpan(
                  text: value,
                  style: AppTextStyles.display(size: 30, letterSpacing: -1.2),
                ),
                if (suffix != null)
                  TextSpan(
                    text: suffix,
                    style: AppTextStyles.label(size: 14, weight: FontWeight.w900, color: AppColors.grey700),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
