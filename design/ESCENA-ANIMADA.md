# Escena animada — implementación

La revisión del usuario reemplaza la solución de fondo aplanado del handoff anterior.

- `src/scripts/universe.ts`: Three.js/WebGL, planeta esférico con superficie procedural y nubes animadas, atmósfera, estrella con superficie animada, compañera orbital, 1.800–4.200 estrellas volumétricas y tres estelas periódicas.
- La misma estrella aparece centrada durante la preparación y se desplaza al entrar en el hero. Progreso por etapas reales: construcción, compilación GPU y fuentes. La carga rápida puede hacer que la bienvenida sea breve.
- Scroll nativo mueve la cámara 49 unidades entre las estrellas y junto al planeta. `Flight.astro` proporciona dos momentos editoriales de ese recorrido; no son proyectos inventados.
- Movimiento reducido congela rotación, brillo, órbita, cometas y cámara. Fallo de WebGL revela contenido con fondo CSS. Cambio ES/EN conserva canvas y scroll.
- No se descarga el antiguo fondo PNG. La superficie del planeta es procedural y artística, no un mapa científico ni una fotografía terrestre. Las estelas y variaciones de brillo son recursos cinematográficos.

Validación: `scripts/live-review.mjs` comprueba escritorio, móvil, reducción de movimiento, ausencia de WebGL, cambio de idioma, rotación y recorrido; resultados y capturas en `review/live/`. La consola de fallback incluye el error esperado al bloquear WebGL deliberadamente. No se han medido FPS en dispositivos móviles físicos.

La versión local de Node 20.17 no ejecuta el comprobador Astro por incompatibilidad ESM de dependencias. Se ejecutó con Node 22 actualizado: 0 errores, 0 advertencias, 0 hints. La compilación final también pasó; Vite advierte del bundle 3D de 528 kB (133 kB gzip). Los enlaces de proyectos/contacto/redes siguen pendientes de destinos reales.

Referencia técnica consultada: https://threejs.org/docs/pages/Scene.html
