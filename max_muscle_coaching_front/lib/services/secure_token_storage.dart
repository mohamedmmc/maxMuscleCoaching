import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:max_muscle_coaching_front/storage/shared_preferences_keys.dart';

/// Stores auth tokens in platform-encrypted storage (Keychain on iOS,
/// EncryptedSharedPreferences on Android), with an in-memory cache so callers
/// can read synchronously after [init] has run.
class SecureTokenStorage extends GetxService {
  static SecureTokenStorage get find => Get.find<SecureTokenStorage>();

  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  String? _jwt;
  String? _refreshToken;

  String? get jwt => _jwt;
  String? get refreshToken => _refreshToken;

  Future<void> init() async {
    if (kIsWeb) {
      final prefs = await SharedPreferences.getInstance();
      _jwt = prefs.getString(jwtKey);
      _refreshToken = prefs.getString(refreshTokenKey);
      return;
    }

    _jwt = await _storage.read(key: jwtKey);
    _refreshToken = await _storage.read(key: refreshTokenKey);

    if (_jwt == null && _refreshToken == null) {
      await _migrateFromSharedPreferences();
    }
  }

  Future<void> setJwt(String value) async {
    _jwt = value;
    if (kIsWeb) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(jwtKey, value);
      return;
    }
    await _storage.write(key: jwtKey, value: value);
  }

  Future<void> setRefreshToken(String value) async {
    _refreshToken = value;
    if (kIsWeb) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(refreshTokenKey, value);
      return;
    }
    await _storage.write(key: refreshTokenKey, value: value);
  }

  Future<void> clear() async {
    _jwt = null;
    _refreshToken = null;
    if (kIsWeb) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(jwtKey);
      await prefs.remove(refreshTokenKey);
      return;
    }
    await _storage.delete(key: jwtKey);
    await _storage.delete(key: refreshTokenKey);
  }

  Future<void> _migrateFromSharedPreferences() async {
    final prefs = await SharedPreferences.getInstance();
    final legacyJwt = prefs.getString(jwtKey);
    final legacyRefresh = prefs.getString(refreshTokenKey);
    if (legacyJwt != null) {
      await _storage.write(key: jwtKey, value: legacyJwt);
      _jwt = legacyJwt;
      await prefs.remove(jwtKey);
    }
    if (legacyRefresh != null) {
      await _storage.write(key: refreshTokenKey, value: legacyRefresh);
      _refreshToken = legacyRefresh;
      await prefs.remove(refreshTokenKey);
    }
  }
}
