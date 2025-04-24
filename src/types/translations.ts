
export type Language = 'en' | 'es';

export interface Translations {
  [key: string]: string | Translations;
}

export const LANGUAGES = {
  en: 'English',
  es: 'Español',
};

