part of '../dashboard_screen.dart';

class _PersonalRecordsCard extends StatelessWidget {
  const _PersonalRecordsCard({required this.records});

  final List<WorkoutPersonalRecord> records;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      container: true,
      label: records.isEmpty
          ? 'Personal records: none yet'
          : 'Personal records, top ${records.length}',
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
              Icon(
                Icons.emoji_events_rounded,
                color: AppColors.greenMint,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                'PERSONAL RECORDS',
                style: AppTextStyles.caps(
                  color: AppColors.grey600,
                  letterSpacing: 2.2,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          if (records.isEmpty)
            Text(
              'Log a weighted set to start tracking your PRs.',
              style:
                  AppTextStyles.label(size: 13, color: AppColors.grey500),
            )
          else
            for (var i = 0; i < records.length; i++) ...[
              _PrRow(record: records[i], rank: i + 1),
              if (i < records.length - 1)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  child: Container(height: 1, color: AppColors.border),
                ),
            ],
        ],
      ),
      ),
    );
  }
}

class _PrRow extends StatelessWidget {
  const _PrRow({required this.record, required this.rank});

  final WorkoutPersonalRecord record;
  final int rank;

  @override
  Widget build(BuildContext context) {
    final weightLabel = record.weight == record.weight.roundToDouble()
        ? record.weight.toStringAsFixed(0)
        : record.weight.toStringAsFixed(1);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Container(
          width: 28,
          height: 28,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: AppColors.surfaceHighlight,
          ),
          child: Text(
            '$rank',
            style: AppTextStyles.label(
              size: 12,
              weight: FontWeight.w900,
              color: AppColors.grey400,
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                record.name,
                style:
                    AppTextStyles.title(size: 15, letterSpacing: -0.2),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 2),
              Text(
                '${record.reps} rep${record.reps == 1 ? '' : 's'}'
                '${record.dateAchieved != null ? ' · ${record.dateAchieved}' : ''}',
                style: AppTextStyles.label(
                  size: 11,
                  color: AppColors.grey600,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 8),
        Text(
          '$weightLabel kg',
          style: AppTextStyles.title(size: 18, letterSpacing: -0.4)
              .copyWith(color: AppColors.volt),
        ),
      ],
    );
  }
}
