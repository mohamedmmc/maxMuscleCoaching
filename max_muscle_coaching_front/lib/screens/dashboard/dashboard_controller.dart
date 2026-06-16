import 'package:get/get.dart';
import 'package:max_muscle_coaching_front/controllers/app_controller.dart';
import 'package:max_muscle_coaching_front/models/dto/bodyweight_entry.dart';
import 'package:max_muscle_coaching_front/models/dto/workout_api_models.dart';
import 'package:max_muscle_coaching_front/repository/user_repository.dart';
import 'package:max_muscle_coaching_front/repository/workout_repository.dart';

class DashboardController extends GetxController {
  final WorkoutRepository _workoutRepository = Get.find<WorkoutRepository>();
  final UserRepository _userRepository = Get.find<UserRepository>();

  String selectedCategory = 'All';

  bool isLoadingStats = false;
  String? statsErrorMessage;
  WorkoutStatsResponse? stats;

  bool isLoadingBodyweight = false;
  List<BodyweightEntry> bodyweightHistory = const [];

  @override
  void onInit() {
    super.onInit();
    loadWorkoutStats();
    loadBodyweightHistory();
  }

  void selectCategory(String category) {
    if (category == selectedCategory) return;
    selectedCategory = category;
    update();
  }

  Future<void> loadWorkoutStats({
    int days = 30,
    int topMusclesLimit = 10,
  }) async {
    if (AppController.find.user == null) return;
    if (isLoadingStats) return;

    isLoadingStats = true;
    statsErrorMessage = null;
    update();

    try {
      stats = await _workoutRepository.getWorkoutStats(
          days: days, topMusclesLimit: topMusclesLimit);
    } catch (e) {
      statsErrorMessage = e.toString();
    } finally {
      isLoadingStats = false;
      update();
    }
  }

  Future<void> loadBodyweightHistory({int days = 90}) async {
    if (AppController.find.user == null) return;
    if (isLoadingBodyweight) return;
    isLoadingBodyweight = true;
    update();
    try {
      bodyweightHistory = await _userRepository.listBodyweight(days: days);
    } finally {
      isLoadingBodyweight = false;
      update();
    }
  }

  Future<bool> logBodyweight(double weight) async {
    final entry = await _userRepository.logBodyweight(weight: weight);
    if (entry == null) return false;
    bodyweightHistory = [...bodyweightHistory, entry];
    update();
    return true;
  }
}
