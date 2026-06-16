import 'dart:convert';

import 'package:get/get.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:max_muscle_coaching_front/models/user_model.dart';
import 'package:max_muscle_coaching_front/models/workout_models.dart';
import 'package:max_muscle_coaching_front/repository/user_repository.dart';
import 'package:max_muscle_coaching_front/services/connectivity_service.dart';
import 'package:max_muscle_coaching_front/services/secure_token_storage.dart';
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
    final refreshToken = SecureTokenStorage.find.refreshToken;
    if (refreshToken == null || refreshToken.isEmpty) return null;

    final loginDTO = await UserRepository.find.renewJWT(token: {refreshTokenKey: refreshToken});
    final jwt = loginDTO?.token;
    if (jwt == null || jwt.isEmpty) return null;

    await SecureTokenStorage.find.setJwt(jwt);
    final newRefreshToken = loginDTO?.refreshToken;
    if (newRefreshToken != null && newRefreshToken.isNotEmpty) {
      await SecureTokenStorage.find.setRefreshToken(newRefreshToken);
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

    final jwt = SecureTokenStorage.find.jwt;
    if (jwt != null) {
      String? activeJwt = jwt;
      if (JwtDecoder.isExpired(jwt)) {
        activeJwt = await _renewJwtIfPossible();
        if (activeJwt == null) {
          await SecureTokenStorage.find.clear();
        }
      }

      if (activeJwt != null && !JwtDecoder.isExpired(activeJwt)) {
        user = User.fromToken(JwtDecoder.decode(activeJwt));
        final remoteUser = await UserRepository.find.profile();
        if (remoteUser != null) user = remoteUser;
        _rehydrateActiveSession();
      }
    }

    isReady = true;
    update();
  }

  // Restore an in-progress workout from SharedPreferences. Drop sessions
  // older than 24h so a stale row never resurrects after the user has moved
  // on (typical bedtime → next-morning cold-start window).
  static const int _activeSessionMaxAgeMs = 24 * 60 * 60 * 1000;

  void _rehydrateActiveSession() {
    final raw = SharedPreferencesService.find.get(activeSessionKey);
    if (raw == null || raw.isEmpty) return;
    final session = ActiveWorkoutSession.tryParse(raw);
    if (session == null) {
      SharedPreferencesService.find.removeKey(activeSessionKey);
      return;
    }
    final now = DateTime.now().millisecondsSinceEpoch;
    if (now - session.startTimeMs > _activeSessionMaxAgeMs) {
      SharedPreferencesService.find.removeKey(activeSessionKey);
      return;
    }
    activeSession = session;
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

    final jwt = SecureTokenStorage.find.jwt;
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
        final remoteUser = await UserRepository.find.profile();
        if (remoteUser != null) {
          user = remoteUser;
          update();
        }
      }
    }
  }

  Future<void> setJwt(String jwt, {String? refreshToken, bool stayLoggedIn = false}) async {
    await SecureTokenStorage.find.setJwt(jwt);
    if (stayLoggedIn && refreshToken != null && refreshToken.isNotEmpty) {
      await SecureTokenStorage.find.setRefreshToken(refreshToken);
    }
    user = User.fromToken(JwtDecoder.decode(jwt));
    update();

    final remoteUser = await UserRepository.find.profile();
    if (remoteUser != null) {
      user = remoteUser;
      update();
    }
  }

  Future<void> saveActiveSession(ActiveWorkoutSession session) async {
    activeSession = session;
    SharedPreferencesService.find.add(
      activeSessionKey,
      jsonEncode(session.toJson()),
    );
    update();
  }

  Future<void> clearActiveSession() async {
    activeSession = null;
    SharedPreferencesService.find.removeKey(activeSessionKey);
    update();
  }

  Future<void> finishWorkout(WorkoutSessionLog log) async {
    logs = [...logs, log];
    activeSession = null;
    SharedPreferencesService.find.removeKey(activeSessionKey);
    update();
  }

  Future<void> logout() async {
    await SecureTokenStorage.find.clear();

    logs = const [];
    activeSession = null;
    SharedPreferencesService.find.removeKey(activeSessionKey);
    user = null;
    update();
  }
}
