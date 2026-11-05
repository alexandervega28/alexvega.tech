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

export const profile = {
  name: 'Alexander Vega',
  role: 'Software Developer Full-Stack',
  years: '+7',
  yearsLabel: 'años de experiencia en programación',
  tagline: 'Construyendo soluciones escalables.',
  email: 'hello@alexvega.tech',
  linkedin: 'https://www.linkedin.com/in/avegan',
  cv: '/cv-alexander-vega.pdf',
  photo: '/alex.jpg',
};

export const nav = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#stack', label: 'Stack' },
  { href: '#experiencia', label: 'Experiencia' },
  { href: '#contacto', label: 'Contacto' },
];

export type Tech = { name: string; note: string; path?: string; text?: string };

export const stack: Tech[] = [
  { name: 'Angular', path: siAngular.path, note: 'Mi frontend principal' },
  { name: 'TypeScript', path: siTypescript.path, note: 'Todos los días' },
  { name: 'Tailwind', path: siTailwindcss.path, note: 'UI rápida y limpia' },
  { name: 'C# .NET', path: siDotnet.path, note: 'APIs REST y lógica de negocio' },
  { name: 'Python · FastAPI', path: siPython.path, note: 'Servicios rápidos e IA' },
  { name: 'SQL Server', text: 'SQL', note: 'Bases relacionales' },
  { name: 'PostgreSQL', path: siPostgresql.path, note: 'Bases relacionales' },
  { name: 'OpenAI', path: siOpenai.path, note: 'IA en productos reales' },
  { name: 'Claude', path: siClaude.path, note: 'IA en productos reales' },
  { name: 'GitHub Actions', path: siGithubactions.path, note: 'CI/CD' },
];

export type Job = { period: string; company: string; role: string; points: string[]; tags: string[] };

export const jobs: Job[] = [
  {
    period: '2024 — hoy',
    company: 'MindTechSourcing',
    role: 'Senior Software Developer',
    points: ['Decisiones técnicas en Mind-e y Quantum Brain', 'Frontend con Angular', 'Funciones con IA (OpenAI, Claude)'],
    tags: ['Angular', 'OpenAI', 'Claude'],
  },
  {
    period: '2020 — 2025',
    company: 'Atlantic Quantum Innovations',
    role: 'Desarrollador de Software',
    points: ['Apps full-stack', 'APIs REST', 'SQL Server y PostgreSQL'],
    tags: ['Angular', 'C# .NET', 'Python'],
  },
  {
    period: '2019 — 2020',
    company: 'Cytech',
    role: 'Ingeniero de TI / Full-Stack',
    points: ['Intranet de análisis de ventas'],
    tags: ['PHP', 'CodeIgniter', 'SQL Server'],
  },
  {
    period: '2016 — 2018',
    company: 'Fundación Grupo Estudio',
    role: 'Ingeniero de Sistemas',
    points: ['Sistemas internos'],
    tags: ['Desarrollo'],
  },
];
