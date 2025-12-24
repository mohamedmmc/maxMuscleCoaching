part of '../dashboard_screen.dart';

class _HeroCard extends StatelessWidget {
  const _HeroCard({required this.totalVolume});

  final double totalVolume;

  @override
  Widget build(BuildContext context) {
    final volumeK = (totalVolume / 1000);
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: AppColors.border),
      ),
      child: Stack(
        children: [
          Positioned(
            right: -10,
            top: -10,
            child: Icon(Icons.emoji_events_rounded, size: 140, color: AppColors.white.withValues(alpha: 0.05)),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.emoji_events_rounded, size: 16, color: AppColors.volt),
                  const SizedBox(width: 8),
                  Text(
                    'TOTAL VOLUME',
                    style: AppTextStyles.caps(color: AppColors.grey500, letterSpacing: 2.2),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text.rich(
                TextSpan(
                  children: [
                    TextSpan(
                      text: volumeK.toStringAsFixed(1),
                      style: AppTextStyles.display(size: 48, letterSpacing: -2),
                    ),
                    TextSpan(
                      text: 'k',
                      style: AppTextStyles.display(size: 26, color: AppColors.grey700),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.volt,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.north_east_rounded, size: 14, color: AppColors.black),
                        const SizedBox(width: 4),
                        Text(
                          '+12%',
                          style: AppTextStyles.label(size: 12, weight: FontWeight.w900, color: AppColors.black),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  Text('vs last month', style: AppTextStyles.label(size: 12, color: AppColors.grey600)),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
