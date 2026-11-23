import {
  siAngular,
  siTypescript,
  siTailwindcss,
  siDotnet,
  siPython,
  siPostgresql,
  siOpenai,
  siClaude,
  siGithubactions,
} from 'simple-icons';
import { es } from './es';
import { en } from './en';

export type Lang = 'es' | 'en';
export const defaultLang: Lang = 'es';
export const langs: { code: Lang; label: string; name: string; path: string }[] = [
  { code: 'es', label: 'ES', name: 'Español', path: '/' },
  { code: 'en', label: 'EN', name: 'English', path: '/en/' },
];

/** Datos que no dependen del idioma. */
export const profile = {
  name: 'Alexander Vega',
  years: '+7',
  email: 'hello@alexvega.tech',
  linkedin: 'https://www.linkedin.com/in/avegan',
  instagram: 'https://www.instagram.com/alexvega.tech',
  instagramHandle: '@alexvega.tech',
  cv: '/cv-alexander-vega.pdf',
  photo: '/alex.jpg',
};

/** Tecnologías del stack. La nota de cada una está en los textos por idioma (stackNotes). */
export type Tech = { id: string; name: string; path?: string; text?: string };
export const stack: Tech[] = [
  { id: 'angular', name: 'Angular', path: siAngular.path },
  { id: 'typescript', name: 'TypeScript', path: siTypescript.path },
  { id: 'tailwind', name: 'Tailwind', path: siTailwindcss.path },
  { id: 'dotnet', name: 'C# .NET', path: siDotnet.path },
  { id: 'python', name: 'Python · FastAPI', path: siPython.path },
  { id: 'sqlserver', name: 'SQL Server', text: 'SQL' },
  { id: 'postgresql', name: 'PostgreSQL', path: siPostgresql.path },
  { id: 'openai', name: 'OpenAI', path: siOpenai.path },
  { id: 'claude', name: 'Claude', path: siClaude.path },
  { id: 'actions', name: 'GitHub Actions', path: siGithubactions.path },
];

/** Proyectos del portafolio. El resumen de cada uno está en los textos por idioma (portfolio.items). */
export type Project = { id: string; name: string; url: string; domain: string; image: string; tags: string[] };
export const projects: Project[] = [
  {
    id: 'printing',
    name: 'Printing Company',
    url: 'https://printingcompany.store/',
    domain: 'printingcompany.store',
    image: '/portfolio/printing-company.webp',
    tags: ['Shopify', 'E-commerce'],
  },
  {
    id: 'aloquilla',
    name: 'Aloquilla Radio',
    url: 'https://www.aloquillaradio.com/',
    domain: 'aloquillaradio.com',
    image: '/portfolio/aloquilla-radio.webp',
    tags: ['JavaScript', 'Streaming'],
  },
];

export type Step = { period: string; company: string; role: string; points: string[] };
export type Job = {
  period: string;
  company: string;
  role: string;
  /** Subtítulo opcional bajo el cargo (p. ej. nombre actual de la empresa). */
  note?: string;
  points?: string[];
  /** Cambios de nombre de la empresa y de cargo dentro de una misma relación laboral, del más reciente al más antiguo. */
  steps?: Step[];
  tags: string[];
};

/** Todos los textos de la web en un idioma. `es.ts` y `en.ts` deben tener la misma forma. */
export type Content = {
  role: string;
  tagline: string;
  /** Texto bajo el "+7" de la tarjeta de experiencia, en dos líneas. */
  yearsLines: [string, string];
  metaDescription: string;
  nav: { href: string; label: string }[];
  a11y: { skip: string; mainNav: string; logo: string; openMenu: string; closeMenu: string; language: string };
  hero: { greeting: string; bubble: string; photoAlt: string; write: string; cv: string; cue: string; cueLabel: string };
  stack: { kicker: string; title: string; hint: string; notes: Record<string, string> };
  experience: { kicker: string; title: string; hint: string; tablist: string };
  portfolio: { kicker: string; title: string; hint: string; visit: string; imageAlt: string; items: Record<string, string> };
  contact: {
    kicker: string;
    title: string;
    hint: string;
    termTitle: string;
    cmdEmail: string;
    cmdInstagram: string;
    sendEmail: string;
    copyEmail: string;
    copied: string;
  };
  jobs: Job[];
};

export const content: Record<Lang, Content> = { es, en };
