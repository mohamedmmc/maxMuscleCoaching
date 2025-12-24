import 'package:get/get.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:max_muscle_coaching_front/models/user_model.dart';
import 'package:max_muscle_coaching_front/models/workout_models.dart';
import 'package:max_muscle_coaching_front/repository/user_repository.dart';
import 'package:max_muscle_coaching_front/services/connectivity_service.dart';
import 'package:max_muscle_coaching_front/services/shared_preferences.dart';
import 'package:max_muscle_coaching_front/services/snackbar_service.dart';
import 'package:max_muscle_coaching_front/storage/shared_preferences_keys.dart';

class AppController extends GetxController {
  static AppController get find => Get.find<AppController>();

  bool isReady = false;
  bool hasInternet = true;
  User? user;
  List<WorkoutSessionLog> logs = const [];
  ActiveWorkoutSession? activeSession;

  Future<void> init() async {
    hasInternet = await ConnectivityService.hasInternet();
    if (!hasInternet) {
      SnackbarService.showNoInternet();
      isReady = true;
      update();
      return;
    }

    while (!SharedPreferencesService.find.isReady) {
      await Future<void>.delayed(const Duration(milliseconds: 120));
    }

    final jwt = SharedPreferencesService.find.get(jwtKey);
    if (jwt != null) {
      if (JwtDecoder.isExpired(jwt)) {
        SharedPreferencesService.find.removeKey(jwtKey);
      } else {
        user = User.fromToken(JwtDecoder.decode(jwt));
        final remoteUser = await UserRepository.find.getLoggedInUser();
        if (remoteUser != null) user = remoteUser;
      }
    }

    isReady = true;
    update();
  }

  Future<void> refreshConnectivity() async {
    hasInternet = await ConnectivityService.hasInternet();
    if (!hasInternet) {
      SnackbarService.showNoInternet();
      update();
      return;
    }

    if (!isReady) {
      await init();
      return;
    }

    update();

    final jwt = SharedPreferencesService.find.get(jwtKey);
    if (jwt != null && !JwtDecoder.isExpired(jwt)) {
      final remoteUser = await UserRepository.find.getLoggedInUser();
      if (remoteUser != null) {
        user = remoteUser;
        update();
      }
    }
  }

  Future<void> setJwt(String jwt) async {
    SharedPreferencesService.find.add(jwtKey, jwt);
    user = User.fromToken(JwtDecoder.decode(jwt));
    update();

    final remoteUser = await UserRepository.find.getLoggedInUser();
    if (remoteUser != null) {
      user = remoteUser;
      update();
    }
  }

  Future<void> saveActiveSession(ActiveWorkoutSession session) async {
    activeSession = session;
    update();
  }

  Future<void> clearActiveSession() async {
    activeSession = null;
    update();
  }

  Future<void> finishWorkout(WorkoutSessionLog log) async {
    logs = [...logs, log];
    activeSession = null;
    update();
  }

  Future<void> logout() async {
    SharedPreferencesService.find.removeKey(jwtKey);

    logs = const [];
    activeSession = null;
    user = null;
    update();
  }
}
