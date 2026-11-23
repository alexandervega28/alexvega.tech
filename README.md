# alexvega.tech

Web profesional de Alexander Vega, hecha con Astro. Es un sitio estático con estilo neo-brutalista: bordes gruesos y sombras sólidas en relieve, con la paleta #13284A / #A8C8EA / #FFC61A y la fuente Roboto.

## Desarrollo

Requiere Node 22.23.4 o posterior (ver `.nvmrc`).

```sh
npm ci
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview
```

## Dónde está cada cosa

- `src/data/site.ts`: datos comunes (contacto, redes, stack) y tipos.
- `src/data/es.ts` y `src/data/en.ts`: todos los textos y la experiencia en cada idioma. Deben tener la misma forma.
- `src/pages/index.astro` (español, por defecto) y `src/pages/en/index.astro` (inglés): ambas usan `src/components/Home.astro`.
- `src/components/`: Header, Hero, Stack, Experience y Contact.
- `src/styles/global.css`: tokens de color y estilos del relieve (`.raised`, `.press`, `.btn`).
- `public/`: foto, CV en PDF y favicon.

## Despliegue

Cloudflare Pages con el comando de build `npm run build` y el directorio de salida `dist`.
