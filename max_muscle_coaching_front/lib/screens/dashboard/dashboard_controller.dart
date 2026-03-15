import 'package:get/get.dart';
import 'package:max_muscle_coaching_front/controllers/app_controller.dart';
import 'package:max_muscle_coaching_front/models/dto/workout_api_models.dart';
import 'package:max_muscle_coaching_front/repository/workout_repository.dart';

class DashboardController extends GetxController {
  final WorkoutRepository _workoutRepository = Get.find<WorkoutRepository>();

  String selectedCategory = 'All';

  bool isLoadingStats = false;
  String? statsErrorMessage;
  WorkoutStatsResponse? stats;

  @override
  void onInit() {
    super.onInit();
    loadWorkoutStats();
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
}
