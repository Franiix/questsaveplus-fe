import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import it from './locales/it';

const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'en';

i18n.use(initReactI18next).init({
 resources: {
  it: { translation: it },
  en: { translation: en },
 },
 lng: deviceLocale,
 fallbackLng: 'en',
 interpolation: {
  escapeValue: false, // React gestisce già l'escaping
 },
});

export default i18n;
