import 'dart:async';
import 'dart:io';

class ConnectivityService {
  ConnectivityService._();

  static const Duration defaultTimeout = Duration(seconds: 3);

  static Future<bool> hasInternet({Duration timeout = defaultTimeout}) async {
    try {
      final result = await InternetAddress.lookup('example.com').timeout(timeout);
      return result.isNotEmpty && result.first.rawAddress.isNotEmpty;
    } on SocketException {
      return false;
    } on TimeoutException {
      return false;
    } catch (_) {
      return false;
    }
  }
}

