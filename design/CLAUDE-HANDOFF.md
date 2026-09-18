# Entrega visual — apertura alexvega.tech

El usuario aprobó la dirección visual del storyboard. Codex prepara diseño y recursos; Claude implementa Astro. Alcance actual: loading, transición, navbar y hero bilingüe. No desarrollar aún el resto de la web.

## Archivos

- `storyboard-apertura-v1.png`: secuencia aprobada.
- `hero-responsive-v1.png`: composición de escritorio en español y móvil en inglés; ambos idiomas deben funcionar en ambos tamaños.
- `assets/hero-space-master-v1.png`: fondo sin texto, generado con IA, para primera integración y modo estático. Sol y planeta están aplanados en esta imagen: no permite moverlos de forma independiente. No simular que este fondo por sí solo ofrece parallax por objeto.
- `references/nasa-s66-38275.jpg`: fotografía real del limbo terrestre al amanecer desde Gemini 9-A, 3–6 junio 1966. Crédito NASA. Referencia de luz y atmósfera, no sustituto idéntico del fondo artístico.
- `direccion-visual-v1.md`: paleta, traducciones y dirección base. Su estado inicial de propuesta queda actualizado por la aprobación del usuario; las medidas siguientes concretan el diseño.
- `prompts-produccion-v1.txt`: prompts de los dos nuevos recursos generados mediante la herramienta integrada de imágenes.

## Medidas de referencia

Desktop 1440 × 960: márgenes 64 px, navbar a 32 px del borde superior, área mínima interactiva de 44 px. Contenido inicia cerca de x64/y240, ancho máximo 640 px. Nombre serif de alto contraste, tamaño orientativo 160 px, interlineado 0.84; ajustar según métricas reales. Rol sans 13 px con espaciado 0.18em. Frase 30 px; acciones 18 px separadas 48 px, 40 px debajo de la frase. Pie a 40 px del borde inferior. Evitar imponer alturas fijas si texto o zoom requieren más espacio.

Móvil 390 × 844: márgenes 24 px, navbar a 24 px. Rol cerca de y170; nombre 100 px orientativos, limitado al ancho disponible; frase 21 px y permitida en dos líneas. Acciones apiladas con separación de 16 px, superficies de al menos 44 px. Planeta en mitad inferior, nombre sobre negro. Redes y pista de scroll pueden ocupar filas separadas: el mockup las muestra demasiado juntas para convertirlo literalmente en objetivo de interacción.

En anchuras intermedias pasar a navegación compacta antes de que colisionen los textos. Comprobar 320, 390, 768, 1024 y 1440 px y zoom al 200 %. Mantener el orden de lectura con el contenido en flujo.

## Capas de la escena animada

Del fondo al frente: negro base, estrellas lejanas, estrella/sol, planeta con atmósfera, estrellas cercanas, arco orbital decorativo, velo de contraste, contenido y navbar. La órbita del loader necesita tramos delante y detrás de la estrella para la ocultación. La estrella acompañante es un punto luminoso con halo corto. Para la escena avanzada, construir capas independientes; el master sirve de referencia visual y fallback. No duplicar un sol animado encima del sol ya integrado en el master.

Primera integración posible: master estático, estrellas cercanas independientes y transición por fundido. Eso es un prototipo simplificado: el viaje completo exige separar/renderizar planeta y estrella. No anunciar la animación completa como terminada usando solo zoom sobre el master.

## Cronología

| Estado | Tiempo | Comportamiento |
| --- | --- | --- |
| Preparando recursos esenciales | Variable | Órbita de 3.2 s por vuelta, curva lineal; progreso real y monótono debajo |
| Recursos listos | 180 ms | 100 % visible; no esperar a terminar una órbita |
| Salida de loading | 0–250 ms | Indicador y etiqueta se desvanecen |
| Viaje | 0–1100 ms | Estrella de centro a 80 % ancho / 25 % alto; planeta entra desde derecha; suavizado de entrada y salida |
| Revelado | 650–1100 ms | Navbar, rol, nombre y acciones aparecen en orden; desplazamiento vertical máximo 16 px |
| Reposo | Indefinido | Cámara quieta; sin movimiento continuo que dificulte lectura |

Los tiempos se solapan, no se suman todos. El loader no debe retrasar artificialmente el contenido. Si la carga falla o supera 5 s, entrar con fallback y continuar sin el recurso fallido. Segunda visita dentro de la sesión: omitir viaje y mostrar hero con fundido corto. Con movimiento reducido: sin órbita continua, viaje ni parallax; progreso visible solo si es necesario.

Primer scroll (progreso normalizado 0 a 1 durante una altura de viewport): fondo de 0 a -24 px, estrellas cercanas de 0 a -120 px, planeta de escala 1 a 1.12 y traslación horizontal de 0 a 80 px. Estas cifras son objetivos de prototipo desktop, no valores absolutos para móvil. Móvil: movimiento máximo reducido a un tercio o fondo estático. El texto se desplaza naturalmente con el documento; no ocultarlo antes de poder leerlo. Scroll reversible, sin secuestrar rueda ni tacto. Como no hay segunda sección todavía, demostrar este recorrido solo en una vista de revisión; no agregar secciones vacías al sitio publicado.

## Interacciones

Enlaces: subrayado crece en 180 ms, foco visible equivalente al hover. ES / EN: idioma activo marcado por subrayado y semántica, nunca solo color. Cambio instantáneo, sin loader, conservando scroll. Navbar: fondo oscuro cuando necesita contraste. Menú móvil: desplegable de navegación, cierre con Escape, foco gestionado y botón con estado anunciado. Sin sonido automático ni cursor personalizado.

Textos completos ES/EN en `direccion-visual-v1.md`. Aún faltan URLs reales de GitHub, LinkedIn y contacto. No inventarlas. En la vista de revisión marcar esos destinos como pendientes; no publicar enlaces falsos ni formularios que aparenten enviar mensajes.

## Fotografía y procedencia

La imagen artística generada NO es fotografía de la Tierra. La fotografía real descargada puede informar el tratamiento atmosférico; la versión final que priorice fotografía debe trabajar con medios auténticos o texturas científicas identificadas. No describir renders como fotos.

Ficha NASA: https://images.nasa.gov/details/s66-38275
Archivo descargado: https://images-assets.nasa.gov/image/s66-38275/s66-38275~medium.jpg
Metadatos consultados: https://images-api.nasa.gov/search?q=earth%20limb%20sunrise&media_type=image&page_size=3
Guía de uso consultada: https://www.nasa.gov/nasa-brand-center/images-and-media/
Conservar crédito NASA; no incorporar logos ni insinuar respaldo institucional.

## Criterios de revisión

Nombre, rol y acciones son texto real. Controles accesibles con teclado. No overflow horizontal en ES/EN ni controles sobre zonas luminosas. Reducir movimiento funciona. Fallo de imagen no impide leer ni navegar. Progreso no ficticio. Evitar descargar recursos de futuras secciones en el loader. Crear derivados web optimizados antes de publicar; el PNG master no es un presupuesto de descarga aceptado. Comprobar visualmente contra las láminas y medir rendimiento en el prototipo real: todavía no existen mediciones ni animación ejecutable.
