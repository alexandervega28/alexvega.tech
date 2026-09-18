import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://alexvega.tech',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  image: {
    // Derivados web optimizados: el PNG master (1.8 MB) nunca se sirve tal cual.
    responsiveStyles: false,
  },
});
