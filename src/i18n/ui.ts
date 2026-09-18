export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'es';

/** Textos aprobados en design/direccion-visual-v1.md. No inventar variantes. */
export const ui = {
  es: {
    htmlLang: 'es',
    documentTitle: 'Alex Vega — Desarrollador de software',
    documentDescription: 'De la imaginación al software. Portafolio de Alex Vega.',
    loadingLabel: 'Preparando tu órbita',
    role: 'Desarrollador de software',
    name: { first: 'ALEX', last: 'VEGA' },
    tagline: 'De la imaginación al software.',
    actionProjects: 'Explorar proyectos',
    actionContact: 'Hablemos',
    navProjects: 'Proyectos',
    navAbout: 'Sobre mí',
    navContact: 'Contacto',
    scrollHint: 'Comienza el viaje',
    skipToContent: 'Saltar al contenido',
    menuOpen: 'Abrir menú',
    menuClose: 'Cerrar menú',
    languageLabel: 'Idioma',
    pending: 'pendiente',
    pendingHint: 'Destino pendiente de definir',
    heroSceneAlt:
      'Ilustración: el limbo de un planeta azul iluminado por un amanecer cálido sobre un cielo casi negro. Render artístico, no una fotografía.',
  },
  en: {
    htmlLang: 'en',
    documentTitle: 'Alex Vega — Software developer',
    documentDescription: 'From imagination to software. Alex Vega’s portfolio.',
    loadingLabel: 'Preparing your orbit',
    role: 'Software developer',
    name: { first: 'ALEX', last: 'VEGA' },
    tagline: 'From imagination to software.',
    actionProjects: 'Explore projects',
    actionContact: 'Let’s talk',
    navProjects: 'Projects',
    navAbout: 'About',
    navContact: 'Contact',
    scrollHint: 'Begin the journey',
    skipToContent: 'Skip to content',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    languageLabel: 'Language',
    pending: 'pending',
    pendingHint: 'Destination not defined yet',
    heroSceneAlt:
      'Illustration: the limb of a blue planet lit by a warm sunrise over a near-black sky. Artistic render, not a photograph.',
  },
} as const;

export type Strings = (typeof ui)[Locale];

export function t(locale: Locale): Strings {
  return ui[locale];
}

/** Ruta equivalente en el otro idioma, conservando el resto del path. */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path.replace(/^\/en(?=\/|$)/, '') || '/';
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === '/' ? '/en/' : `/en${clean}`;
}
