# alexvega.tech

Portafolio bilingüe de Alex Vega construido con Astro y Three.js.

## Desarrollo

Usar Node.js 22.19 o posterior de la rama 22.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

## Experiencia actual

- Español en `/` e inglés en `/en/`, con selección de idioma persistente.
- Bienvenida de nueve segundos con recorrido de cámara alrededor de un agujero negro, filamentos animados y opción de saltar la intro.
- Tierra y Luna 3D con mapas de NASA, rotación, órbita lunar, nubes y atmósfera.
- Estrellas en profundidad, cometas y cámara controlada por scroll.
- Navegación adaptable y alternativa con movimiento reducido.

Los medios del agujero negro son simulaciones científicas pregrabadas de NASA. Tierra y Luna se renderizan en tiempo real usando mapas astronómicos. Los filamentos del loading, las velocidades y las distancias orbitales son decisiones artísticas.

Fuentes, créditos y detalles en [design/RECURSOS-ASTRONOMICOS.md](design/RECURSOS-ASTRONOMICOS.md). Las primeras propuestas de `design/` documentan la evolución del proyecto; las revisiones posteriores sustituyen al diseño inicial estático.

## Revisión en navegador

Los scripts usan Puppeteer y Chrome instalado. Las capturas y resultados se guardan en `review/`, fuera del repositorio.

- `scripts/orbit-loader-review.mjs`: comprueba movimiento del vídeo mediante diferencias entre fotogramas. Acepta `BASE_URL`; por defecto usa el puerto 4324.
- `scripts/tidal-review.mjs`: duración de intro, salto, Luna y movimiento reducido; puerto 4323.
- `scripts/realism-review.mjs`: texturas, reproducción y fallos de carga; puerto 4323.
- `scripts/live-review.mjs`: escena, scroll e idioma; puerto 4322.

Los scripts `shots.mjs` y `behaviour.mjs` pertenecen al prototipo inicial con fondo estático y requieren adaptación antes de usarse como validación de la escena actual.

## Pendiente

Completar proyectos, contenido personal y destinos de contacto/redes en `src/config/site.ts`. Medir rendimiento en móviles físicos antes de publicar la versión final.

Este repositorio incluye el código, los medios necesarios y la documentación visual. No incluye dependencias instaladas, compilaciones, variables de entorno ni capturas de revisión.
