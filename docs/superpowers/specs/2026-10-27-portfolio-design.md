# Portfolio de Andrea del Ramo Martín

## Intención

Convertir AndreadelRamo_Portfolio.pdf en una web de portfolio en español, usando su identidad y contenido. La referencia de experiencia es https://brandonyasin.com/. El objetivo es que una persona pueda conocer la especialización de Andrea, explorar sus cuatro proyectos y contactar con ella.

## Actualización solicitada: carrusel en la home

La usuaria solicita cambiar únicamente la sección de proyectos por un carrusel y conservar el primer bloque original. La portada mantiene «Diseñadora de producto», sus textos, tamaño, composición y acceso a proyectos. Debajo, la galería en columnas se sustituye por un carrusel con imágenes grandes y parte del siguiente proyecto visible. Se mantienen la identidad negra, blanca y azul y los casos completos. El carrusel admite desplazamiento nativo horizontal, controles anterior/siguiente y teclado; no avanza automáticamente. Su número, título y descripción reflejan el proyecto activo. En móvil se mantiene el carrusel y se puede deslizar con el dedo. La implementación conserva los enlaces al PDF cuando JavaScript no está disponible.

## Dirección elegida

Se consideraron dos alternativas: una experiencia inmersiva con imágenes grandes y transiciones suaves, o una lectura editorial continua más cercana al PDF. La usuaria eligió la primera. Tiene mayor presencia visual y exige adaptar cuidadosamente la navegación y las animaciones a móvil.

## Identidad y contenido

- Conservar negro, blanco y azul como acento; gris claro en las superficies donde ayude a leer.
- Tipografía sans serif, titulares grandes, numeración de proyectos y composición editorial con espacio generoso.
- Nombre: Andrea del Ramo Martín.
- Presentación: diseñadora de producto especializada en UI y sistemas de diseño.
- Mantener las imágenes, textos, atribuciones y reconocimiento de los proyectos del PDF. No atribuir a Andrea las credenciales, clientes o premios de la web de referencia.
- Mantener biografía, experiencia, formación, herramientas y contactos del PDF. Las fechas y la expresión «actualidad» se conservarán como información del documento, sin inventar actualizaciones.

## Estructura y comportamiento propuestos

### Inicio

Cabecera con nombre y accesos a Proyectos, Sobre mí y Contacto. Portada negra con el nombre en azul, presentación breve y un titular de gran escala inspirado en la portada del PDF. Un acceso visible lleva a los proyectos.

### Proyectos

Cuatro proyectos, en el orden del documento: GitHub / Maintainer Month; IT Gallery / Exhibify; Dokify / Sistema de diseño; CTT Express / Web cliente. Cada entrada combina una imagen protagonista, cliente, título y número. Al abrirla se muestra un detalle de lectura con el texto y todas sus imágenes del PDF. Se puede cerrar para volver a la misma posición de la lista. Evitar nuevas rutas innecesarias; usar detalles accesibles dentro de la misma aplicación.

### Sobre mí

Biografía y retrato del PDF, con experiencia, formación y herramientas organizadas para facilitar la lectura. La presentación resumida no sustituye los contenidos completos.

### Contacto

Cierre tipográfico de gran escala con el correo andreadelramo@gmail.com y los perfiles de LinkedIn e Instagram indicados en el PDF. Añadir acceso al PDF original. Usar enlaces reales; no añadir un formulario que simule enviar mensajes.

## Movimiento y adaptación

Transiciones discretas de entrada, cambio de imagen y apertura de proyecto. La navegación debe funcionar con teclado y pantalla táctil. Respetar la preferencia de movimiento reducido, mantener foco visible y devolverlo al elemento que abrió un detalle. Los textos y enlaces deben seguir siendo utilizables sin animaciones. En móvil se apilan textos e imágenes, conservando sus proporciones. No bloquear el desplazamiento normal ni depender de un cursor personalizado.

## Decisiones técnicas propuestas

El repositorio contiene únicamente README.md. Propongo una web estática en HTML, CSS y JavaScript, sin dependencias de ejecución ni servicios externos, con archivos locales para las imágenes y el PDF. Esta elección permite revisar la web localmente y alojarla como sitio estático. No se publicará como parte de esta fase de diseño.

Extraer los recursos del PDF, preservando las imágenes originales cuando sea posible. El PDF está compuesto por páginas sin capa de texto extraíble; transcribir y contrastar el contenido visualmente. No generar imágenes sustitutivas de los proyectos.

## Verificación

Comprobar apertura y cierre de los cuatro proyectos, navegación por teclado, enlaces de contacto, acceso al PDF, adaptación a móvil y movimiento reducido. Comprobar sintaxis y referencias a archivos locales. La comparación visual con la referencia requiere capturas: hasta ahora se ha leído su contenido web, pero no se ha inspeccionado una captura de su aspecto o animaciones. La fidelidad visual a esa referencia no está verificada.

## Límites y decisiones de implementación

No incluir administración, cuentas, base de datos, analítica, traducciones o proyectos que no aparezcan en el PDF. El detalle exacto de espaciados, escalas, recortes y tiempos de transición queda a criterio de implementación dentro de esta dirección. Si la herramienta de navegador no está disponible, comunicar esa limitación y no afirmar que se ha realizado una revisión visual en navegador.
