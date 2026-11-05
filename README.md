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

- `src/data/site.ts`: textos, tecnologías del stack, experiencia y datos de contacto.
- `src/components/`: Header, Hero, Stack, Experience y Contact.
- `src/styles/global.css`: tokens de color y estilos del relieve (`.raised`, `.press`, `.btn`).
- `public/`: foto, CV en PDF y favicon.

## Despliegue

Cloudflare Pages con el comando de build `npm run build` y el directorio de salida `dist`.
