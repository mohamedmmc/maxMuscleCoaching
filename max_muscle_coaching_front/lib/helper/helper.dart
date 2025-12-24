import 'dart:async';

class Helper {
  static Future<dynamic> waitAndExecute(bool Function() condition, Function callback, {Duration? duration}) async {
    while (!condition()) {
      await Future.delayed(duration ?? const Duration(milliseconds: 800), () {});
    }
    return callback();
  }
}
