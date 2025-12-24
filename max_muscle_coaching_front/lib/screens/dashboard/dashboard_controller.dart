import 'package:get/get.dart';

class DashboardController extends GetxController {
  String selectedCategory = 'All';

  void selectCategory(String category) {
    if (category == selectedCategory) return;
    selectedCategory = category;
    update();
  }
}

