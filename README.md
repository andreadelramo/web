# Andrea del Ramo — Portfolio

Web estática en español basada en el contenido y la identidad de `AndreadelRamo_Portfolio.pdf`. Incluye cuatro casos completos, currículum, contacto y descarga del documento original.

La home une la presentación y los proyectos en una composición continua, siguiendo el nodo Figma `38:1258`: nombre y titular en mayúsculas con PP Fragment Sans Regular, segunda línea alineada a la derecha, especialización debajo con DS y OPS en azul y controles del carrusel a la derecha. Los títulos de los proyectos aparecen en tamaño de 18 px encima de las imágenes. El carrusel es infinito en ambos sentidos: después de CTT aparece GitHub y al retroceder desde GitHub aparece CTT. Admite desplazamiento táctil o con trackpad, botones anterior/siguiente y teclas izquierda/derecha, Inicio y Fin. Reutiliza las cuatro tarjetas sin clonar enlaces ni contenido accesible. El contador indica el proyecto activo. No avanza automáticamente. Sin JavaScript sigue siendo una galería horizontal con acceso al PDF.

La carga de la home tiene una entrada escalonada con fundido y desplazamiento leve: logo y navegación, líneas del titular, especialización, controles y proyectos. Se animan los elementos interiores de las tarjetas para conservar el desplazamiento del carrusel. El foco de teclado muestra los controles de inmediato y la preferencia de movimiento reducido desactiva la secuencia.

«Sobre mí» usa la misma animación que la home: 650 ms, curva `cubic-bezier(.2,.7,.2,1)` y desplazamiento de 16 px, con escalonamiento de 90 ms. En esta página los bloques se activan al entrar en la ventana durante el scroll; el logo y la navegación comparten la entrada de la home. Se evita superponer otro fundido de página a estas entradas.

En escritorio, con una altura mínima de 700 px y sin preferencia de movimiento reducido, el carrusel se alinea con el borde inferior de la ventana. La rueda sobre la galería mueve los proyectos horizontalmente con amortiguación; el arrastre añade inercia y una ligera reducción de escala que vuelve a su tamaño original al detenerse. La home termina en el carrusel. El enlace de contacto abre la sección de contacto de la página «Sobre mí». El efecto se suspende con un caso abierto. En móvil, los gestos horizontales recorren el bucle y los verticales permiten seguir desplazando la página. Con movimiento reducido, la navegación es inmediata y sin inercia ni cambios de escala.

## Vista local

Necesitas Node.js 20 o posterior. No hay dependencias que instalar.

```sh
npm run dev
```

Abre http://localhost:4173. Puedes cambiar el puerto con `PORT=4174 npm run dev`.

```sh
npm run check
npm test
```

La comprobación verifica sintaxis, referencias a archivos, anclas, imágenes y contenido de los cuatro casos. No sustituye una revisión visual y de teclado en navegador.

## Contenido

- `index.html`: presentación y carrusel de proyectos, sin contenido debajo.
- `sobre-mi.html`: página independiente adaptada al nodo Figma `38:1364`: introducción breve, retrato grande original, relato en columna estrecha, currículum y contacto compacto.
- `styles.css`: identidad, disposición responsive y movimiento reducido.
- `content.js`: textos y fotografías de los cuatro proyectos.
- `app.js`: lector de casos con diálogo nativo, navegación por historial y restauración de foco.
- `carousel-motion.js`: movimiento amortiguado, rueda y arrastre del carrusel.
- `page-effects.js`: fundido de transición entre páginas y aparición progresiva de «Sobre mí» al hacer scroll. Respeta movimiento reducido y conserva navegación por anclas, descargas, enlaces externos y Atrás/Adelante.
- `assets/`: imágenes originales de Figma con sus recortes, tipografías y PDF original.

Los enlaces de proyectos abren el lector cuando hay JavaScript y soporte de `<dialog>`. Como alternativa, enlazan directamente a la página correspondiente del PDF. Los detalles de proyecto admiten enlaces como `/#proyecto-github`.

## Recursos originales

El PDF no tiene capa de texto extraíble; los textos se transcribieron a partir de sus páginas. Las doce imágenes de los proyectos se sustituyeron por los originales de la sección Figma `40:1872`, conservando sus recortes y usando su resolución nativa. La documentación del sistema de diseño se conserva en PNG para evitar pérdida en textos; las fotografías se guardan en JPEG de alta calidad. El sello Webby se compone sobre la imagen móvil de GitHub como en el frame original. `assets/figma-image-sources.json` recoge la correspondencia de nodos y dimensiones. Se mantienen los créditos presentes en el documento. La experiencia y sus fechas reflejan el PDF facilitado, sin actualizar datos profesionales.

Para repetir la extracción inicial del PDF en macOS con Swift/PDFKit (las imágenes usadas actualmente proceden de Figma):

```sh
swift scripts/extract-portfolio.swift /ruta/AndreadelRamo_Portfolio.pdf assets
```

El argumento opcional `--ocr` solicita reconocimiento mediante Vision; su disponibilidad depende del entorno. No es necesario para ejecutar o editar la web.

## Publicación

No se ha publicado. Para alojamiento estático, subir `index.html`, `sobre-mi.html`, `styles.css`, `app.js`, `content.js`, `carousel-motion.js`, `page-effects.js` y `assets/`. No se necesita compilación, base de datos ni variables secretas.

Para preparar de nuevo los originales descargados de Figma, usar `swift scripts/prepare-figma-images.swift /ruta/originales assets`. El directorio de entrada debe contener los PNG originales con los nombres declarados en el script. No se amplían imágenes por encima de su resolución original.
