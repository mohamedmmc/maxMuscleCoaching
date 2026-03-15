import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:max_muscle_coaching_front/controllers/app_controller.dart';
import 'package:max_muscle_coaching_front/models/models.dart';
import 'package:max_muscle_coaching_front/theme/app_colors.dart';
import 'package:max_muscle_coaching_front/theme/app_text_styles.dart';
import 'package:max_muscle_coaching_front/widgets/glass_dock.dart';
import 'package:max_muscle_coaching_front/widgets/simple_area_chart.dart';

import 'dashboard_controller.dart';

part 'components/active_session_banner.dart';
part 'components/hero_card.dart';
part 'components/stat_card.dart';
part 'components/chart_card.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({required this.onResumeSession, super.key});

  final VoidCallback onResumeSession;

  @override
  Widget build(BuildContext context) {
    return GetBuilder<DashboardController>(
      init: DashboardController(),
      builder: (dashboard) {
        return GetBuilder<AppController>(
          builder: (app) {
            final user = app.user;
            if (user == null) return const SizedBox.shrink();

            final logs = app.logs;
            final hasActiveSession = app.activeSession != null;

            final stats = dashboard.stats;
            final summary = stats?.summary;
            final gamification = stats?.gamification;
            final range = stats?.range;

            final categories = _categoriesFromLogs(logs);
            final selectedCategory =
                categories.contains(dashboard.selectedCategory)
                    ? dashboard.selectedCategory
                    : 'All';

            final filteredLogs = selectedCategory == 'All'
                ? logs
                : logs
                    .where((l) =>
                        (l.category.isEmpty ? 'Uncategorized' : l.category) ==
                        selectedCategory)
                    .toList();

            final chartPoints = _chartPoints(filteredLogs);
            final apiByDay = stats?.byDay ?? const [];
            final apiChartPoints = apiByDay.isEmpty
                ? null
                : apiByDay.length <= 7
                    ? apiByDay
                        .map(
                          (d) => ChartPoint(
                            label: _weekdayShort(d.date),
                            value: ((d.metrics?.completionRate ?? 0) * 100)
                                .clamp(0, 100)
                                .toDouble(),
                          ),
                        )
                        .toList(growable: false)
                    : apiByDay
                        .sublist(apiByDay.length - 7)
                        .map(
                          (d) => ChartPoint(
                            label: _weekdayShort(d.date),
                            value: ((d.metrics?.completionRate ?? 0) * 100)
                                .clamp(0, 100)
                                .toDouble(),
                          ),
                        )
                        .toList(growable: false);

            final totalWorkouts = summary?.sessionsFinished ?? logs.length;
            final totalVolume =
                logs.fold<double>(0, (acc, l) => acc + l.totalVolume);
            final avgDuration = summary?.avgEstimatedDurationMinutes ??
                summary?.avgElapsedMinutesApprox;
            final fallbackAvgDuration = logs.isEmpty
                ? 0
                : (logs.fold<int>(0, (acc, l) => acc + l.durationMinutes) /
                        logs.length)
                    .round();
            final avgDurationLabel =
                avgDuration?.toString() ?? '$fallbackAvgDuration';

            return SafeArea(
              child: SingleChildScrollView(
                padding: EdgeInsets.fromLTRB(
                    20, 18, 20, GlassDock.heightWithinSafeArea(context) + 32),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text.rich(
                      TextSpan(
                        children: [
                          const TextSpan(text: 'Ready to\n'),
                          TextSpan(
                            text: 'Dominate?',
                            style: AppTextStyles.display(
                              size: 36,
                              letterSpacing: -1.6,
                            ).copyWith(
                              foreground: Paint()
                                ..shader = const LinearGradient(
                                  colors: [AppColors.volt, AppColors.greenMint],
                                ).createShader(
                                    const Rect.fromLTWH(0, 0, 260, 60)),
                            ),
                          ),
                        ],
                      ),
                      style:
                          AppTextStyles.display(size: 36, letterSpacing: -1.6),
                    ),
                    const SizedBox(height: 18),
                    if (dashboard.isLoadingStats) ...[
                      const LinearProgressIndicator(minHeight: 2),
                      const SizedBox(height: 12),
                    ] else if (dashboard.statsErrorMessage != null) ...[
                      Text(
                        dashboard.statsErrorMessage!,
                        style: AppTextStyles.label(
                            size: 12, color: AppColors.grey600),
                      ),
                      const SizedBox(height: 12),
                    ],
                    if (hasActiveSession) ...[
                      _ActiveSessionBanner(onTap: onResumeSession),
                      const SizedBox(height: 16),
                    ],
                    _HeroCard(totalVolume: totalVolume),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: _StatCard(
                            icon: Icons.calendar_month_rounded,
                            iconColor: AppColors.volt,
                            label: 'SESSIONS',
                            value: '$totalWorkouts',
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _StatCard(
                            icon: Icons.show_chart_rounded,
                            iconColor: AppColors.purple,
                            label: 'AVG TIME',
                            value: avgDurationLabel,
                            suffix: 'm',
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    if (gamification != null) ...[
                      Row(
                        children: [
                          Expanded(
                            child: _StatCard(
                              icon: Icons.stars_rounded,
                              iconColor: AppColors.volt,
                              label: 'POINTS',
                              value: '${gamification.points}',
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _StatCard(
                              icon: Icons.emoji_events_rounded,
                              iconColor: AppColors.greenMint,
                              label: 'LEVEL',
                              value: '${gamification.level}',
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                    ],
                    _ChartCard(
                      categories: apiChartPoints == null ? categories : null,
                      selectedCategory:
                          apiChartPoints == null ? selectedCategory : null,
                      onSelectCategory: apiChartPoints == null
                          ? dashboard.selectCategory
                          : null,
                      title: apiChartPoints == null
                          ? 'Performance'
                          : 'Completion rate',
                      badgeLabel: apiChartPoints == null
                          ? 'LIVE'
                          : (apiByDay.isEmpty
                              ? 'STATS'
                              : (apiByDay.last.performance?.label
                                      ?.toUpperCase() ??
                                  'STATS')),
                      points: apiChartPoints ?? chartPoints,
                    ),
                    const SizedBox(height: 16),
                    if ((stats?.topMuscles ?? const []).isNotEmpty) ...[
                      Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(28),
                          border: Border.all(color: AppColors.border),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'TOP MUSCLES',
                              style: AppTextStyles.caps(
                                  color: AppColors.grey600, letterSpacing: 2.2),
                            ),
                            const SizedBox(height: 12),
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: (stats!.topMuscles.take(10)).map((m) {
                                final score = m.score;
                                final scoreLabel =
                                    score == score.roundToDouble()
                                        ? score.toStringAsFixed(0)
                                        : score.toStringAsFixed(1);
                                return Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 12, vertical: 10),
                                  decoration: BoxDecoration(
                                    color: AppColors.surfaceHighlight,
                                    borderRadius: BorderRadius.circular(999),
                                  ),
                                  child: Text(
                                    '${m.name.toUpperCase()} • $scoreLabel',
                                    style: AppTextStyles.label(
                                        size: 11,
                                        weight: FontWeight.w900,
                                        letterSpacing: 0.6,
                                        color: AppColors.grey500),
                                  ),
                                );
                              }).toList(growable: false),
                            ),
                            if (range != null) ...[
                              const SizedBox(height: 12),
                              Text(
                                '${range.startDate} → ${range.endDate} (${range.days}d)',
                                style: AppTextStyles.label(
                                    size: 12, color: AppColors.grey600),
                              ),
                            ],
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: AppColors.grey900),
                      ),
                      child: Column(
                        children: [
                          Text(
                            'DAILY MANTRA',
                            style: AppTextStyles.caps(
                                color: AppColors.grey600, letterSpacing: 3),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            '"Pain is just weakness leaving the body."',
                            textAlign: TextAlign.center,
                            style: AppTextStyles.title(
                              size: 18,
                              fontStyle: FontStyle.italic,
                              height: 1.2,
                              letterSpacing: -0.2,
                            ).copyWith(fontFamily: 'serif'),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}

List<String> _categoriesFromLogs(List<WorkoutSessionLog> logs) {
  final set = <String>{};
  for (final l in logs) {
    set.add(l.category.isEmpty ? 'Uncategorized' : l.category);
  }
  final list = set.toList()..sort();
  return ['All', ...list];
}

List<ChartPoint> _chartPoints(List<WorkoutSessionLog> logs) {
  if (logs.isEmpty) {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return labels
        .map((l) => ChartPoint(label: l, value: 0))
        .toList(growable: false);
  }

  final last = logs.length <= 7 ? logs : logs.sublist(logs.length - 7);
  return last
      .map((l) =>
          ChartPoint(label: _weekdayShort(l.dateIso), value: l.totalVolume))
      .toList(growable: false);
}

String _weekdayShort(String iso) {
  final parsed = DateTime.tryParse(iso);
  if (parsed == null) return '';
  return switch (parsed.weekday) {
    DateTime.monday => 'Mon',
    DateTime.tuesday => 'Tue',
    DateTime.wednesday => 'Wed',
    DateTime.thursday => 'Thu',
    DateTime.friday => 'Fri',
    DateTime.saturday => 'Sat',
    DateTime.sunday => 'Sun',
    _ => '',
  };
}
