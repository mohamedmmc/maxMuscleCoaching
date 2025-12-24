import 'dart:async';

import 'package:flutter/widgets.dart';
import 'package:get/get.dart';

class HomeShellController extends GetxController {
  int currentIndex = 0;
  late final PageController pageController;

  @override
  void onInit() {
    super.onInit();
    pageController = PageController(initialPage: currentIndex);
  }

  void setIndex(int index) {
    if (index == currentIndex) return;
    currentIndex = index;
    update();

    if (!pageController.hasClients) return;
    unawaited(
      pageController.animateToPage(
        index,
        duration: const Duration(milliseconds: 420),
        curve: Curves.easeOutCubic,
      ),
    );
  }

  void onPageChanged(int index) {
    if (index == currentIndex) return;
    currentIndex = index;
    update();
  }

  @override
  void onClose() {
    pageController.dispose();
    super.onClose();
  }
}
