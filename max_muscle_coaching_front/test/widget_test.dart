// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:max_muscle_coaching_front/app.dart';
import 'package:max_muscle_coaching_front/controllers/app_controller.dart';
import 'package:max_muscle_coaching_front/networking/logger_service.dart';
import 'package:max_muscle_coaching_front/repository/user_repository.dart';
import 'package:max_muscle_coaching_front/services/shared_preferences.dart';

void main() {
  tearDown(Get.reset);

  testWidgets('Shows login when no user', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues({});
    Get.put(SharedPreferencesService());
    Get.put(LoggerService());
    Get.put(UserRepository());

    final appController = AppController()
      ..isReady = true
      ..hasInternet = true
      ..user = null;
    Get.put<AppController>(appController);

    await tester.pumpWidget(const MaxMuscleApp());
    await tester.pumpAndSettle();

    expect(find.text('LOGIN'), findsOneWidget);
  });
}
