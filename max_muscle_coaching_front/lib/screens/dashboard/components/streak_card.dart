part of '../dashboard_screen.dart';

class _StreakCard extends StatelessWidget {
  const _StreakCard({required this.current, required this.longest});

  final int current;
  final int longest;

  @override
  Widget build(BuildContext context) {
    final isActive = current > 0;
    final flameColor = isActive ? const Color(0xFFFF7A1A) : AppColors.grey600;

    final semanticLabel = isActive
        ? 'Current streak: $current day${current == 1 ? '' : 's'}. Personal best: $longest days.'
        : (longest > 0
            ? 'No active streak. Personal best: $longest days. Complete a workout to start a new one.'
            : 'No streak yet. Complete a workout to begin tracking.');

    return Semantics(
      container: true,
      label: semanticLabel,
      child: Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(
          color: isActive ? const Color(0xFFFF7A1A).withValues(alpha: 0.4) : AppColors.border,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: flameColor.withValues(alpha: 0.12),
            ),
            child: Icon(
              Icons.local_fire_department_rounded,
              color: flameColor,
              size: 32,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isActive
                      ? '$current day${current == 1 ? '' : 's'} streak'
                      : (longest > 0 ? 'Start a new streak today' : 'No streak yet'),
                  style: AppTextStyles.title(size: 18, letterSpacing: -0.2),
                ),
                const SizedBox(height: 4),
                Text(
                  longest > 0 ? 'BEST · $longest DAYS' : 'COMPLETE A WORKOUT TO BEGIN',
                  style: AppTextStyles.caps(
                    color: AppColors.grey600,
                    letterSpacing: 1.6,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      ),
    );
  }
}
