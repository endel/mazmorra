const LANGUAGES = {
  en: require('./en'),
  pt: require('./pt'),
  tr: require('./tr'),
}

let CURRENT_LANG = navigator.language.replace(/\-.+/i, "")

export function setLanguage(lang) {
  CURRENT_LANG = lang;
}

export function i18n(id) {
  return (LANGUAGES[CURRENT_LANG] || LANGUAGES['en'])[id] || id;
}
