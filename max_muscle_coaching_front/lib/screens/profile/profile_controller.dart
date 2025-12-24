import 'package:get/get.dart';

import 'package:max_muscle_coaching_front/controllers/app_controller.dart';
import 'package:max_muscle_coaching_front/repository/user_repository.dart';

class ProfileController extends GetxController {
  final UserRepository _userRepository = Get.find<UserRepository>();

  bool isLoading = false;
  String? errorMessage;

  @override
  void onInit() {
    super.onInit();
    loadProfile();
  }

  Future<void> loadProfile() async {
    final jwtUser = AppController.find.user;
    if (jwtUser == null) return;

    isLoading = true;
    errorMessage = null;
    update();

    try {
      final profile = await _userRepository.profile();
      if (profile != null) {
        AppController.find.user = profile;
        AppController.find.update();
      }
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
      update();
    }
  }

  Future<void> logout() => AppController.find.logout();
}
