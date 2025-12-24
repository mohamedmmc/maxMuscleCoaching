import 'dart:convert';

import 'package:get/get.dart';
import 'package:max_muscle_coaching_front/controllers/app_controller.dart';
import 'package:max_muscle_coaching_front/models/dto/workout_api_models.dart';
import 'package:max_muscle_coaching_front/networking/api_base_helper.dart';
import 'package:max_muscle_coaching_front/networking/api_exceptions.dart';
import 'package:max_muscle_coaching_front/networking/logger_service.dart';
import 'package:max_muscle_coaching_front/services/snackbar_service.dart';

class WorkoutRepository extends GetxService {
  static WorkoutRepository get find => Get.find<WorkoutRepository>();

  Future<FinishWorkoutResponse?> finishWorkoutHistory({required int workoutHistoryId}) async {
    try {
      final result = await ApiBaseHelper().request(
        RequestType.post,
        '/workouts/history/$workoutHistoryId/finish',
        sendToken: true,
        body: const <String, dynamic>{},
      );
      if (result is Map) return FinishWorkoutResponse.fromJson(result.cast<String, dynamic>());
      return null;
    } on BadRequestException catch (e) {
      return FinishWorkoutResponse(
        workoutHistoryId: workoutHistoryId,
        completed: false,
        message: e.message?.toString(),
      );
    } on NotFoundException {
      return FinishWorkoutResponse(
        workoutHistoryId: workoutHistoryId,
        completed: false,
        message: 'not_found',
      );
    } on UnauthorisedException {
      SnackbarService.showError(title: 'Session expired', message: 'Please login again.');
      await AppController.find.logout();
      return null;
    } catch (e) {
      LoggerService.logger?.e('Error occured in finishWorkoutHistory:\n$e');
      return null;
    }
  }

  Future<TodayWorkoutResponse?> getTodayWorkout() async {
    try {
      final result = await ApiBaseHelper().request(RequestType.get, '/workouts/today', sendToken: true);
      if (result is Map) return TodayWorkoutResponse.fromJson(result.cast<String, dynamic>());
      return null;
    } on BadRequestException catch (e) {
      final msg = e.message?.toString().trim();
      if (msg == 'work_already_done') {
        return const TodayWorkoutResponse(restDay: false, message: 'work_already_done');
      }
      LoggerService.logger?.e('Bad request in getTodayWorkout:\n$e');
      return null;
    } on ConflictException catch (e) {
      final body = e.message?.toString().trim();
      String? msg;
      if (body != null && body.isNotEmpty) {
        if (body == 'work_already_done' || body.contains('work_already_done')) {
          msg = 'work_already_done';
        } else {
          try {
            final decoded = jsonDecode(body);
            if (decoded is Map && decoded['message'] != null) msg = decoded['message']?.toString().trim();
          } catch (_) {
            msg = null;
          }
        }
      }

      if (msg == 'work_already_done') {
        return const TodayWorkoutResponse(restDay: false, message: 'work_already_done');
      }
      LoggerService.logger?.e('Conflict in getTodayWorkout:\n$e');
      return null;
    } on UnauthorisedException {
      SnackbarService.showError(title: 'Session expired', message: 'Please login again.');
      await AppController.find.logout();
      return null;
    } catch (e) {
      LoggerService.logger?.e('Error occured in getTodayWorkout:\n$e');
      return null;
    }
  }

  Future<RecommendedWorkoutsResponse?> getRecommendedWorkouts() async {
    try {
      final result = await ApiBaseHelper().request(RequestType.get, '/workouts/recommended', sendToken: true);
      if (result is Map) return RecommendedWorkoutsResponse.fromJson(result.cast<String, dynamic>());
      return null;
    } on UnauthorisedException {
      SnackbarService.showError(title: 'Session expired', message: 'Please login again.');
      await AppController.find.logout();
      return null;
    } catch (e) {
      LoggerService.logger?.e('Error occured in getRecommendedWorkouts:\n$e');
      return null;
    }
  }

  Future<WorkoutHistoryListResponse?> getWorkoutHistory({int limit = 20, int offset = 0}) async {
    try {
      final result = await ApiBaseHelper().request(RequestType.get, '/workouts/history?limit=$limit&offset=$offset', sendToken: true);
      if (result is Map) return WorkoutHistoryListResponse.fromJson(result.cast<String, dynamic>());
      return null;
    } on UnauthorisedException {
      SnackbarService.showError(title: 'Session expired', message: 'Please login again.');
      await AppController.find.logout();
      return null;
    } catch (e) {
      LoggerService.logger?.e('Error occured in getWorkoutHistory:\n$e');
      return null;
    }
  }

  Future<WorkoutHistory?> getWorkoutHistoryDetail({required int workoutHistoryId}) async {
    try {
      final result = await ApiBaseHelper().request(RequestType.get, '/workouts/history/$workoutHistoryId', sendToken: true);
      if (result is Map) return WorkoutHistory.fromJson(result.cast<String, dynamic>());
      return null;
    } on UnauthorisedException {
      SnackbarService.showError(title: 'Session expired', message: 'Please login again.');
      await AppController.find.logout();
      return null;
    } catch (e) {
      LoggerService.logger?.e('Error occured in getWorkoutHistoryDetail:\n$e');
      return null;
    }
  }

  Future<UpdateExerciseProgressResponse?> updateExerciseProgress({
    required int workoutHistoryId,
    required int exerciseId,
    required List<PerformedSet> performedSets,
    bool? completed,
  }) async {
    try {
      final body = <String, dynamic>{
        'performedSets': performedSets.map((s) => s.toJson()).toList(growable: false),
        if (completed != null) 'completed': completed,
      };

      final result = await ApiBaseHelper().request(
        RequestType.put,
        '/workouts/history/$workoutHistoryId/exercises/$exerciseId',
        sendToken: true,
        body: body,
      );

      if (result is Map) return UpdateExerciseProgressResponse.fromJson(result.cast<String, dynamic>());
      if (result is int) return const UpdateExerciseProgressResponse();
      return null;
    } on UnauthorisedException {
      SnackbarService.showError(title: 'Session expired', message: 'Please login again.');
      await AppController.find.logout();
      return null;
    } catch (e) {
      LoggerService.logger?.e('Error occured in updateExerciseProgress:\n$e');
      return null;
    }
  }
}
