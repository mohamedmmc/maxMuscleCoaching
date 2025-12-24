enum Language {
  french,
  english,
  arabic,
  spanish,
}

void changeLanguage(Language language) {
  switch (language) {
    case Language.french:
      // Set the language to French
      break;
    case Language.english:
      // Set the language to English
      break;
    case Language.arabic:
      // Set the language to Arabic
      break;
    case Language.spanish:
      // Set the language to Spanish
      break;
  }
}

String getLanguageString(Language language) {
  switch (language) {
    case Language.french:
      return 'french';
    case Language.english:
      return 'english';
    case Language.arabic:
      return 'arabic';
    case Language.spanish:
      return 'spanish';
  }
}

Language stringToLanguage(String languageString) {
  switch (languageString) {
    case 'french':
      return Language.french;
    case 'english':
      return Language.english;
    case 'arabic':
      return Language.arabic;
    case 'spanish':
      return Language.spanish;
    default:
      return Language.english; // default language
  }
}
