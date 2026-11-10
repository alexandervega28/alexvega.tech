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

export const jobs: Job[] = [
  {
    period: 'Jun 2020 — hoy',
    company: 'Atlantic',
    role: 'Tech Lead',
    note: 'Atlantic Quantum Innovations → MindTechSourcing → Byteflow',
    steps: [
      {
        period: 'Sept 2025 — hoy',
        company: 'Byteflow',
        role: 'Tech Lead',
        points: [
          'Lidero técnicamente Agent, una plataforma comercial de agentes de voz con inteligencia artificial que ya está en manos de clientes.',
          'Lidero también Vault, una solución que permite consultar la información de una empresa haciendo preguntas en lenguaje natural (RAG).',
          'Defino la arquitectura y construyo las funcionalidades críticas de productos que funcionan en producción.',
          'Acompaño al equipo en la resolución de problemas y la revisión de soluciones, para que el software sea de calidad y fácil de mantener.',
          'Hago que la IA sea viable para el negocio: respuestas rápidas, costos bajo control y un comportamiento confiable cuando el modelo responde algo inesperado.',
        ],
      },
      {
        period: 'Ene 2025 — Sept 2025',
        company: 'Byteflow',
        role: 'Senior Software Engineer',
        points: [
          'Construí funcionalidades de punta a punta que conectan servicios y aplican las reglas del negocio dentro de los productos.',
          'Diseñé APIs y contribuí a la evolución de productos que apoyan la operación diaria de empresas.',
        ],
      },
      {
        period: 'Dic 2024 — Ene 2025',
        company: 'MindTechSourcing',
        role: 'Senior Software Engineer',
        points: ['Participé en iniciativas de desarrollo y en decisiones técnicas de los productos.'],
      },
      {
        period: 'Jun 2020 — May 2025',
        company: 'Atlantic Quantum Innovations',
        role: 'Software Developer',
        points: [
          'Construí aplicaciones empresariales de punta a punta, desde la pantalla que ve el usuario hasta la base de datos.',
          'Diseñé los servicios que permiten que distintas aplicaciones compartan información entre sí.',
          'Traduje reglas de negocio a software y mejoré el rendimiento, para que las aplicaciones respondan más rápido.',
          'Organicé y mantuve las bases de datos (SQL Server, PostgreSQL) para que la información estuviera disponible y confiable.',
        ],
      },
    ],
    tags: ['Agentes de voz', 'RAG', 'OpenAI', 'Claude', 'Angular', 'C# .NET', 'Python', 'SQL Server', 'PostgreSQL'],
  },
  {
    period: 'Mar 2019 — Jun 2020',
    company: 'Cytech Calidad y Tecnología',
    role: 'Ingeniero de TI / Desarrollador Full-Stack',
    points: [
      'Desarrollé una intranet que centralizó el análisis y los reportes de ventas, facilitando la toma de decisiones.',
      'Mantuve la infraestructura y los sistemas funcionando para que la operación de la empresa no se detuviera.',
    ],
    tags: ['PHP', 'CodeIgniter', 'SQL Server'],
  },
  {
    period: 'Nov 2016 — Dic 2018',
    company: 'Fundación Grupo Estudio',
    role: 'Ingeniero de Sistemas',
    points: ['Desarrollé y mantuve los sistemas internos que apoyan los procesos de la organización.'],
    tags: ['Desarrollo', 'Soporte'],
  },
  {
    period: 'Jun 2012 — Nov 2016',
    company: 'Neumática del Caribe',
    role: 'Técnico de Sistemas',
    points: ['Di soporte técnico y mantenimiento a equipos y sistemas, para que el personal trabajara sin interrupciones.'],
    tags: ['Soporte técnico'],
  },
];
