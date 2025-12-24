import 'package:cross_file/cross_file.dart';
import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart';
import 'package:get/get.dart';
import 'package:max_muscle_coaching_front/helper/helper.dart';
import 'package:max_muscle_coaching_front/models/dto/login_dto.dart';
import 'package:max_muscle_coaching_front/models/dto/mail_model.dart';
import 'package:max_muscle_coaching_front/models/user_model.dart';
import 'package:max_muscle_coaching_front/networking/api_base_helper.dart';
import 'package:max_muscle_coaching_front/networking/api_exceptions.dart';
import 'package:max_muscle_coaching_front/networking/logger_service.dart';
import 'package:max_muscle_coaching_front/controllers/app_controller.dart';
import 'package:max_muscle_coaching_front/services/shared_preferences.dart';
import 'package:max_muscle_coaching_front/services/snackbar_service.dart';
import 'package:max_muscle_coaching_front/storage/shared_preferences_keys.dart';

class UserRepository extends GetxService {
  static UserRepository get find => Get.find<UserRepository>();

  Future<LoginDTO?> login({required User user}) async {
    try {
      final data = user.toJson();
      data.putIfAbsent('isMobile', () => GetPlatform.isMobile);
      final result = await ApiBaseHelper().request(RequestType.post, '/users/signin', body: data);
      return LoginDTO.fromJson(result);
    } on UnauthorisedException catch (_) {
      return null;
    } on NotFoundException catch (_) {
      return null;
    } catch (e) {
      LoggerService.logger?.e('Error occured in login:\n$e');
    }
    return null;
  }

  Future<LoginDTO?> renewJWT({required Map<String, dynamic> token}) async {
    try {
      final result = await ApiBaseHelper().request(RequestType.post, '/users/renew', body: token);
      return LoginDTO.fromJson(result);
    } on UnauthorisedException {
      SnackbarService.showError(title: 'Session expired', message: 'Please login again.');
      await AppController.find.logout();
    } catch (e) {
      LoggerService.logger?.e('Error occured in login:\n$e');
    }
    return null;
  }

  Future<User?> profile() async {
    try {
      final result = await ApiBaseHelper().request(RequestType.get, '/users/profile', sendToken: true);
      if (result is Map) {
        final map = result.cast<String, dynamic>();
        final rawUser = (map['clientFound']);
        if (rawUser is Map) return User.fromJson(rawUser.cast<String, dynamic>());
      }
      return null;
    } on UnauthorisedException {
      SnackbarService.showError(title: 'Session expired', message: 'Please login again.');
      await AppController.find.logout();
      return null;
    } catch (e) {
      LoggerService.logger?.e('Error occured in profile:\n$e');
    }
    return null;
  }

  Future<String?> signup({required User user, String? iduser}) async {
    try {
      final data = user.toJson();
      if (iduser != null) {
        data['iduser'] = iduser;
      }
      final result = await ApiBaseHelper().request(RequestType.post, '/users/signup', body: data);
      return result['token'];
    } catch (e) {
      final expectedErrors = ['missing_password', 'client_already_found', 'wrong_number', 'missing_credentials', 'wrong final block length'];

      if (expectedErrors.any((element) => e.toString().contains(element))) {
        Get.snackbar('error'.tr, expectedErrors.singleWhere((element) => e.toString().contains(element)).tr);
      }
      LoggerService.logger?.e('Error occured in signup:\n$e');
    }
    return null;
  }

  Future<String?> checkFCM() async {
    try {
      Helper.waitAndExecute(() => SharedPreferencesService.find.isReady, () async {
        final jwt = SharedPreferencesService.find.get(jwtKey);
        final userId = jwt != null ? JWT.decode(jwt).payload['id'] : null;
        String? token; //= SharedPreferencesService.find.get('fcmToken') != null ? await FirebaseMessaging.instance.getToken() : '';
        final result = await ApiBaseHelper().request(RequestType.post, '/users/check-fcm', body: {'id': userId, 'token': token});
        return result;
      });
    } catch (e) {
      LoggerService.logger?.e('Error occured in checkFCM:\n$e');
    }
    return null;
  }

  Future<bool> verifyOTP(String? phoneNumber, String? email, String? otpCode) async {
    try {
      final result = await ApiBaseHelper().request(RequestType.post, '/users/verify-phone', body: {'phoneNumber': phoneNumber, 'code': otpCode, 'email': email});
      return result['message'] == 'otp_approved';
    } catch (e) {
      if (e is AppException && (e.message?.contains('phone_exist') ?? false)) {
        Get.snackbar('error'.tr, 'phone_exist'.tr);
      }
      LoggerService.logger?.e('Error occurred in verifyOTP:\n$e');
      return false;
    }
  }

  Future<dynamic> verifyEmail(String token, {String? email}) async {
    try {
      final result = await ApiBaseHelper().request(RequestType.post, '/users/verify-mail',
          // body: GetPlatform.isMobile ? {'email': email, 'code': token, 'isMobile': true} : {'token': token, 'isMobile': false},
          body: {'code': token});
      return result;
    } catch (e) {
      if (e is AppException && e.message == 'already_verified') return e.message;
      if (e is AppException && e.message == 'jwt_expired') return e.message;
      LoggerService.logger?.e('Error occurred in verifyEmail:\n$e');
      return null;
    }
  }

  Future<dynamic> sendMail(MailModel mail) async {
    try {
      final result = await ApiBaseHelper().request(RequestType.post, '/users/contact-us', body: mail.toJson());
      return result;
    } catch (e) {
      LoggerService.logger?.e('Error occurred in sendMail:\n$e');
      return null;
    }
  }

  Future<dynamic> sendMailFranchise(MailModel mail) async {
    try {
      final result = await ApiBaseHelper().request(RequestType.post, '/users/contact-us-franchise', body: mail.toJson());
      return result;
    } catch (e) {
      LoggerService.logger?.e('Error occurred in sendMail:\n$e');
      return null;
    }
  }

  Future<String?> deleteProfile({required int idUser}) async {
    try {
      if (idUser == 0) return null;
      final result = await ApiBaseHelper().request(RequestType.delete, '/users/delete', sendToken: true);
      return result;
    } catch (e) {
      LoggerService.logger?.e('Error occurred in deleteProfile:\n$e');
      return null;
    }
  }

  // Routes requires JWT token

  Future<bool> checkVerifiedUser() async {
    try {
      final result = await ApiBaseHelper().request(RequestType.get, '/users/check-verification-user', sendToken: true);
      return result['verified'];
    } catch (e) {
      LoggerService.logger?.e('Error occurred in checkVerifiedUser:\n$e');
      return false;
    }
  }

  Future<bool> resendVerification() async {
    try {
      final result = await ApiBaseHelper().request(
        RequestType.get,
        '/users/resend-verification',
        sendToken: true,
        body: {'isMobile': GetPlatform.isMobile},
      );
      return result['message'] != null;
    } on AppException catch (e, _) {
      Get.snackbar('error'.tr, e.message.toString().tr);
    } catch (e) {
      LoggerService.logger?.e('Error occurred in resendVerification:\n$e');
      return false;
    }
    return false;
  }

  Future<User?> getLoggedInUser() async {
    try {
      final result = await ApiBaseHelper().request(RequestType.get, '/users/profile', sendToken: true);
      return User.fromJson(result['client']);
    } catch (e) {
      LoggerService.logger?.e('Error occurred in getLoggedInUser:\n$e');
      return null;
    }
  }

  Future<User?> getUserById(int id) async {
    try {
      final result = await ApiBaseHelper().request(RequestType.get, '/users/user-id?id=$id', sendToken: true);
      return User.fromJson(result['client']);
    } catch (e) {
      LoggerService.logger?.e('Error occurred in getUserById:\n$e');
      return null;
    }
  }

  Future<User?> linkWithSocial(User user) async {
    try {
      final result = await ApiBaseHelper().request(RequestType.post, '/users/social-media', body: user.toSocialJson(), sendToken: true);
      return User.fromJson(result['updatedClient']);
    } catch (e) {
      LoggerService.logger?.e('Error occurred in linkWithSocial:\n$e');
      return null;
    }
  }

  Future<User?> updateUser(User user, {List<XFile?>? govId, XFile? picture, bool withBack = false}) async {
    try {
      List<XFile?>? uploadFiles;
      if (govId != null && govId.isNotEmpty || picture != null) uploadFiles = govId ?? [picture];
      final result = await ApiBaseHelper().request(RequestType.put, '/users/update-profile', body: user.toUpdateJson(), files: uploadFiles, sendToken: true);
      if (withBack) Get.back();
      if (!withBack) Get.snackbar('success'.tr, 'update_profile_success'.tr);
      final client = User.fromJson(result['updatedClient']);
      final jwt = result['jwt'];
      if (jwt is String) {
        await AppController.find.setJwt(jwt);
      }
      return client;
    } catch (e) {
      if (e is AppException && (e.message?.contains('phone_exist') ?? false)) {
        Get.snackbar('error'.tr, 'phone_exist'.tr);
      }
      LoggerService.logger?.e('Error occured in updateUser:\n$e');
    }
    return null;
  }

  Future<User?> updateUserByAdmin(User user) async {
    try {
      final data = user.toJson();
      final result = await ApiBaseHelper().request(RequestType.put, '/users/update-profile-admin/${user.id}', body: data, sendToken: true);
      if (result['message'] == 'update_profile_success') {
        Get.snackbar('success'.tr, 'update_profile_success'.tr);
      }
      final client = User.fromJson(result['updatedClient']);
      return client;
    } catch (e) {
      if (e is AppException && (e.message?.contains('phone_exist') ?? false)) {
        Get.snackbar('error'.tr, 'phone_exist'.tr);
      } else if (e is AppException && (e.message?.contains('email_exist') ?? false)) {
        Get.snackbar('error'.tr, 'email_exist'.tr);
      }
      LoggerService.logger?.e('Error occured in updateUserByAdim:\n$e');
    }
    return null;
  }

  Future<bool> forgotPassword(String newPassword, String code) async {
    try {
      final result = await ApiBaseHelper().request(RequestType.put, '/users/forgot-password', body: {'newPassword': newPassword, 'code': code}, sendToken: true);
      if (result['message'] == 'done') {
        Get.back();

        Get.snackbar('success'.tr, 'password_change_success'.tr);
        return true;
      }
    } on AppException catch (e, _) {
      if (e.toString().contains('same_password')) {
        Get.snackbar('error'.tr, 'same_password'.tr);
      }
    } catch (e) {
      LoggerService.logger?.e('Error occured in changePassword:\n$e');
    }
    return false;
  }

  Future<bool> changePassword(String newPassword, String currentPass) async {
    try {
      final result = await ApiBaseHelper().request(RequestType.put, '/users/update-password', body: {'newPassword': newPassword, 'currentPass': currentPass}, sendToken: true);
      if (result['message'] == 'done') {
        Get.back();
        Get.snackbar('success'.tr, 'password_change_success'.tr);
        return true;
      }
    } on AppException catch (e, _) {
      if (e.toString().contains('same_password')) {
        Get.snackbar('error'.tr, 'same_password'.tr);
      }
      if (e.toString().contains('wrong_old_pass')) {
        Get.snackbar('error'.tr, 'wrong_old_pass'.tr);
      }
    } catch (e) {
      LoggerService.logger?.e('Error occured in changePassword:\n$e');
    }
    return false;
  }

  Future<bool> sendChangePasswordCode(String email) async {
    try {
      final result = await ApiBaseHelper().request(RequestType.post, '/users/email-forgot-password', body: {'email': email});
      if (result['message'] == 'done') return true;
    } catch (e) {
      LoggerService.logger?.e('Error occured in sendChangePasswordCode:\n$e');
    }
    return false;
  }

  Future<String?> broadcastNotification({required String body, required String title}) async {
    try {
      final result = await ApiBaseHelper().request(RequestType.post, '/users/broadcast-notif', body: {'body': body, 'title': title}, sendToken: true);
      return result;
    } catch (e) {
      LoggerService.logger?.e('Error occurred in sendNotif:\n$e');
      return null;
    }
  }

  Future<int?> verifyClient({required int id, required int value}) async {
    try {
      final result = await ApiBaseHelper().request(RequestType.post, '/users/verify-admin', body: {'idClient': id, 'value': value}, sendToken: true);
      return result['value'];
    } catch (e) {
      LoggerService.logger?.e('Error occurred in verifyUserAdmin:\n$e');
      return null;
    }
  }

  Future<void> changeLanguage(String? language) async {
    try {
      if (AppController.find.user != null) {
        await ApiBaseHelper().request(RequestType.post, '/users/change-user-language', body: {'language': language}, sendToken: true);
      }
    } catch (e) {
      LoggerService.logger?.e('Error occurred in changeLanguage:\n$e');
    }
  }
}
