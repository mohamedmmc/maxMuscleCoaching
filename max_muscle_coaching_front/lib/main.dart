import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:max_muscle_coaching_front/controllers/app_controller.dart';
import 'package:max_muscle_coaching_front/networking/logger_service.dart';
import 'package:max_muscle_coaching_front/repository/user_repository.dart';
import 'package:max_muscle_coaching_front/repository/workout_repository.dart';
import 'package:max_muscle_coaching_front/services/shared_preferences.dart';

import 'app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);

  Get.put(SharedPreferencesService(), permanent: true);
  Get.put(LoggerService(), permanent: true);
  Get.put(UserRepository(), permanent: true);
  Get.put(WorkoutRepository(), permanent: true);

  Get.put<AppController>(AppController(), permanent: true);

  await AppController.find.init();

  runApp(const MaxMuscleApp());
}
