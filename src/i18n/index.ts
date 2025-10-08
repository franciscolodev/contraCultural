import i18next from 'i18next';

// Importa dinámicamente los archivos de idioma (es.js, en.js, pt.js)
const modules = import.meta.glob('./design/*.js');

// Definimos el tipo de la estructura de recursos
interface I18nResources {
  [lang: string]: {
    translation: {
      design: Record<string, any>;
    };
  };
}

async function i18nInit(): Promise<void> {
  const resources: I18nResources = {};

  for (const p in modules) {
    const mod: any = await modules[p]();
    const name = p.split('/').pop()?.replace('.js', '') as string; // ej: "es", "en", "pt"

    resources[name] = {
      translation: {
        design: mod.default,
      },
    };
  }

  await i18next.init({
    lng: 'es',
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });
}

export const getI18n = async (
  lang: string = 'es',
  name?: string
): Promise<(key?: string, options?: Record<string, any>) => any> => {
  await i18nInit();
  await i18next.changeLanguage(lang);

  return (key = '', options = {}) => {
    if (typeof name === 'string') {
      key = [name, key].filter(Boolean).join('.');
    }

    let ans: any = i18next.t(key, options);

    // Evita el error de tipo con returnObjects
    if (
      typeof ans === 'string' &&
      ans.includes('returned an object instead of strin')
    ) {
      ans = i18next.t(key, { ...options, returnObjects: true });
    }

    return ans;
  };
};
