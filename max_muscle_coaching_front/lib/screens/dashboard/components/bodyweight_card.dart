part of '../dashboard_screen.dart';

class _BodyweightCard extends StatelessWidget {
  const _BodyweightCard({
    required this.history,
    required this.onLogPressed,
  });

  final List<BodyweightEntry> history;
  final VoidCallback onLogPressed;

  @override
  Widget build(BuildContext context) {
    final hasData = history.isNotEmpty;
    final latest = hasData ? history.last : null;
    final first = hasData ? history.first : null;
    final delta =
        (latest != null && first != null) ? latest.weight - first.weight : 0;
    final deltaLabel = delta == 0
        ? '—'
        : (delta > 0 ? '+${delta.toStringAsFixed(1)}' : delta.toStringAsFixed(1));

    final chartPoints = hasData
        ? _buildChartPoints(history)
        : const <ChartPoint>[];

    final semanticLabel = hasData
        ? 'Bodyweight: ${latest!.weight.toStringAsFixed(1)} kg, '
            '${delta == 0 ? "unchanged" : (delta > 0 ? "${delta.toStringAsFixed(1)} kg up" : "${(-delta).toStringAsFixed(1)} kg down")} '
            'over ${history.length} entries.'
        : 'Bodyweight: no entries logged yet.';

    return Semantics(
      container: true,
      label: semanticLabel,
      child: Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.monitor_weight_rounded,
                  color: AppColors.purple, size: 20),
              const SizedBox(width: 8),
              Text(
                'BODYWEIGHT',
                style: AppTextStyles.caps(
                    color: AppColors.grey600, letterSpacing: 2.2),
              ),
              const Spacer(),
              Semantics(
                button: true,
                label: 'Log new bodyweight',
                child: GestureDetector(
                  onTap: onLogPressed,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.volt.withValues(alpha: 0.16),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.add_rounded,
                            color: AppColors.volt, size: 16),
                        const SizedBox(width: 4),
                        Text(
                          'LOG',
                          style: AppTextStyles.label(
                            size: 11,
                            weight: FontWeight.w900,
                            letterSpacing: 1.4,
                            color: AppColors.volt,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          if (!hasData)
            Text(
              'Log your weight to start tracking trends.',
              style:
                  AppTextStyles.label(size: 13, color: AppColors.grey500),
            )
          else ...[
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  latest!.weight.toStringAsFixed(1),
                  style: AppTextStyles.display(size: 36, letterSpacing: -1.4),
                ),
                const SizedBox(width: 6),
                Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Text(
                    'kg',
                    style: AppTextStyles.label(
                      size: 14,
                      color: AppColors.grey500,
                    ),
                  ),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceHighlight,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    '$deltaLabel kg',
                    style: AppTextStyles.label(
                      size: 12,
                      weight: FontWeight.w900,
                      color: delta < 0
                          ? AppColors.greenMint
                          : (delta > 0
                              ? const Color(0xFFFF7A1A)
                              : AppColors.grey500),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              latest.dateLogged,
              style:
                  AppTextStyles.label(size: 11, color: AppColors.grey600),
            ),
            const SizedBox(height: 14),
            SimpleAreaChart(points: chartPoints),
          ],
        ],
      ),
      ),
    );
  }

  static List<ChartPoint> _buildChartPoints(List<BodyweightEntry> history) {
    // Take up to last 7 entries to keep label density readable.
    final tail = history.length <= 7 ? history : history.sublist(history.length - 7);
    return tail
        .map((e) => ChartPoint(
              label: _shortDate(e.dateLogged),
              value: e.weight,
            ))
        .toList(growable: false);
  }

  static String _shortDate(String iso) {
    if (iso.length < 10) return iso;
    return iso.substring(5); // MM-DD
  }
}
