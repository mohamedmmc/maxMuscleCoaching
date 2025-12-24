part of '../dashboard_screen.dart';

class _ActiveSessionBanner extends StatelessWidget {
  const _ActiveSessionBanner({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppColors.volt.withValues(alpha: 0.55)),
          gradient: LinearGradient(
            colors: [AppColors.volt.withValues(alpha: 0.10), AppColors.transparent],
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: const BoxDecoration(color: AppColors.volt, shape: BoxShape.circle),
              child: const Icon(Icons.play_circle_fill_rounded, color: AppColors.black, size: 26),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'SESSION IN PROGRESS',
                    style: AppTextStyles.title(size: 14, letterSpacing: -0.4),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'TAP TO RESUME',
                    style: AppTextStyles.caps(color: AppColors.volt.withValues(alpha: 0.95), letterSpacing: 2),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: const BoxDecoration(color: AppColors.volt, shape: BoxShape.circle),
              child: const Icon(Icons.north_east_rounded, color: AppColors.black),
            ),
          ],
        ),
      ),
    );
  }
}
