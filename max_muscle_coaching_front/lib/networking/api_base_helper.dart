import 'dart:async';
import 'dart:convert';
import 'package:get/get_connect/http/src/request/request.dart';
import 'package:http/http.dart' as http;

import 'package:cross_file/cross_file.dart';
import 'package:flutter/foundation.dart';
import 'package:get/get.dart';
import 'package:max_muscle_coaching_front/helper/helper.dart';
import 'package:max_muscle_coaching_front/networking/logger_service.dart';
import 'package:max_muscle_coaching_front/services/connectivity_service.dart';
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

const String ip = '169.254.240.105';
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

  String? getToken() => SharedPreferencesService.find.get(jwtKey);

  Future<dynamic> request(RequestType requestType, String url, {Map<String, String>? headers, dynamic body, List<XFile?>? files, String? imageName, bool sendToken = false}) async {
    final hasInternet = await ConnectivityService.hasInternet();
    if (!hasInternet) {
      SnackbarService.showNoInternet();
      throw NoInternetException('No internet connection');
    }

    if (url == _lastRequestedUrl) {
      LoggerService.logger!.w('API Warning: Duplicate request to the same URL: $url');
    }
    _lastRequestedUrl = url;
    late http.Response response;
    isLoading = true;
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
      final streamedResponse = await imageUploadRequest.send();
      final responseData = await streamedResponse.stream.asBroadcastStream().bytesToString();
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
      switch (requestType) {
        case RequestType.get:
          LoggerService.logger!.i('API Get, url $url');
          response = await http.get(
            requestUrl,
            headers: headers ?? _defaultHeader,
          );
          break;
        case RequestType.post:
          LoggerService.logger!.i('API Post, url $url');
          response = await http.post(
            requestUrl,
            body: jsonEncode(body),
            headers: headers ?? _defaultHeader,
          );
          break;
        case RequestType.put:
          LoggerService.logger!.i('API Put, url $url');
          response = await http.put(
            requestUrl,
            body: jsonEncode(body),
            headers: headers ?? _defaultHeader,
          );
          break;
        case RequestType.delete:
          LoggerService.logger!.i('API Delete, url $url');
          response = await http.delete(
            requestUrl,
            body: body != null ? jsonEncode(body) : null,
            headers: headers ?? _defaultHeader,
          );
          break;
      }
    }
    isLoading = false;
    return _returnResponse(response);
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
