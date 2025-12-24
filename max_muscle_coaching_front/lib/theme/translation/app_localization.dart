import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'ar_tn.dart';
import 'en_us.dart';
import 'es_es.dart';
import 'fr_fr.dart';

class AppLocalization extends Translations {
  final List<Locale> supportedLocal = <Locale>[
    const Locale('en', 'US'),
    const Locale('fr', 'FR'),
    const Locale('es', 'ES'),
    const Locale('ar', 'TN'),
  ];

  @override
  Map<String, Map<String, String>> get keys => <String, Map<String, String>>{
        'en_US': enUs,
        'fr_FR': frFr,
        'es_ES': esEs,
        'ar_TN': arTN,
      };
}
