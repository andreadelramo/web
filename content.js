// Transcripción del portfolio facilitado por Andrea. Sin métricas ni clientes añadidos.
export const projects = [
  {
    id: 'github', number: '01', client: 'GitHub', title: 'Maintainer Month',
    detailLayout: 'github',
    discipline: 'Diseño digital · Open source', color: '#40225d',
    cover: 'assets/github-cover.jpg',
    header: { src: 'assets/github-header.png', width: 2384, height: 1294 },
    coverAlt: 'Web de Maintainer Month en un portátil, con la ilustración y la identidad violeta del proyecto.',
    intro: 'Una experiencia que crece con su comunidad.',
    paragraphs: [
      'Maintainer Month es un proyecto open source organizado por GitHub para reconocer a las personas que mantienen y contribuyen al desarrollo de este tipo de herramientas. La particularidad del proyecto es que son sus propios usuarios quienes proponen y organizan los eventos que forman parte del calendario.',
      'Tras una primera investigación, trabajamos junto al equipo de GitHub para comprender el contexto del proyecto, sus objetivos y los elementos que lo hacían diferencial, poniendo especial foco en el carácter colaborativo del open source y en el papel activo de su comunidad.',
      'Partimos de una idea muy sencilla: construir una web que comenzase prácticamente como un empty state y que fuese cobrando vida a medida que los usuarios incorporasen nuevos eventos. Queríamos que este comportamiento no fuese únicamente una funcionalidad, sino que definiese la propia experiencia. El resultado fue una ilustración viva, creada a partir de los recursos desarrollados por la ilustradora Ariel Davis, que se completaba con cada nueva aportación de la comunidad. De esta forma, la propia web reflejaba el concepto de open source como un ecosistema construido por sus creadores. Este concepto también se trasladó a la tipografía, utilizando JetBrains Mono, una fuente open source enfocada al desarrollo, como parte del lenguaje visual del proyecto. El desarrollo se realizó en colaboración con el equipo de Ophion.',
      'El principal reto fue crear un calendario mensual capaz de adaptarse a cualquier tipo de evento, teniendo en cuenta que cada día podía contener desde 0 hasta 10 eventos. Además, eran los propios usuarios quienes los publicaban a través de un repositorio de GitHub, por lo que necesitábamos encontrar un equilibrio entre la libertad de participación y la consistencia de la experiencia. Junto al cliente y al equipo de desarrollo, definimos el contrato que debía seguir cada contribución, estableciendo una estructura y unos contenidos mínimos que permitieran mantener la coherencia del sistema sin limitar la participación de la comunidad.',
      'El proyecto recibió la felicitación del equipo de GitHub y fue reconocido por The Webby Awards como honoree en la categoría Events — General Website & Mobile Sites, poniendo en valor tanto la dirección conceptual del proyecto como la experiencia digital construida alrededor de su comunidad.'
    ],
    gallery: [
      { src: 'assets/github-calendar-framed.png', alt: 'Calendario de eventos de Maintainer Month en un portátil.' },
      { src: 'assets/github-hand-hd.jpg', alt: 'Web de Maintainer Month en un móvil sostenido frente a un fondo de hormigón.' },
      { src: 'assets/github-mobile.jpg', alt: 'Versión móvil de Maintainer Month junto al reconocimiento Webby Honoree 2023.' }
    ]
  },
  {
    id: 'exhibify', number: '02', client: 'IT Gallery', title: 'Exhibify',
    discipline: 'E-commerce · Diseño de interfaces', color: '#d5d4cf',
    cover: 'assets/exhibify-cover.jpg',
    header: { src: 'assets/exhibify-header.png', width: 2352, height: 1294 },
    coverAlt: 'Una mano sostiene un móvil con la exposición de arte de Exhibify.',
    intro: 'Una colección donde las obras marcan el ritmo.',
    paragraphs: [
      'Exhibify nace como una herramienta de art gallery para crear exposiciones virtuales de arte en 3D. Nuestro trabajo consistió en diseñar la tienda donde las obras de estas exposiciones se pondrían a la venta, definiendo tanto la experiencia como su línea visual. Para ello, trabajamos en colaboración con el equipo de weco, desarrolladores especializados en Shopify.',
      'El principal objetivo era que las obras fueran siempre el centro de la experiencia. Esto implicaba mostrar cada pieza respetando sus proporciones originales, independientemente de su formato, y construir un sistema de navegación que permitiera recorrer la colección sin que el diseño compitiera con las propias obras. Por ello, el grid que contenía el listado de obras y colecciones se convirtió en el elemento principal sobre el que construir toda la experiencia.',
      'Comenzamos definiendo una línea visual sencilla y limpia que ayudase a mantener el foco en las obras. A partir de ahí, personalizamos el grid para adaptarlo a las diferentes proporciones de las imágenes, buscando que cada obra mantuviese su presencia y que, al mismo tiempo, el conjunto funcionase como una colección coherente. El reto no estaba únicamente en crear un grid visualmente atractivo, sino en desarrollar un sistema capaz de adaptarse a cada obra sin perder consistencia.',
      'Un sistema de cards pensado para adaptarse a cada obra, no para condicionarla. Cada card se ajusta al aspect ratio de la imagen, respetando sus proporciones originales.'
    ],
    gallery: [
      { src: 'assets/exhibify-tablet.jpg', alt: 'Colección de obras de Exhibify en una tableta y un teléfono sobre una mesa de madera.', caption: 'Un grid que respeta las proporciones de cada obra.' },
      { src: 'assets/exhibify-desktop.jpg', alt: 'Vista de las exposiciones de Exhibify en un portátil.', caption: 'La obra como centro de la experiencia.' }
    ]
  },
  {
    id: 'natural-typography', number: '03', client: 'Proyecto personal', title: 'Natural Typography',
    detailLayout: 'natural',
    discipline: 'Tipografía · Diseño y desarrollo web', color: '#d5d4cf',
    cover: 'assets/natural-header-hd.png',
    coverAlt: 'La web de Natural Typography en un portátil frente a un fondo amarillo lima.',
    header: { src: 'assets/natural-header-hd.png', width: 2639, height: 1760, alt: 'La web de Natural Typography en un portátil frente a un fondo amarillo lima.' },
    intro: 'La personalidad de escribir a mano.',
    sections: [
      {
        id: 'origin', title: 'Origen',
        paragraphs: ['Nace como proyecto personal sobre el gusto por la tipografía y la caligrafía manual. Al documentar procesos, me interesaba incorporar contenido escrito a mano, pero sentía que muchas tipografías de estilo handmade perdían autenticidad: sus caracteres solían ser demasiado uniformes. Quería trasladar al entorno digital las pequeñas variaciones que aparecen al escribir y crear una tipografía capaz de reflejar esa aleatoriedad.']
      },
      {
        id: 'development', title: 'Desarrollo', specimen: true,
        paragraphs: [
          'Empecé con una pequeña prueba para comprobar si era posible crear letras que alternaran entre distintas formas. Como era mi primera experiencia desarrollando una tipografía, investigué varias herramientas, sus límites y cómo incorporar funciones programables.',
          'Para empezar, trabajé con solo dos glifos y creé dos variantes de cada uno. Esto me ayudó a entender la relación entre las formas y cómo pasar de una a otra. Después, conecté las variantes con clases de CSS y un script en JavaScript para que alternaran de forma dinámica. Así pude explorar tanto el diseño de las letras como su comportamiento.',
          'Por último, apliqué esa misma lógica al resto de los caracteres de la tipografía.'
        ]
      },
      {
        id: 'result', title: 'Resultado',
        paragraphs: ['El resultado es una tipografía funcional con un toque de aleatoriedad. La web de presentación sigue esta misma idea: el bloque de descripción muestra composiciones creadas con la tipografía y las demostraciones exploran algunos de sus usos con animaciones y ejemplos prácticos.'],
        link: { label: 'Natural Typography Web', href: 'https://andreadelramo.github.io/NaturalTypography/' }
      }
    ],
    moodboard: [
      { src: 'assets/natural-mood-poster-hd.png', alt: 'Cartel de una fiesta con ilustración y caligrafía manual.', bounds: [0, 0, 229.526, 284.44] },
      { src: 'assets/natural-mood-idea-hd.png', alt: 'Composición manuscrita con el texto The idea of it vs. it.', bounds: [239.8, 0, 460.194, 321.837] },
      { src: 'assets/natural-mood-photo-hd.png', alt: 'Fotografía en blanco y negro con anotaciones manuscritas.', bounds: [0, 303.7, 229.526, 291.239] },
      { src: 'assets/natural-mood-dancer.png', alt: 'Fotografía de un bailarín rodeada de caligrafía amarilla.', bounds: [239.8, 333.2, 460.194, 564.347] },
      { src: 'assets/natural-mood-notes.png', alt: 'Notas manuscritas y tachaduras como referencia de variación caligráfica.', bounds: [735.391, 0, 583.656, 505.398] },
      { src: 'assets/natural-mood-portrait-hd.png', alt: 'Retrato en blanco y negro con la frase manuscrita I am a loner.', bounds: [735.52, 552, 292, 346] }
    ],
    previews: [
      { slot: 'statement', src: 'assets/natural-preview-statement-hd.png', alt: 'Composición de la web que presenta la aleatoriedad de la caligrafía real.' },
      { slot: 'glyphs', src: 'assets/natural-preview-glyphs-hd.png', alt: 'Letra R y repertorio de glifos de Natural Typography.' },
      { slot: 'tester', src: 'assets/natural-preview-tester-hd.png', alt: 'Probador de Natural Typography con controles de texto, color y tamaño.' },
      { slot: 'description', src: 'assets/natural-preview-description-hd.png', alt: 'Composiciones y fotografías de la sección de descripción de Natural Typography.' }
    ]
  },
  {
    id: 'dokify', number: '04', client: 'Dokify', title: 'Sistema de diseño',
    discipline: 'Design systems · Producto digital', color: '#a5a0d4',
    cover: 'assets/dokify-cover.jpg',
    header: { src: 'assets/dokify-header.png', width: 2368, height: 1294 },
    coverAlt: 'Aplicación de homologación de proveedores de Dokify en un portátil sobre fondo lavanda.',
    intro: 'Una base común para un producto que evoluciona.',
    paragraphs: [
      'Dokify es una empresa especializada en la optimización de procesos. Nuestro trabajo consistió en establecer los cimientos de su sistema de diseño para poder revitalizar progresivamente sus aplicaciones. Comenzamos con su aplicación de Homologación, que ayuda a vendedores y proveedores a automatizar la gestión documental. Aunque la aplicación ya estaba en funcionamiento, existía la necesidad de actualizarla y mejorar algunas de sus funcionalidades.',
      'Para definir la nueva experiencia, comenzamos diseñando y probando los principales flujos mediante wireframes. Este proceso nos permitió definir componentes clave de la aplicación, como el buscador, listados y formularios. Un ejemplo fue la mejora de los listados de proveedores, donde identificamos nuevas necesidades que posteriormente trasladamos a los componentes del sistema. Las pantallas validadas durante esta fase, se transformaron en páginas maestras y plantillas del DS que sentaron las bases de las siguientes aplicaciones.',
      'En este proyecto contamos con la colaboración de Brian Farrell fundador del estudio FarCo, que colaboró en la definición de la identidad visual y aportó su experiencia en la creación de sistemas de diseño.',
      'En lo que respecta a las foundations y marca de Dokify, les ayudamos a impulsar sus bases y creamos una estructura visual que abarcó colores, tipografía, sombras, iconografía e ilustraciones, además de establecer normas de uso y recomendaciones para garantizar una aplicación coherente del sistema.',
      'Todo este trabajo se documentó en un archivo de diseño y en un proyecto de Storybook, donde se alojaban los componentes desarrollados en React. De esta forma, el proyecto no se limitó a actualizar una aplicación, sino que estableció una base visual y técnica preparada para evolucionar y dar soporte al resto de productos de Dokify.'
    ],
    gallery: [
      { src: 'assets/dokify-system.png', alt: 'Documentación del sistema de diseño de Dokify: colores, iconografía, campos de texto y botones.', caption: 'Foundations, componentes y documentación del sistema.' },
      { src: 'assets/dokify-mobile.jpg', alt: 'Listado de productos y servicios de Dokify en un teléfono sobre fondo naranja.', caption: 'Un lenguaje compartido entre productos y dispositivos.' }
    ]
  },
  {
    id: 'ctt', number: '05', client: 'CTT Express', title: 'Web cliente',
    discipline: 'Diseño UI · Logística', color: '#d34c31',
    cover: 'assets/ctt-cover.jpg',
    header: { src: 'assets/ctt-header.png', width: 2324, height: 1418 },
    coverAlt: 'Panel de seguimiento de envíos de CTT Express en un portátil sobre un sofá rojo.',
    intro: 'Claridad para gestionar procesos complejos.',
    paragraphs: [
      'Ctt es una de las principales empresas de paquetería de Portugal y comenzó su expansión por la península ibérica en 2020. El proyecto partía de la necesidad de mejorar su aplicación, inicialmente orientada a pequeñas empresas y posteriormente adaptada a las necesidades de grandes corporaciones como Amazon. Nuestro trabajo se centró principalmente en la UI, en estrecha colaboración con el equipo de experiencia de usuario.',
      'Partíamos de una identidad de marca recientemente renovada por el cliente y de diferentes referencias sobre cómo aplicaban visualmente la nueva marca. Para entender los patrones y comportamientos habituales del sector, también analizamos otras aplicaciones de paquetería. A partir de este contexto, desarrollamos una línea visual limpia y contenida, utilizando únicamente el rojo de marca en las llamadas a la acción. Esta decisión ayudaba a establecer una jerarquía clara y evitaba que el usuario pudiera confundir las acciones con alertas de la interfaz o mensajes de error.',
      'Dos de los puntos principales de la aplicación eran el proceso de creación de envíos y su posterior seguimiento. La solicitud de un nuevo envío se estructuró como un formulario dividido en cinco pasos, donde la jerarquía y legibilidad de la información eran especialmente importantes. Una vez creado el envío, el seguimiento debía permitir al usuario entender rápidamente en qué punto se encontraba, visualizar su progreso e identificar cualquier incidencia para poder actuar sobre ella.',
      'Durante el proyecto también asumimos el desarrollo de diferentes elementos de la interfaz, como la iconografía, gráficas, ilustraciones y animaciones. Estos recursos se diseñaron para reforzar la comprensión de los flujos principales y aportar feedback durante momentos clave de la experiencia, especialmente en el seguimiento de los envíos. De esta forma, la dirección visual no se limitó a aplicar la nueva identidad de CTT, sino que ayudó a hacer más clara y comprensible una aplicación con procesos complejos.'
    ],
    gallery: [
      { src: 'assets/ctt-shipping.jpg', alt: 'Proceso de solicitud de un envío en la web cliente de CTT Express.', caption: 'Un proceso de creación de envíos organizado en cinco pasos.' },
      { src: 'assets/ctt-mobile.jpg', alt: 'Seguimiento de envíos de CTT Express en un móvil sobre fondo rojo.', caption: 'Estado, progreso e incidencias, también en móvil.' }
    ]
  }
];
