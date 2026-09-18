/**
 * Destinos del sitio.
 *
 * `null` significa "todavía no existe". El handoff prohíbe publicar controles
 * sin destino y prohíbe inventar URLs, así que un destino nulo se renderiza como
 * texto no interactivo marcado como pendiente — nunca como un enlace que finge
 * funcionar. Rellenar aquí cuando el usuario facilite los perfiles reales y
 * cuando existan las secciones.
 */
export const links = {
  projects: null as string | null,
  about: null as string | null,
  contact: null as string | null,
  github: null as string | null,
  linkedin: null as string | null,
} as const;

export const social = [
  { key: 'github', label: 'GitHub', href: links.github },
  { key: 'linkedin', label: 'LinkedIn', href: links.linkedin },
] as const;

/** Presupuesto de carga: solo recursos de esta primera pantalla. */
export const LOADER_TIMEOUT_MS = 5000;
export const LOADER_HOLD_MS = 180;
export const SESSION_KEY = 'av:arrived';
