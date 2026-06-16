import 'dart:convert';
import 'package:http/http.dart' as http;

import 'package:cross_file/cross_file.dart';
import 'package:flutter/foundation.dart';
import 'package:get/get.dart';
import 'package:max_muscle_coaching_front/helper/helper.dart';
import 'package:max_muscle_coaching_front/networking/logger_service.dart';
import 'package:max_muscle_coaching_front/services/connectivity_service.dart';
import 'package:max_muscle_coaching_front/services/secure_token_storage.dart';
import 'package:max_muscle_coaching_front/services/shared_preferences.dart';
import 'package:max_muscle_coaching_front/services/snackbar_service.dart';
import 'package:max_muscle_coaching_front/storage/shared_preferences_keys.dart';
import 'api_exceptions.dart';

enum RequestType { get, post, delete, put }

extension RequestTypeExtension on RequestType {
  static RequestType fromString(String? value) {
    switch (value?.toLowerCase()) {
      case 'get':
        return RequestType.get;
      case 'post':
        return RequestType.post;
      case 'delete':
        return RequestType.delete;
      case 'put':
        return RequestType.put;
      default:
        return RequestType.get;
    }
  }
}

const String ip = '192.168.1.20';
// const String ip = '192.168.100.8';

const String baseUrlLocalWeb = 'http://localhost:3001'; // web localhost
const String baseUrlLocalAndroid = 'http://$ip:3001'; // android localhost
const String baseUrlLocalIos = 'http://$ip:3001'; // ios localhost
const String realDevice = 'http://$ip:3001'; // real device ip address
const String baseUrlRemote = 'https://api.thelandlord.tn'; // remote
// const String baseUrlRemote = 'https://api-test.thelandlord.tn'; // remote
String _lastRequestedUrl = '';

class ApiBaseHelper extends GetxController {
  static ApiBaseHelper get find => Get.find<ApiBaseHelper>();
  static Future<bool>? _tokenRefreshInFlight;
  // final String baseUrl = baseUrlLocalWeb;
  final String baseUrl = kReleaseMode
      ? baseUrlRemote
      : kIsWeb
          ? baseUrlLocalWeb
          : GetPlatform.isAndroid
              ? baseUrlLocalAndroid
              : GetPlatform.isIOS
                  ? baseUrlLocalIos
                  : '';
  bool _isLoading = false;
  bool blockRequest = false;
  final _defaultHeader = {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'Access-Control-Allow-Credentials': 'true', // Required for cookies, authorization headers with HTTPS
    'Access-Control-Allow-Headers': 'Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE',
    'Content-type': 'application/json',
    'charset': 'UTF-8',
  };

  bool get isLoading => _isLoading;

  set isLoading(bool value) {
    _isLoading = value;
    update();
  }

  String? getToken() => SecureTokenStorage.find.jwt;

  bool _isAuthFailure(http.Response response) {
    if (response.statusCode == 401) return true;
    if (response.statusCode != 403) return false;

    final body = response.body;
    if (body.contains('session_expired') || body.contains('jwt_expired')) return true;
    try {
      final decoded = jsonDecode(body);
      if (decoded is Map && decoded['message'] != null) {
        final message = decoded['message']?.toString() ?? '';
        return message.contains('session_expired') || message.contains('jwt_expired');
      }
    } catch (_) {}
    return false;
  }

  Future<bool> _refreshAccessToken() async {
    if (_tokenRefreshInFlight != null) return _tokenRefreshInFlight!;

    _tokenRefreshInFlight = () async {
      await Helper.waitAndExecute(() => SharedPreferencesService.find.isReady, () {});

      final savedRefreshToken = SecureTokenStorage.find.refreshToken;
      if (savedRefreshToken == null || savedRefreshToken.isEmpty) return false;

      final requestUrl = Uri.parse('$baseUrl/users/renew');
      final refreshHeaders = Map<String, String>.from(_defaultHeader);
      refreshHeaders.remove('Authorization');
      refreshHeaders['locale'] = Get.locale?.languageCode ?? 'en';

      final response = await http
          .post(
            requestUrl,
            body: jsonEncode({refreshTokenKey: savedRefreshToken}),
            headers: refreshHeaders,
          )
          .timeout(const Duration(seconds: 15));

      if (response.statusCode != 200 && response.statusCode != 201) {
        if (response.statusCode == 401 || response.statusCode == 403) {
          await SecureTokenStorage.find.clear();
        }
        return false;
      }

      if (response.body.isEmpty) return false;
      final decoded = jsonDecode(response.body);
      if (decoded is! Map) return false;

      final newToken = decoded['token']?.toString();
      if (newToken == null || newToken.isEmpty) return false;

      await SecureTokenStorage.find.setJwt(newToken);
      final newRefreshToken = decoded['refreshToken']?.toString();
      if (newRefreshToken != null && newRefreshToken.isNotEmpty) {
        await SecureTokenStorage.find.setRefreshToken(newRefreshToken);
      }

      return true;
    }()
        .whenComplete(() {
      _tokenRefreshInFlight = null;
    });

    return _tokenRefreshInFlight!;
  }

  Future<dynamic> request(RequestType requestType, String url, {Map<String, String>? headers, dynamic body, List<XFile?>? files, String? imageName, bool sendToken = false}) async {
    return _requestInternal(
      requestType,
      url,
      headers: headers,
      body: body,
      files: files,
      imageName: imageName,
      sendToken: sendToken,
      attempt: 0,
    );
  }

  Future<dynamic> _requestInternal(
    RequestType requestType,
    String url, {
    Map<String, String>? headers,
    dynamic body,
    List<XFile?>? files,
    String? imageName,
    bool sendToken = false,
    required int attempt,
  }) async {
    final hasInternet = await ConnectivityService.hasInternet();
    if (!hasInternet) {
      SnackbarService.showNoInternet();
      throw NoInternetException('No internet connection');
    }

    if (attempt == 0 && url == _lastRequestedUrl) {
      LoggerService.logger!.w('API Warning: Duplicate request to the same URL: $url');
    }
    if (attempt == 0) _lastRequestedUrl = url;
    late http.Response response;
    if (attempt == 0) isLoading = true;
    await Helper.waitAndExecute(() => SharedPreferencesService.find.isReady, () {});
    _defaultHeader['locale'] = Get.locale?.languageCode ?? 'en';
    String? token;
    if (sendToken) {
      token = getToken();
      _defaultHeader.remove('Authorization');
      _defaultHeader.putIfAbsent('Authorization', () => 'Bearer $token');
    }

    _defaultHeader.remove('prefDevise');
    // final prefCurrency = SharedPreferencesService.find.get(currencyKey);
    _defaultHeader.putIfAbsent('prefDevise', () => 'TND'); // prefCurrency ?? Currencies.getStringCurrency(MainAppServie.find.preferedCurrency.value));

    final requestUrl = Uri.parse('$baseUrl$url');

    try {
      if (files != null && files.isNotEmpty) {
        final keyImage = imageName ?? (files.length > 2 ? 'gallery' : 'photo');
        LoggerService.logger!.i('API uploadFile, url $url');
        final imageUploadRequest = http.MultipartRequest(requestType.name.toUpperCase(), requestUrl);
        if (sendToken) imageUploadRequest.headers['Authorization'] = 'Bearer $token';

        for (final file in files) {
          Uint8List fileBytes = await file!.readAsBytes();
          String filename = file.name;

          imageUploadRequest.files.add(http.MultipartFile.fromBytes(keyImage, fileBytes.toList(), filename: filename));
        }
        if (body is Map<String, dynamic>) {
          for (final element in (body).keys) {
            if (body[element] != null) imageUploadRequest.fields.putIfAbsent(element, () => body[element].toString());
          }
        } else {
          LoggerService.logger!.w('uploadFile body is not a Map<String, dynamic>');
        }
        final streamedResponse = await imageUploadRequest.send().timeout(const Duration(seconds: 60));
        final responseData = await streamedResponse.stream.bytesToString();
        response = http.Response(
          responseData,
          streamedResponse.statusCode,
          headers: streamedResponse.headers,
          isRedirect: streamedResponse.isRedirect,
          persistentConnection: streamedResponse.persistentConnection,
          reasonPhrase: streamedResponse.reasonPhrase,
          request: streamedResponse.request,
        );
      } else {
        const requestTimeout = Duration(seconds: 15);
        switch (requestType) {
          case RequestType.get:
            LoggerService.logger!.i('API Get, url $url');
            response = await http
                .get(
                  requestUrl,
                  headers: headers ?? _defaultHeader,
                )
                .timeout(requestTimeout);
            break;
          case RequestType.post:
            LoggerService.logger!.i('API Post, url $url');
            response = await http
                .post(
                  requestUrl,
                  body: jsonEncode(body),
                  headers: headers ?? _defaultHeader,
                )
                .timeout(requestTimeout);
            break;
          case RequestType.put:
            LoggerService.logger!.i('API Put, url $url');
            response = await http
                .put(
                  requestUrl,
                  body: jsonEncode(body),
                  headers: headers ?? _defaultHeader,
                )
                .timeout(requestTimeout);
            break;
          case RequestType.delete:
            LoggerService.logger!.i('API Delete, url $url');
            response = await http
                .delete(
                  requestUrl,
                  body: body != null ? jsonEncode(body) : null,
                  headers: headers ?? _defaultHeader,
                )
                .timeout(requestTimeout);
            break;
        }
      }

      if (sendToken && attempt == 0 && _isAuthFailure(response)) {
        final refreshed = await _refreshAccessToken();
        if (refreshed) {
          return _requestInternal(
            requestType,
            url,
            headers: headers,
            body: body,
            files: files,
            imageName: imageName,
            sendToken: sendToken,
            attempt: 1,
          );
        }
      }

      return _returnResponse(response);
    } finally {
      if (attempt == 0) isLoading = false;
    }
  }

  String getClientImage(String pictureName) => '$baseUrl/public/images/client/$pictureName';
  String getExerciceImage(String link) {
    final trimmed = link.trim();
    if (trimmed.isEmpty) return '';
    final normalized = trimmed.startsWith('/') ? trimmed.substring(1) : trimmed;
    return '$baseUrl/public/$normalized';
  }

  // String getImageProperty(String pictureName) => 'http://localhost:9090/$_baseUrl/public/properties/$pictureName';
  // String getImageLocal(String pictureName) => 'http://localhost:9090/$pictureName';

  dynamic _returnResponse(http.Response response) async {
    switch (response.statusCode) {
      case 200:
        //LoggerService.logger!.i('API Return 200 OK, length: ${jsonDecode(response.body)['count']}');
        if (response.body.isEmpty) return null;
        return jsonDecode(response.body);
      case 201:
        if (response.body.isEmpty) return response.statusCode;
        return jsonDecode(response.body);
      case 204:
        return response.statusCode;
      case 400:
        throw BadRequestException(jsonDecode(response.body)['message']);
      case 401:
        // await AnalyticsService.find.logErrorEvent(response.body.toString());
        throw UnauthorisedException(response.body.toString());
      case 403:
        if (response.body.contains('session_expired')) {
          //   SnackBarManager.showCustomSnackBar(
          //       message: 'session_expired'.tr, title: 'login_msg'.tr, includeDismiss: false, styleMessage: AppFonts.x12Regular.copyWith(color: kErrorColor));
          //   if (SharedPreferencesService.find.get(refreshTokenKey) != null) {
          //     await AuthenticationService.find.renewToken();
          //     return await request(RequestTypeExtension.fromString(response.request!.method), response.request!.url.path, body: response.body, sendToken: true);
          //   } else {
          //     AuthenticationService.find.logout();
          //   }
          // } else {
          //   // if (kDebugMode) {
          //   //   SnackBarManager.showCustomSnackBar(
          //   //       message: jsonDecode(response.body)['message'].toString().tr,
          //   //       title: 'debug oups!',
          //   //       includeDismiss: false,
          //   //       styleMessage: AppFonts.x12Regular.copyWith(color: kErrorColor));
          //   // }
        }
        // await AnalyticsService.find.logErrorEvent(response.body.toString());
        throw UnauthorisedException(jsonDecode(response.body)['message'].toString());
      case 404:
        // if (kDebugMode) {
        //   SnackBarManager.showCustomSnackBar(
        //       message: jsonDecode(response.body)['message'], title: 'debug oups!', includeDismiss: false, styleMessage: AppFonts.x12Regular.copyWith(color: kErrorColor));
        // }
        // await AnalyticsService.find.logErrorEvent(response.body.toString());
        throw NotFoundException(response.body.toString());
      case 405:
        // NavHelper.goNamed(AccessDenied.routeName);
        break;
      case 406:
        // if (kDebugMode) {
        //   SnackBarManager.showCustomSnackBar(
        //       message: jsonDecode(response.body)['message'], title: 'debug oups!', includeDismiss: false, styleMessage: AppFonts.x12Regular.copyWith(color: kErrorColor));
        // }
        // await AnalyticsService.find.logErrorEvent(response.body.toString());
        throw UnauthorisedException(jsonDecode(response.body)['message'].toString());
      case 409:
        // if (kDebugMode) {
        //   SnackBarManager.showCustomSnackBar(
        //       message: jsonDecode(response.body)['message'], title: 'debug oups!', includeDismiss: false, styleMessage: AppFonts.x12Regular.copyWith(color: kErrorColor));
        // }
        // await AnalyticsService.find.logErrorEvent(response.body.toString());
        throw ConflictException(response.body.toString());
      case 500:
      default:
        // await AnalyticsService.find.logErrorEvent(response.body.toString());
        throw FetchDataException(
          'Error occured while Communication with Server with StatusCode : ${response.statusCode}\n${response.body}',
        );
    }
  }
}
