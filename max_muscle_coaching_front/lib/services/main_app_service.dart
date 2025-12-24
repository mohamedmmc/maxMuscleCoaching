import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:max_muscle_coaching_front/helper/constants/language.dart';
import 'package:max_muscle_coaching_front/helper/helper.dart';
import 'package:max_muscle_coaching_front/storage/shared_preferences_keys.dart';
import 'package:max_muscle_coaching_front/theme/translation/app_localization.dart';

import '../networking/api_base_helper.dart';

import '../repository/user_repository.dart';

import 'shared_preferences.dart';

class MainAppService extends GetxController {
  static MainAppService get find => Get.find<MainAppService>();
  String languageCode = 'en';
  bool isReady = false;

  var currentLanguage = Get.locale?.languageCode.obs;
  bool isArab() {
    final langue = SharedPreferencesService.find.get(languageCodeKey);
    return langue == 'ar';
  }

  MainAppService();

  Future<void> init() async {
    Helper.waitAndExecute(
      () => SharedPreferencesService.find.isReady,
      () async {
        try {
          languageCode = SharedPreferencesService.find.get(languageCodeKey)!;

          // await initFM();
        } catch (e) {
          if (Get.deviceLocale != null && AppLocalization().supportedLocal.contains(Get.deviceLocale)) {
            _saveLanguagePreferences(Get.deviceLocale!);
            Get.updateLocale(Locale(Get.deviceLocale!.languageCode, Get.deviceLocale!.countryCode));
          } else {
            _saveLanguagePreferences(const Locale('en', 'US'));
            Get.updateLocale(const Locale('en', 'US'));
          }
        }
      },
    );

    isReady = true;
    ApiBaseHelper.find.isLoading = false;
  }

  void changeLanguage({Locale? lang}) {
    if (lang == null) return;
    _saveLanguagePreferences(lang);
    _saveLanguageServer(lang);
    Get.updateLocale(lang);
    currentLanguage?.value = lang.languageCode;
  }

  void _saveLanguagePreferences(Locale deviceLocale) {
    SharedPreferencesService.find.add(languageCodeKey, deviceLocale.languageCode);
    SharedPreferencesService.find.add(countryCodeKey, deviceLocale.countryCode!);
  }

  Future<void> _saveLanguageServer(Locale deviceLocale) async {
    String? lang;
    if (deviceLocale.languageCode == 'en') {
      lang = getLanguageString(Language.english);
    } else if (deviceLocale.languageCode == 'fr') {
      lang = getLanguageString(Language.french);
    } else if (deviceLocale.languageCode == 'ar') {
      lang = getLanguageString(Language.arabic);
    } else if (deviceLocale.languageCode == 'es') {
      lang = getLanguageString(Language.spanish);
    } else {
      lang = getLanguageString(Language.english);
    }
    await UserRepository.find.changeLanguage(lang);
  }
}
