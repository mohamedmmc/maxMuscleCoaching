import 'dart:async';

import 'package:get/get.dart';

import 'package:max_muscle_coaching_front/controllers/app_controller.dart';
import 'package:max_muscle_coaching_front/models/dto/workout_api_models.dart';
import 'package:max_muscle_coaching_front/models/models.dart';
import 'package:max_muscle_coaching_front/networking/api_base_helper.dart';
import 'package:max_muscle_coaching_front/repository/workout_repository.dart';

class WorkoutController extends GetxController {
  final WorkoutRepository _workoutRepository = Get.find<WorkoutRepository>();

  static const String restTimerUpdateId = 'rest_timer';

  DailyWorkout? workout;
  bool loading = true;
  bool active = false;
  bool finishing = false;
  bool workoutAlreadyDone = false;
  String? emptyStateMessage;
  String? finishErrorMessage;
  FinishWorkoutStreak? lastFinishStreak;
  int? startTimeMs;
  List<ExerciseLog> exerciseLogs = const [];
  int? _workoutHistoryId;
  Timer? _restTimer;
  int? _restEndTimeMs;
  int? _restFromExerciseIndex;
  int? _restInitialSeconds;

  bool get isRestTimerActive => _restEndTimeMs != null && DateTime.now().millisecondsSinceEpoch < _restEndTimeMs!;

  int get restRemainingSeconds {
    final endTimeMs = _restEndTimeMs;
    if (endTimeMs == null) return 0;
    final remainingMs = endTimeMs - DateTime.now().millisecondsSinceEpoch;
    if (remainingMs <= 0) return 0;
    return (remainingMs / 1000).ceil();
  }

  int? get restFromExerciseIndex => _restFromExerciseIndex;
  int? get restInitialSeconds => _restInitialSeconds;

  @override
  void onInit() {
    super.onInit();
    unawaited(_initWorkout());
  }

  @override
  void onClose() {
    _restTimer?.cancel();
    _restTimer = null;
    super.onClose();
  }

  Future<void> _initWorkout() async {
    final user = AppController.find.user;
    if (user == null) {
      loading = false;
      update();
      return;
    }

    loading = true;
    workoutAlreadyDone = false;
    emptyStateMessage = null;
    update();

    final session = AppController.find.activeSession;
    if (session != null) {
      workout = session.workout;
      startTimeMs = session.startTimeMs;
      exerciseLogs = session.exerciseLogs;
      active = true;
      _restoreRestTimer(session.restEndTimeMs);
      loading = false;
      update();
      return;
    }

    final today = await _workoutRepository.getTodayWorkout();
    if (today == null) {
      workout = null;
      exerciseLogs = const [];
      _workoutHistoryId = null;
      active = false;
      startTimeMs = null;
      loading = false;
      emptyStateMessage = 'Failed to load workout.';
      update();
      return;
    }

    final todayMessage = today.message?.toString().trim();
    if (todayMessage == 'work_already_done' || (todayMessage?.contains('work_already_done') ?? false)) {
      workout = null;
      exerciseLogs = const [];
      _workoutHistoryId = null;
      active = false;
      startTimeMs = null;
      loading = false;
      workoutAlreadyDone = true;
      emptyStateMessage = 'Workout already completed today.';
      update();
      return;
    }

    _workoutHistoryId = today.workoutHistoryId;
    final mapped = _mapTodayWorkoutToUi(today);
    workout = mapped.workout;
    exerciseLogs = mapped.exerciseLogs;
    active = false;
    startTimeMs = null;
    _clearRestTimer(notify: false);
    loading = false;
    update();
  }

  void start() {
    final w = workout;
    if (w == null) return;

    final now = DateTime.now().millisecondsSinceEpoch;
    final session = _buildActiveSession(workout: w, startTimeMs: now, exerciseLogs: exerciseLogs);

    active = true;
    startTimeMs = now;
    update();

    unawaited(AppController.find.saveActiveSession(session));
  }

  void onExerciseCompleted(int exerciseIndex) {
    final w = workout;
    if (!active || w == null) return;
    if (exerciseIndex < 0 || exerciseIndex >= w.exercises.length) return;

    final restSeconds = w.exercises[exerciseIndex].restSeconds ?? 0;
    if (restSeconds <= 0) return;
    _startRestTimer(seconds: restSeconds, fromExerciseIndex: exerciseIndex);
  }

  void adjustRestTimerBySeconds(int deltaSeconds) {
    final endTimeMs = _restEndTimeMs;
    if (endTimeMs == null) return;

    final nowMs = DateTime.now().millisecondsSinceEpoch;
    final nextEndTimeMs = endTimeMs + (deltaSeconds * 1000);
    if (nextEndTimeMs <= nowMs) {
      _clearRestTimer(notify: true);
      return;
    }

    _restEndTimeMs = nextEndTimeMs;
    update([restTimerUpdateId]);
    _persistActiveSession();
  }

  void logSet(int exerciseIndex, int setIndex, double weight, double reps) {
    final w = workout;
    if (w == null) return;

    final updated = [...exerciseLogs];
    if (exerciseIndex >= updated.length) return;

    final current = updated[exerciseIndex];
    final sets = [...current.sets];
    final setNumber = setIndex + 1;
    final setLog = WorkoutSetLog(
      setNumber: setNumber,
      reps: reps,
      weight: weight,
      completed: true,
    );

    final existingIndex = sets.indexWhere((s) => s.setNumber == setNumber);
    if (existingIndex >= 0) {
      sets[existingIndex] = setLog;
    } else {
      sets.add(setLog);
    }
    sets.sort((a, b) => a.setNumber.compareTo(b.setNumber));
    updated[exerciseIndex] = current.copyWith(sets: sets);

    exerciseLogs = updated;
    update();

    _persistActiveSession(overrideWorkout: w, overrideExerciseLogs: updated);

    unawaited(_syncExerciseProgress(exerciseIndex));
  }

  void addSet(int exerciseIndex) {
    _updateExerciseSetCount(exerciseIndex, delta: 1);
  }

  void removeSet(int exerciseIndex) {
    _updateExerciseSetCount(exerciseIndex, delta: -1);
  }

  void removeSetAt(int exerciseIndex, int setIndex) {
    final w = workout;
    if (w == null) return;
    if (exerciseIndex < 0 || exerciseIndex >= w.exercises.length) return;

    final currentExercise = w.exercises[exerciseIndex];
    if (currentExercise.sets <= 1) return;
    if (setIndex < 0 || setIndex >= currentExercise.sets) return;

    final nextSets = (currentExercise.sets - 1).clamp(1, 999).toInt();
    final removedSetNumber = setIndex + 1;

    final updatedExercises = [...w.exercises];
    updatedExercises[exerciseIndex] = currentExercise.copyWith(sets: nextSets);
    final updatedWorkout = w.copyWith(exercises: updatedExercises);

    final updatedLogs = [...exerciseLogs];
    if (exerciseIndex >= 0 && exerciseIndex < updatedLogs.length) {
      final currentLog = updatedLogs[exerciseIndex];
      final shifted = <WorkoutSetLog>[];
      for (final s in currentLog.sets) {
        if (s.setNumber == removedSetNumber) continue;
        var nextNumber = s.setNumber;
        if (nextNumber > removedSetNumber) nextNumber -= 1;
        if (nextNumber <= nextSets) {
          shifted.add(
            WorkoutSetLog(
              setNumber: nextNumber,
              reps: s.reps,
              weight: s.weight,
              completed: s.completed,
            ),
          );
        }
      }
      shifted.sort((a, b) => a.setNumber.compareTo(b.setNumber));
      updatedLogs[exerciseIndex] = currentLog.copyWith(sets: shifted);
    }

    workout = updatedWorkout;
    exerciseLogs = updatedLogs;
    update();

    _persistActiveSession(overrideWorkout: updatedWorkout, overrideExerciseLogs: updatedLogs);
    unawaited(_syncExerciseProgress(exerciseIndex));
  }

  void _updateExerciseSetCount(int exerciseIndex, {required int delta}) {
    final w = workout;
    if (w == null) return;
    if (exerciseIndex < 0 || exerciseIndex >= w.exercises.length) return;

    final currentExercise = w.exercises[exerciseIndex];
    final nextSets = (currentExercise.sets + delta).clamp(1, 999).toInt();
    if (nextSets == currentExercise.sets) return;

    final updatedExercises = [...w.exercises];
    updatedExercises[exerciseIndex] = currentExercise.copyWith(sets: nextSets);
    final updatedWorkout = w.copyWith(exercises: updatedExercises);

    final updatedLogs = [...exerciseLogs];
    if (exerciseIndex >= 0 && exerciseIndex < updatedLogs.length) {
      final currentLog = updatedLogs[exerciseIndex];
      final trimmed = currentLog.sets.where((s) => s.setNumber <= nextSets).toList(growable: false);
      updatedLogs[exerciseIndex] = currentLog.copyWith(sets: trimmed);
    }

    workout = updatedWorkout;
    exerciseLogs = updatedLogs;
    update();

    _persistActiveSession(overrideWorkout: updatedWorkout, overrideExerciseLogs: updatedLogs);

    unawaited(_syncExerciseProgress(exerciseIndex));
  }

  Future<bool> finish() async {
    final workoutHistoryId = _workoutHistoryId;
    final w = workout;
    if (workoutHistoryId == null || w == null) return false;

    finishing = true;
    finishErrorMessage = null;
    update();

    try {
      final response = await _workoutRepository.finishWorkoutHistory(workoutHistoryId: workoutHistoryId);
      if (response == null) return false;

      final msg = response.message?.toString().trim();
      if (msg == 'workout_not_completed') {
        finishErrorMessage = 'Complete all exercises before finishing.';
        return false;
      }
      if (msg == 'not_found') {
        finishErrorMessage = 'Workout not found.';
        return false;
      }
      if (msg == 'work_already_done' || (msg?.contains('work_already_done') ?? false)) {
        workoutAlreadyDone = true;
        emptyStateMessage = 'Workout already completed today.';
      }

      lastFinishStreak = response.streak;

      await AppController.find.clearActiveSession();
      active = false;
      startTimeMs = null;
      _clearRestTimer(notify: false);
      update();
      return response.completed == true || msg == 'work_already_done';
    } finally {
      finishing = false;
      update();
    }
  }

  ActiveWorkoutSession _buildActiveSession({
    required DailyWorkout workout,
    required int startTimeMs,
    required List<ExerciseLog> exerciseLogs,
  }) {
    return ActiveWorkoutSession(
      workout: workout,
      startTimeMs: startTimeMs,
      exerciseLogs: exerciseLogs,
      restEndTimeMs: _restEndTimeMs,
    );
  }

  void _persistActiveSession({DailyWorkout? overrideWorkout, List<ExerciseLog>? overrideExerciseLogs}) {
    final w = overrideWorkout ?? workout;
    final start = startTimeMs;
    if (!active || w == null || start == null) return;

    final session = _buildActiveSession(
      workout: w,
      startTimeMs: start,
      exerciseLogs: overrideExerciseLogs ?? exerciseLogs,
    );
    unawaited(AppController.find.saveActiveSession(session));
  }

  void _restoreRestTimer(int? restEndTimeMs) {
    _restEndTimeMs = restEndTimeMs;
    if (!isRestTimerActive) {
      _clearRestTimer(notify: false);
      return;
    }
    _startRestTicker();
  }

  void _startRestTimer({required int seconds, required int fromExerciseIndex}) {
    if (seconds <= 0) return;
    final nowMs = DateTime.now().millisecondsSinceEpoch;
    _restEndTimeMs = nowMs + (seconds * 1000);
    _restFromExerciseIndex = fromExerciseIndex;
    _restInitialSeconds = seconds;
    _startRestTicker();
    update();
    _persistActiveSession();
  }

  void _startRestTicker() {
    _restTimer?.cancel();
    _restTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!isRestTimerActive) {
        _clearRestTimer(notify: true);
        return;
      }
      update([restTimerUpdateId]);
    });
    update([restTimerUpdateId]);
  }

  void _clearRestTimer({required bool notify}) {
    _restTimer?.cancel();
    _restTimer = null;
    _restEndTimeMs = null;
    _restFromExerciseIndex = null;
    _restInitialSeconds = null;
    if (notify) update();
    _persistActiveSession();
  }

  Future<void> _syncExerciseProgress(int exerciseIndex) async {
    final workoutHistoryId = _workoutHistoryId;
    final w = workout;
    if (workoutHistoryId == null || w == null) return;
    if (exerciseIndex < 0 || exerciseIndex >= exerciseLogs.length) return;
    if (exerciseIndex >= w.exercises.length) return;

    final exerciseId = int.tryParse(exerciseLogs[exerciseIndex].exerciseId);
    if (exerciseId == null) return;

    final plannedSets = w.exercises[exerciseIndex].sets;
    final performed = exerciseLogs[exerciseIndex].sets
        .where((s) => s.completed)
        .map(
          (s) => PerformedSet(
            setNumber: s.setNumber,
            reps: s.reps.round(),
            weight: s.weight,
          ),
        )
        .toList(growable: false);

    final completed = plannedSets > 0 && performed.length >= plannedSets;

    await _workoutRepository.updateExerciseProgress(
      workoutHistoryId: workoutHistoryId,
      exerciseId: exerciseId,
      performedSets: performed,
      completed: completed,
    );
  }

  static _MappedTodayWorkout _mapTodayWorkoutToUi(TodayWorkoutResponse today) {
    final apiBase = ApiBaseHelper();
    final weekday = _weekdayLabelFromIso(today.dateAssigned);
    final focus = (today.template?.focus?.trim().isNotEmpty ?? false)
        ? today.template!.focus!.trim()
        : (today.template?.name?.trim().isNotEmpty ?? false)
            ? today.template!.name!.trim()
            : 'Workout';
    final category = (today.template?.category?.trim().isNotEmpty ?? false) ? today.template!.category!.trim() : focus;

    final sourceExercises = _sourceExercises(today);
    final exercises = sourceExercises
        .map(
          (ex) {
            final galleryLinks = ex.exercise?.galleryLinks ?? const <String>[];
            final galleryUrls = galleryLinks.map(apiBase.getExerciceImage).where((u) => u.isNotEmpty).toList(growable: false);
            final fallbackUrl = apiBase.getExerciceImage(ex.exercise?.imageUrl ?? '');
            final imageUrls = galleryUrls.isNotEmpty
                ? galleryUrls
                : <String>[
                    if (fallbackUrl.isNotEmpty) fallbackUrl,
                  ].toList(growable: false);

            return Exercise(
              id: (ex.exerciseId ?? ex.exercise?.id ?? 0).toString(),
              name: ex.exercise?.name ?? 'Exercise',
              targetMuscle: ex.exercise?.targetMuscle ?? '',
              sets: (ex.plannedSets ?? 0) > 0 ? ex.plannedSets! : 1,
              reps: ex.plannedReps ?? '',
              imageUrls: imageUrls,
              instructions: (ex.exercise?.instructions.isNotEmpty ?? false) ? ex.exercise!.instructions : _instructionsFromNotes(ex.notes),
              force: ex.exercise?.force,
              level: ex.exercise?.level,
              mechanic: ex.exercise?.mechanic,
              equipment: ex.exercise?.equipment,
              exerciseCategory: ex.exercise?.category,
              restSeconds: ex.restSeconds,
              notes: ex.notes,
              orderIndex: ex.orderIndex,
              createdAt: ex.exercise?.createdAt,
              updatedAt: ex.exercise?.updatedAt,
            );
          },
        )
        .toList(growable: false);

    final progressByExerciseId = <int, WorkoutHistoryExerciseProgress>{};
    for (final p in today.exerciseProgress) {
      final id = p.exerciseId;
      if (id != null) progressByExerciseId[id] = p;
    }

    final initialLogs = exercises
        .map((ex) {
          final id = int.tryParse(ex.id);
          final progress = id == null ? null : progressByExerciseId[id];
          final sets = <WorkoutSetLog>[];

          final performed = progress?.performedSets ?? const <PerformedSet>[];
          for (final entry in performed.asMap().entries) {
            final set = entry.value;
            final setNumber = set.setNumber ?? (entry.key + 1);
            sets.add(
              WorkoutSetLog(
                setNumber: setNumber,
                reps: set.reps.toDouble(),
                weight: (set.weight ?? 0).toDouble(),
                completed: true,
              ),
            );
          }
          sets.sort((a, b) => a.setNumber.compareTo(b.setNumber));

          return ExerciseLog(exerciseId: ex.id, exerciseName: ex.name, sets: sets);
        })
        .toList(growable: false);

    return _MappedTodayWorkout(
      workout: DailyWorkout(
        dayOfWeek: weekday,
        focus: focus,
        category: category,
        isRestDay: today.restDay,
        exercises: today.restDay ? const <Exercise>[] : exercises,
        dateAssigned: today.dateAssigned,
        workoutHistoryId: today.workoutHistoryId,
        template: today.template == null
            ? null
            : WorkoutTemplateInfo(
                id: today.template!.id,
                name: today.template!.name,
                dayOfWeek: today.template!.dayOfWeek,
                focus: today.template!.focus,
                category: today.template!.category,
                split: today.template!.split,
                fitnessLevel: today.template!.fitnessLevel,
                location: today.template!.location,
                isRestDay: today.template!.isRestDay,
                estimatedDurationMinutes: today.template!.estimatedDurationMinutes,
                description: today.template!.description,
                createdAt: today.template!.createdAt,
                updatedAt: today.template!.updatedAt,
              ),
      ),
      exerciseLogs: today.restDay ? const <ExerciseLog>[] : initialLogs,
    );
  }

  static List<WorkoutExercise> _sourceExercises(TodayWorkoutResponse today) {
    final fromTemplate = [...(today.template?.exercises ?? const <WorkoutExercise>[])];
    if (fromTemplate.isNotEmpty) {
      fromTemplate.sort((a, b) => (a.orderIndex ?? 1 << 30).compareTo(b.orderIndex ?? 1 << 30));
      return fromTemplate;
    }

    final fromProgress = today.exerciseProgress
        .map(
          (p) => WorkoutExercise(
            exercise: p.exercise,
            exerciseId: p.exerciseId,
            orderIndex: p.orderIndex,
            plannedSets: p.plannedSets,
            plannedReps: p.plannedReps,
          ),
        )
        .toList(growable: false);

    fromProgress.sort((a, b) => (a.orderIndex ?? 1 << 30).compareTo(b.orderIndex ?? 1 << 30));
    return fromProgress;
  }

  static String _weekdayLabelFromIso(String? iso) {
    final dt = iso == null ? null : DateTime.tryParse(iso);
    final weekday = dt?.weekday ?? DateTime.now().weekday;
    switch (weekday) {
      case DateTime.monday:
        return 'Monday';
      case DateTime.tuesday:
        return 'Tuesday';
      case DateTime.wednesday:
        return 'Wednesday';
      case DateTime.thursday:
        return 'Thursday';
      case DateTime.friday:
        return 'Friday';
      case DateTime.saturday:
        return 'Saturday';
      case DateTime.sunday:
        return 'Sunday';
      default:
        return '';
    }
  }

  static List<String> _instructionsFromNotes(String? notes) {
    final raw = notes?.trim();
    if (raw == null || raw.isEmpty) return const <String>[];
    return raw
        .split(RegExp(r'\r?\n'))
        .map((l) => l.trim())
        .where((l) => l.isNotEmpty)
        .toList(growable: false);
  }

}

class _MappedTodayWorkout {
  const _MappedTodayWorkout({
    required this.workout,
    required this.exerciseLogs,
  });

  final DailyWorkout workout;
  final List<ExerciseLog> exerciseLogs;
}
