import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'package:max_muscle_coaching_front/controllers/app_controller.dart';
import 'package:max_muscle_coaching_front/models/models.dart';
import 'package:max_muscle_coaching_front/theme/app_colors.dart';
import 'package:max_muscle_coaching_front/theme/app_text_styles.dart';
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
            final totalWorkouts = logs.length;
            final totalVolume =
                logs.fold<double>(0, (acc, l) => acc + l.totalVolume);
            final avgDuration = totalWorkouts == 0
                ? 0
                : (logs.fold<int>(0, (acc, l) => acc + l.durationMinutes) /
                        totalWorkouts)
                    .round();

            return SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(20, 18, 20, 120),
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
                                ).createShader(const Rect.fromLTWH(0, 0, 260, 60)),
                            ),
                          ),
                        ],
                      ),
                      style: AppTextStyles.display(size: 36, letterSpacing: -1.6),
                    ),
                    const SizedBox(height: 18),
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
                            value: '$avgDuration',
                            suffix: 'm',
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _ChartCard(
                      categories: categories,
                      selectedCategory: selectedCategory,
                      onSelectCategory: dashboard.selectCategory,
                      points: chartPoints,
                    ),
                    const SizedBox(height: 16),
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
                            style: AppTextStyles.caps(color: AppColors.grey600, letterSpacing: 3),
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
