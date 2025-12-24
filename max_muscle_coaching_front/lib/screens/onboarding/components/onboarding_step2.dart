part of '../onboarding_screen.dart';

class _Step2 extends StatelessWidget {
  const _Step2({
    required this.split,
    required this.fitnessLevel,
    required this.onChangeSplit,
    required this.onChangeLevel,
    super.key,
  });

  final WorkoutSplit split;
  final FitnessLevel fitnessLevel;
  final ValueChanged<WorkoutSplit> onChangeSplit;
  final ValueChanged<FitnessLevel> onChangeLevel;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'SELECT PROTOCOL',
            style: AppTextStyles.caps(
              size: 10,
              weight: FontWeight.w800,
              letterSpacing: 2,
              color: AppColors.grey600,
            ),
          ),
          const SizedBox(height: 12),
          for (final s in WorkoutSplit.values) ...[
            _SplitCard(
              split: s,
              selected: split == s,
              description: splitDescriptions[s] ?? '',
              onTap: () => onChangeSplit(s),
            ),
            const SizedBox(height: 10),
          ],
          const SizedBox(height: 16),
          Text(
            'EXPERIENCE LEVEL',
            style: AppTextStyles.caps(
              size: 10,
              weight: FontWeight.w800,
              letterSpacing: 2,
              color: AppColors.grey600,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              for (final level in FitnessLevel.values) ...[
                Expanded(
                  child: _SmallChoice(
                    label: level.label,
                    selected: fitnessLevel == level,
                    onTap: () => onChangeLevel(level),
                  ),
                ),
                if (level != FitnessLevel.advanced) const SizedBox(width: 10),
              ],
            ],
          ),
        ],
      ),
    );
  }
}

class _SplitCard extends StatelessWidget {
  const _SplitCard({
    required this.split,
    required this.selected,
    required this.description,
    required this.onTap,
  });

  final WorkoutSplit split;
  final bool selected;
  final String description;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
	    final borderColor = selected ? AppColors.volt : AppColors.transparent;
    final bg = selected
        ? AppColors.volt.withValues(alpha: 0.06)
        : AppColors.surfaceHighlight;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: borderColor, width: 2),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
	                  Text(
	                    split.label,
	                    style: AppTextStyles.title(
	                      size: 18,
	                      weight: FontWeight.w900,
	                      fontStyle: FontStyle.normal,
	                      color: selected ? AppColors.white : AppColors.grey300,
	                    ),
	                  ),
                  const SizedBox(height: 6),
	                  Text(
	                    description,
	                    style: AppTextStyles.body(
	                      size: 12,
	                      weight: FontWeight.w600,
	                      color: AppColors.grey500,
	                    ),
	                  ),
                ],
              ),
            ),
            if (selected)
              const DecoratedBox(
                decoration: BoxDecoration(
                    color: AppColors.volt, shape: BoxShape.circle),
                child: Padding(
	                  padding: EdgeInsets.all(6),
	                  child:
	                      Icon(Icons.check_rounded, size: 16, color: AppColors.black),
	                ),
	              ),
          ],
        ),
      ),
    );
  }
}

class _SmallChoice extends StatelessWidget {
  const _SmallChoice(
      {required this.label, required this.selected, required this.onTap});

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
	        decoration: BoxDecoration(
	          color: selected ? AppColors.white : AppColors.surfaceHighlight,
	          borderRadius: BorderRadius.circular(18),
	          border: Border.all(
	              color: selected ? AppColors.white : AppColors.transparent, width: 2),
	        ),
        child: Center(
	          child: Text(
	            label.toUpperCase(),
	            style: AppTextStyles.caps(
	              size: 11,
	              weight: FontWeight.w900,
	              letterSpacing: 1.2,
	              color: selected ? AppColors.black : AppColors.grey500,
	            ),
	          ),
        ),
      ),
    );
  }
}
