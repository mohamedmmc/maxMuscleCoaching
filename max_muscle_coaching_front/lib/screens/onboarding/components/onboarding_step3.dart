part of '../onboarding_screen.dart';

class _Step3 extends StatelessWidget {
  const _Step3({
    required this.location,
    required this.daysPerWeek,
    required this.sessionDuration,
    required this.injuryController,
    required this.onChangeLocation,
    required this.onChangeDaysPerWeek,
    required this.onChangeDuration,
    super.key,
  });

  final TrainingLocation location;
  final int daysPerWeek;
  final int sessionDuration;
  final TextEditingController injuryController;
  final ValueChanged<TrainingLocation> onChangeLocation;
  final ValueChanged<int> onChangeDaysPerWeek;
  final ValueChanged<int> onChangeDuration;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'TRAINING GROUND',
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
              Expanded(
                child: _LargeChoice(
                  label: TrainingLocation.gym.label,
                  selected: location == TrainingLocation.gym,
                  onTap: () => onChangeLocation(TrainingLocation.gym),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _LargeChoice(
                  label: TrainingLocation.home.label,
                  selected: location == TrainingLocation.home,
                  onTap: () => onChangeLocation(TrainingLocation.home),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          _SliderCard(
            title: 'FREQUENCY',
            valueLabel: '$daysPerWeek DAYS/WEEK',
            min: 2,
            max: 7,
            divisions: 5,
            value: daysPerWeek.toDouble(),
            onChanged: (v) => onChangeDaysPerWeek(v.round()),
            footerLeft: 'Recover',
            footerRight: 'Grind',
          ),
          const SizedBox(height: 14),
          _SliderCard(
            title: 'DURATION',
            valueLabel: '$sessionDuration MINS',
            min: 30,
            max: 120,
            divisions: 6,
            value: sessionDuration.toDouble(),
            onChanged: (v) => onChangeDuration((v / 15).round() * 15),
          ),
          const SizedBox(height: 16),
          _Field(
            label: 'Injuries (Optional)',
            controller: injuryController,
            keyboardType: TextInputType.multiline,
            error: false,
            maxLines: 3,
          ),
        ],
      ),
    );
  }
}

class _LargeChoice extends StatelessWidget {
  const _LargeChoice(
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
        padding: const EdgeInsets.symmetric(vertical: 20),
	        decoration: BoxDecoration(
	          color: selected ? AppColors.volt : AppColors.surfaceHighlight,
	          borderRadius: BorderRadius.circular(18),
	          border: Border.all(
	              color: selected ? AppColors.volt : AppColors.transparent, width: 2),
	          boxShadow: [
            if (selected)
              BoxShadow(
                color: AppColors.volt.withValues(alpha: 0.18),
                blurRadius: 26,
                spreadRadius: 2,
              ),
          ],
        ),
        child: Center(
	          child: Text(
	            label.toUpperCase(),
	            style: AppTextStyles.caps(
	              size: 12,
	              weight: FontWeight.w900,
	              letterSpacing: 1.4,
	              color: selected ? AppColors.black : AppColors.grey400,
	            ),
	          ),
        ),
      ),
    );
  }
}

class _SliderCard extends StatelessWidget {
  const _SliderCard({
    required this.title,
    required this.valueLabel,
    required this.min,
    required this.max,
    required this.divisions,
    required this.value,
    required this.onChanged,
    this.footerLeft,
    this.footerRight,
  });

  final String title;
  final String valueLabel;
  final double min;
  final double max;
  final int divisions;
  final double value;
  final ValueChanged<double> onChanged;
  final String? footerLeft;
  final String? footerRight;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surfaceHighlight,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
	              Text(
	                title,
	                style: AppTextStyles.caps(
	                  size: 10,
	                  weight: FontWeight.w800,
	                  letterSpacing: 2,
	                  color: AppColors.grey600,
	                ),
	              ),
	              Text(
	                valueLabel,
	                style: AppTextStyles.caps(
	                  size: 10,
	                  weight: FontWeight.w900,
	                  letterSpacing: 1.8,
	                  color: AppColors.volt,
	                ),
	              ),
            ],
          ),
          SliderTheme(
            data: SliderTheme.of(context).copyWith(
	              activeTrackColor: AppColors.volt,
	              inactiveTrackColor: AppColors.grey900,
	              thumbColor: AppColors.volt,
	              overlayColor: AppColors.volt.withValues(alpha: 0.15),
	            ),
            child: Slider(
              min: min,
              max: max,
              divisions: divisions,
              value: value.clamp(min, max),
              onChanged: onChanged,
            ),
          ),
          if (footerLeft != null && footerRight != null)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
	                Text(
	                  footerLeft!.toUpperCase(),
	                  style: AppTextStyles.caps(
	                    size: 10,
	                    weight: FontWeight.w800,
	                    color: AppColors.grey700,
	                  ),
	                ),
	                Text(
	                  footerRight!.toUpperCase(),
	                  style: AppTextStyles.caps(
	                    size: 10,
	                    weight: FontWeight.w800,
	                    color: AppColors.grey700,
	                  ),
	                ),
              ],
            ),
        ],
      ),
    );
  }
}
