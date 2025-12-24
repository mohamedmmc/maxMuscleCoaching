// import 'package:flutter/foundation.dart';

// import 'storage/app_storage.dart';

// class AppState extends ChangeNotifier {
//   AppState(this._storage);

//   final AppStorage _storage;

//   bool _isReady = false;
//   bool get isReady => _isReady;

//   UserProfile? _user;
//   UserProfile? get user => _user;

//   List<WorkoutSessionLog> _logs = const [];
//   List<WorkoutSessionLog> get logs => _logs;

//   ActiveWorkoutSession? _activeSession;
//   ActiveWorkoutSession? get activeSession => _activeSession;

//   Future<void> init() async {
//     _user = _storage.loadUser();
//     _logs = _storage.loadLogs();
//     _activeSession = _storage.loadActiveSession();
//     _isReady = true;
//     notifyListeners();
//   }

//   Future<void> completeOnboarding(UserProfile profile) async {
//     _user = profile;
//     await _storage.saveUser(profile);
//     notifyListeners();
//   }

//   Future<void> saveActiveSession(ActiveWorkoutSession session) async {
//     _activeSession = session;
//     await _storage.saveActiveSession(session);
//     notifyListeners();
//   }

//   Future<void> clearActiveSession() async {
//     _activeSession = null;
//     await _storage.clearActiveSession();
//     notifyListeners();
//   }

//   Future<void> finishWorkout(WorkoutSessionLog log) async {
//     _logs = [..._logs, log];
//     await _storage.saveLogs(_logs);
//     _activeSession = null;
//     await _storage.clearActiveSession();
//     notifyListeners();
//   }

//   Future<void> logout() async {
//     await _storage.clearUser();
//     await clearActiveSession();
//     _user = null;
//     notifyListeners();
//   }
// }
