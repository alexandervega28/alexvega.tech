# Recursos astronómicos — Tierra y loading

Actualización 2026-09-17. Sustituye el planeta procedural y la estrella del prototipo.

## Tierra 3D

`public/textures/earth-blue-marble.webp` es un derivado WebP a calidad 94 del mosaico NASA Blue Marble de 2048 × 1024. Original conservado en `design/sources/earth-blue-marble-nasa.png`.

Fuente: https://svs.gsfc.nasa.gov/2915/
Archivo: https://svs.gsfc.nasa.gov/vis/a000000/a002900/a002915/bluemarble-2048.png
Crédito: NASA/Goddard Space Flight Center Scientific Visualization Studio; Reto Stöckli (NASA/GSFC) y NASA Earth Observatory.

`public/textures/earth-clouds.webp` es un derivado WebP a calidad 90 del mapa de nubes de NASA Blue Marble. Original conservado en `design/sources/earth-clouds-nasa.jpg`.
Archivo: https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg
Fuente de la colección: https://visibleearth.nasa.gov/images/57747/blue-marble-clouds
Crédito: NASA Goddard Space Flight Center / Blue Marble.

Los mapas son mosaicos históricos de observaciones satelitales, no meteorología actual. Se aplican a dos esferas independientes con rotación, iluminación y atmósfera calculadas en tiempo real. El resultado es un render 3D a partir de datos reales, no una foto de cámara fija. No se modifica la geografía ni se generan continentes.

## Agujero negro

`public/media/black-hole-nasa.webm` y `.mp4`: animación científica de NASA, vista lateral continua, sin sonido. WebM de aproximadamente 644 kB preferido; MP4 alternativo. No es una fotografía real de un agujero negro ni un render calculado en el navegador. El movimiento y la distorsión gravitacional están en la simulación original.

Fuente: https://svs.gsfc.nasa.gov/13326/
Archivo preferido: https://svs.gsfc.nasa.gov/vis/a010000/a013300/a013326/BH_AccretionDisk_Sim_Stationary_WebSize.webm
Crédito: NASA’s Goddard Space Flight Center / Jeremy Schnittman. Crédito visible en el loading.

Reproducción inline, silenciada, pausada al salir de la bienvenida y con movimiento reducido. El porcentaje corresponde a la descarga del mapa y etapas de preparación reales, no a la duración del vídeo. Si la carga es rápida, la bienvenida también lo será. No se añade una espera ficticia para mostrarla.

## Revisión

`node scripts/realism-review.mjs` usa la compilación servida en http://127.0.0.1:4323/. Las pruebas ralentizan intencionalmente la textura para observar el loading. Capturas y resultados en `review/realism/`. Comprueba reproducción, pausa posterior, móvil, movimiento reducido y fallo de textura. Si falla el mapa, se oculta el globo en lugar de mostrar un planeta inventado.

## Secuencia de espaguetización y Luna (actualización)

Por petición explícita del usuario, la bienvenida tiene ahora una secuencia cinematográfica de nueve segundos desde que el vídeo está preparado. El progreso sigue midiendo recursos; al llegar a 100 %, la etiqueta cambia a «Atravesando el horizonte». Una capa canvas anima material que se estrecha y alarga radialmente al aproximarse al agujero negro. La reproducción se ralentiza gradualmente. Es una interpretación artística de fuerzas de marea y dilatación temporal; no una simulación relativista adicional. Incluye «Saltar intro», respeta movimiento reducido y no repite la secuencia en la misma sesión.

La Luna es una esfera independiente con mapa LROC de NASA: https://svs.gsfc.nasa.gov/4720/
Original: https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_2k.tif
Crédito: NASA's Scientific Visualization Studio / Ernie Wright; datos LRO/LROC.
Archivo web: `public/textures/moon-lroc.webp`; original: `design/sources/moon-lroc-nasa.tif`.
El radio lunar es aproximadamente el 27 % del terrestre. La distancia orbital se comprime y el tiempo se acelera para componer la escena; no es una efeméride a escala. Se detiene con movimiento reducido. La ocultación ocurre mediante profundidad 3D.

Prueba conjunta: `node scripts/tidal-review.mjs`. Incluye duración de intro, salida anticipada, Luna cargada y en movimiento, reducción de movimiento, ausencia de overflow e interacción restaurada. Capturas en `review/tidal/`.

## Movimiento visible del agujero negro

La vista estacionaria se sustituye por la órbita de cámara de NASA: `BH_Accretion_Disk_Sim_360_1080.webm` y MP4, disponibles en https://svs.gsfc.nasa.gov/13326/ . Archivos locales `public/media/black-hole-orbit-nasa.*`. La toma muestra cambios de perspectiva del disco, además de su circulación interna. El inicio salta el primer 16 % para evitar el tramo inicial de poco movimiento. La velocidad se adapta a la duración del vídeo y disminuye moderadamente durante la aproximación; se elimina la reproducción casi congelada de 0.23×. El encuadre animado se recorta dentro de su propio contenedor para no tapar progreso ni botones.

Prueba específica: `scripts/orbit-loader-review.mjs` captura tres momentos y compara píxeles del vídeo original, sin contar el movimiento añadido de filamentos. Esto permite verificar cambios reales en la imagen del agujero negro. Capturas en `review/orbit-loader/`.

Vista previa de esta revisión: http://127.0.0.1:4324/ (compilación `dist-motion`). Se aisló el directorio de salida porque Windows mantenía bloqueado un vídeo servido desde `dist`. Comando: `npm run build -- --outDir dist-motion`; servir con `npm run preview -- --host 127.0.0.1 --port 4324 --outDir dist-motion`.

La prueba de fotogramas pasó: diferencias medias de 12.47 y 9.07 niveles por canal entre muestras consecutivas, calculadas sobre el vídeo sin superposiciones. Sin errores de JavaScript. Se conserva la secuencia de nueve segundos y la opción de saltarla.
