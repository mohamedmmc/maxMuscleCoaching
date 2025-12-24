import 'package:flutter/material.dart';

import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';

class ChartPoint {
  const ChartPoint({required this.label, required this.value});
  final String label;
  final double value;
}

class SimpleAreaChart extends StatelessWidget {
  const SimpleAreaChart({required this.points, super.key});

  final List<ChartPoint> points;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AspectRatio(
          aspectRatio: 16 / 9,
          child: CustomPaint(
            painter: _AreaChartPainter(points: points),
          ),
        ),
        const SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: points
              .map(
                (p) => Expanded(
                  child: Text(
                    p.label,
                    textAlign: TextAlign.center,
                    style: AppTextStyles.label(
                      size: 10,
                      weight: FontWeight.w700,
                      color: AppColors.grey600,
                    ),
                  ),
                ),
              )
              .toList(growable: false),
        ),
      ],
    );
  }
}

class _AreaChartPainter extends CustomPainter {
  _AreaChartPainter({required this.points});

  final List<ChartPoint> points;

  @override
  void paint(Canvas canvas, Size size) {
    if (points.isEmpty) return;

    final padding = const EdgeInsets.fromLTRB(6, 10, 6, 12);
    final chartRect = Rect.fromLTWH(
      padding.left,
      padding.top,
      size.width - padding.left - padding.right,
      size.height - padding.top - padding.bottom,
    );

    final maxValue =
        points.map((p) => p.value).fold<double>(0, (a, b) => a > b ? a : b);
    final safeMax = maxValue <= 0 ? 1 : maxValue;
    final dx = points.length == 1 ? 0.0 : chartRect.width / (points.length - 1);

    Offset pointToOffset(int index) {
      final p = points[index];
      final x = chartRect.left + dx * index;
      final y = chartRect.bottom - (p.value / safeMax) * chartRect.height;
      return Offset(x, y);
    }

    final path = Path()..moveTo(pointToOffset(0).dx, pointToOffset(0).dy);
    for (var i = 1; i < points.length; i++) {
      final o = pointToOffset(i);
      path.lineTo(o.dx, o.dy);
    }

    final fillPath = Path.from(path)
      ..lineTo(pointToOffset(points.length - 1).dx, chartRect.bottom)
      ..lineTo(pointToOffset(0).dx, chartRect.bottom)
      ..close();

    final fillPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          AppColors.volt.withValues(alpha: 0.30),
          AppColors.volt.withValues(alpha: 0.02),
          AppColors.transparent,
        ],
        stops: const [0.0, 0.6, 1.0],
      ).createShader(chartRect);

    canvas.drawPath(fillPath, fillPaint);

    final linePaint = Paint()
      ..color = AppColors.volt
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round;
    canvas.drawPath(path, linePaint);

    final dotPaint = Paint()..color = AppColors.volt;
    for (var i = 0; i < points.length; i++) {
      canvas.drawCircle(pointToOffset(i), 3.2, dotPaint);
    }
  }

  @override
  bool shouldRepaint(covariant _AreaChartPainter oldDelegate) {
    return oldDelegate.points != points;
  }
}
