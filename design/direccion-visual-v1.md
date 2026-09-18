# Alex Vega — Entrando en órbita

Estado: primera propuesta visual para revisión. No implementar todavía.
Alcance: bienvenida, header/navbar, hero y comienzo del scroll. Sitio bilingüe ES/EN en alexvega.tech. Claude se encargará después de la implementación en Astro.

## Referencia visual

Ver `storyboard-apertura-v1.png`, de izquierda a derecha y arriba abajo. Generado con la herramienta integrada de imágenes: es un concepto artístico estático, no una animación funcional ni fotografía astronómica documental. No convertir la captura completa en el fondo del sitio: texto, controles y objetos deben ser independientes.

Dirección: espacio cinematográfico, fondo casi negro, marfil, azul frío y luz ámbar. Nombre grande con serif editorial; navegación y texto funcional con sans legible; cifras de progreso monoespaciadas. Las familias definitivas están pendientes de selección. El mockup muestra demasiado uso de serif en textos pequeños: ajustar en la siguiente exploración.

Paleta propuesta: fondo #06090D, texto #F3EBDD, secundario #B7C2CB, azul #A9D9EF, ámbar #EBC38A. Verificar contraste sobre las imágenes definitivas.

## Guion de movimiento

1. Carga: estrella central y compañera luminosa en órbita elíptica inclinada. Ocultación al pasar detrás y estela corta. Porcentaje y línea debajo. La órbita es movimiento ambiental, no un contador de vueltas necesario para entrar. Progreso ligado a recursos esenciales; sin espera artificial y sin bloquear por recursos de secciones posteriores. Si un recurso falla, mostrar el hero con fondo alternativo estático.
2. Preparación completa: 100 % visible brevemente, aproximadamente 150–250 ms. La órbita se abre y el indicador desaparece. No esperar una revolución completa.
3. Transición: aproximadamente 900–1200 ms. Cámara avanza; estrella se desplaza hacia arriba a la derecha, entra el borde del planeta por la derecha. La misma estrella ilumina el hero. Sin flash blanco. Desenfoque mínimo; la lectura final debe ser nítida.
4. Hero: navbar y nombre aparecen en los últimos 350–500 ms, con desplazamiento corto y opacidad. Al terminar, cesa el movimiento de cámara automático. Mantener solo ambiente muy sutil.
5. Primer scroll: durante aproximadamente una altura de pantalla, estrellas cercanas se desplazan más que el fondo, el planeta crece ligeramente y sale hacia la derecha; el texto abandona el encuadre con el documento. Scroll nativo, reversible y sin capturar la rueda. El destino posterior se diseñará en otra etapa.

Duraciones orientativas para prototipar, no aprobadas ni medidas. Evitar bucles visuales intensos y movimientos de cámara vinculados al cursor en esta primera propuesta.

## Composición y navegación

Desktop: navbar superior con AV / alexvega.tech a la izquierda; proyectos, sobre mí, contacto y ES / EN a la derecha. Nombre en dos líneas ocupa la mitad izquierda. Planeta recortado ocupa la derecha, sin invadir la lectura. Pie del hero: redes a la izquierda y pista de scroll a la derecha. Márgenes orientativos 4–6 % del ancho.

La navbar adquiere un fondo oscuro al perder contraste durante el scroll. Enlaces de proyectos y sobre mí son destinos previstos, pendientes del diseño de esas secciones. No publicar controles que no tengan destino. GitHub y LinkedIn son propuestas; faltan los perfiles reales del usuario.

Móvil: nombre y presentación arriba, planeta recortado en el tercio inferior/derecho, acciones antes del límite inferior visible. Marca, idioma y botón de menú en navbar. Menú con nombres completos, foco visible y cierre accesible. Reducir partículas y profundidad. No limitarse a encoger el desktop.

## Textos bilingües

| Elemento | ES | EN |
| --- | --- | --- |
| Carga | Preparando tu órbita | Preparing your orbit |
| Rol | Desarrollador de software | Software developer |
| Nombre | ALEX VEGA | ALEX VEGA |
| Frase | De la imaginación al software. | From imagination to software. |
| Acción | Explorar proyectos ↗ | Explore projects ↗ |
| Contacto | Hablemos | Let’s talk |
| Navegación | Proyectos / Sobre mí / Contacto | Projects / About / Contact |
| Scroll | Comienza el viaje | Begin the journey |

Primera visita: idioma del navegador, español para es y inglés en los demás casos como propuesta inicial. Elección manual persistente. Cambiar idioma mantiene la posición y no repite la bienvenida. Mostrar idioma activo de forma inequívoca. Las dos versiones deben disponer de espacio suficiente sin reducir arbitrariamente su tipografía.

## Recursos visuales y accesibilidad

El usuario desea imágenes reales. Esta lámina sirve para composición y atmósfera: todavía no se han seleccionado fotografías finales. En la siguiente fase seleccionar fotografías astronómicas con procedencia y condiciones de uso verificadas; separar esas fotografías de renders o composiciones artísticas. No presentar el planeta generado como una fotografía real ni la estrella ilustrada como una representación científica de Vega.

Necesarios después: campo estelar, textura/imagen de estrella, planeta con recorte apropiado, tratamiento de luz y versiones para móvil. Mantener texto real seleccionable fuera de las imágenes. El rendimiento y la accesibilidad forman parte de la dirección visual: contenido utilizable si la escena avanzada no carga, controles por teclado, contraste legible y versión de movimiento reducido sin viaje de cámara ni órbita continua. No anunciar cada cambio porcentual a lectores de pantalla.

## Próxima revisión

Validar atmósfera, tipografía del nombre y distribución. Luego producir hero desktop a mayor detalle y su composición móvil, seleccionar fotografía real y especificar capas para Claude. No hay código ni animación implementados. La aspiración a Awwwards orienta la ambición visual; no supone una evaluación ni garantía de premio.
