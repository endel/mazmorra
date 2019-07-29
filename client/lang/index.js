const LANGUAGES = {
  en: require('./en'),
  pt: require('./pt')
}

let CURRENT_LANG = navigator.language.replace(/\-.+/i, "")
// let CURRENT_LANG = 'pt';

export function setLanguage(lang) {
  CURRENT_LANG = lang;
}

export function i18n(id) {
  return (LANGUAGES[CURRENT_LANG] || LANGUAGES['en'])[id] || id;
}
