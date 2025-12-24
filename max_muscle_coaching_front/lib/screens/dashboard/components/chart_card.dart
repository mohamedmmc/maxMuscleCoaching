part of '../dashboard_screen.dart';

class _ChartCard extends StatelessWidget {
  const _ChartCard({
    required this.categories,
    required this.selectedCategory,
    required this.onSelectCategory,
    required this.points,
  });

  final List<String> categories;
  final String selectedCategory;
  final ValueChanged<String> onSelectCategory;
  final List<ChartPoint> points;

  @override
  Widget build(BuildContext context) {
    return Container(
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Performance', style: AppTextStyles.title(size: 18, weight: FontWeight.w800, fontStyle: FontStyle.normal)),
              Row(
                children: [
                  const SizedBox(
                    width: 8,
                    height: 8,
                    child: DecoratedBox(decoration: BoxDecoration(color: AppColors.volt, shape: BoxShape.circle)),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'LIVE',
                    style: AppTextStyles.caps(color: AppColors.volt, letterSpacing: 2.0),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 14),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: categories
                  .map(
                    (c) => Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: _CategoryChip(
                        label: c,
                        selected: c == selectedCategory,
                        onTap: () => onSelectCategory(c),
                      ),
                    ),
                  )
                  .toList(growable: false),
            ),
          ),
          const SizedBox(height: 14),
          SimpleAreaChart(points: points),
        ],
      ),
    );
  }
}

class _CategoryChip extends StatelessWidget {
  const _CategoryChip({required this.label, required this.selected, required this.onTap});

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(999),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: selected ? AppColors.white : AppColors.surfaceHighlight,
          borderRadius: BorderRadius.circular(999),
        ),
        child: Text(
          label.toUpperCase(),
          style: AppTextStyles.label(
            size: 11,
            weight: FontWeight.w900,
            letterSpacing: 1.0,
            color: selected ? AppColors.black : AppColors.grey500,
          ),
        ),
      ),
    );
  }
}
