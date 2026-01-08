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

  Future<String?> _renewJwtIfPossible() async {
    final refreshToken = SharedPreferencesService.find.get(refreshTokenKey);
    if (refreshToken == null || refreshToken.isEmpty) return null;

    final loginDTO = await UserRepository.find.renewJWT(token: {refreshTokenKey: refreshToken});
    final jwt = loginDTO?.token;
    if (jwt == null || jwt.isEmpty) return null;

    SharedPreferencesService.find.add(jwtKey, jwt);
    final newRefreshToken = loginDTO?.refreshToken;
    if (newRefreshToken != null && newRefreshToken.isNotEmpty) {
      SharedPreferencesService.find.add(refreshTokenKey, newRefreshToken);
    }
    return jwt;
  }

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
      String? activeJwt = jwt;
      if (JwtDecoder.isExpired(jwt)) {
        activeJwt = await _renewJwtIfPossible();
        if (activeJwt == null) {
          SharedPreferencesService.find.removeKey(jwtKey);
          SharedPreferencesService.find.removeKey(refreshTokenKey);
        }
      }

      if (activeJwt != null && !JwtDecoder.isExpired(activeJwt)) {
        user = User.fromToken(JwtDecoder.decode(activeJwt));
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
    if (jwt != null) {
      String? activeJwt = jwt;
      if (JwtDecoder.isExpired(jwt)) {
        activeJwt = await _renewJwtIfPossible();
        if (activeJwt == null) {
          await logout();
          return;
        }
      }
      if (!JwtDecoder.isExpired(activeJwt)) {
        final remoteUser = await UserRepository.find.getLoggedInUser();
        if (remoteUser != null) {
          user = remoteUser;
          update();
        }
      }
    }
  }

  Future<void> setJwt(String jwt, {String? refreshToken, bool stayLoggedIn = false}) async {
    SharedPreferencesService.find.add(jwtKey, jwt);
    if (stayLoggedIn && refreshToken != null && refreshToken.isNotEmpty) {
      SharedPreferencesService.find.add(refreshTokenKey, refreshToken);
    } else {
      SharedPreferencesService.find.removeKey(refreshTokenKey);
    }
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
    SharedPreferencesService.find.removeKey(refreshTokenKey);

    logs = const [];
    activeSession = null;
    user = null;
    update();
  }
}
