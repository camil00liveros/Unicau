# Clon visual: Universidad del Cauca (portada)

Réplica en HTML, CSS y JavaScript (sin frameworks) del encabezado y el slider de
https://www.unicauca.edu.co/

Incluye: encabezado (barra superior, barra principal y menús desplegables), **slider vacío listo para tus
imágenes**, botón verde de accesibilidad, botón rojo de accesos rápidos, buscador, botón flotante de WhatsApp
y un pie de página con código QR de WhatsApp (120 x 120 px).

## Cómo ejecutarlo en Visual Studio Code

1. Descomprime la carpeta y ábrela en VS Code (Archivo > Abrir carpeta).
2. Instala la extensión **Live Server** (Ritwick Dey).
3. Clic derecho sobre `index.html` > **Open with Live Server**.
   (También puedes abrir `index.html` directamente en el navegador.)

## Estructura

```
clon-permaneser/
├── index.html
├── css/styles.css
├── js/main.js
└── assets/
    ├── slider/          <- aquí van TUS imágenes del slider
    └── img/             <- logo, íconos y QR (los locales son opcionales)
        └── qr-whatsapp.svg
```

## Cómo agregar tus imágenes al slider

1. Copia tus imágenes a `assets/slider/` (tamaño recomendado: **1800 x 784 px**, proporción 2.3 : 1;
   si tienen otra proporción se recortan para llenar el espacio).
2. Abre `index.html`, busca `PEGA AQUÍ TUS DIAPOSITIVAS` y, dentro de `<div class="slider__track">`,
   agrega un bloque por cada imagen:

```html
<figure class="slide">
  <img src="assets/slider/mi-imagen.jpg" alt="Describe la imagen">
  <a class="slide__btn" href="https://...">Ver más</a>   <!-- botón opcional -->
</figure>
```

Comportamiento (automático):
- **0 imágenes:** se ve el slider vacío con un aviso.
- **1 imagen:** se muestra fija, sin flechas.
- **2 o más:** flechas, puntos, cambio automático cada 6 segundos (se pausa al pasar el mouse),
  teclas ← → y deslizar con el dedo en móvil.

Para cambiar el tiempo de cambio automático, edita `AUTOPLAY_MS` en `js/main.js`.

## Imágenes del encabezado

Cada imagen se busca **primero en `assets/img/`** y, si no existe, se carga desde la URL original de Unicauca.
Por eso se ve completo con internet aunque la carpeta esté vacía. Para usarlo sin internet, descarga estos
archivos y guárdalos con el nombre indicado:

| Nombre local              | URL original |
|---------------------------|--------------|
| logo-unicauca.png         | https://www.unicauca.edu.co/wp-content/uploads/2023/11/Logo-Universidad-del-Cauca-e1715273370946.png |
| correo.svg                | https://www.unicauca.edu.co/wp-content/uploads/2023/10/Correo.svg |
| biblioteca.svg            | https://www.unicauca.edu.co/wp-content/uploads/2023/10/Biblioteca.svg |
| perfiles.svg              | https://www.unicauca.edu.co/wp-content/uploads/2023/10/Perfiles.svg |
| idioma.svg                | https://www.unicauca.edu.co/wp-content/uploads/2023/10/Idioma.svg |
| calendario-academico.png  | https://www.unicauca.edu.co/wp-content/uploads/2023/07/Calendario-Academico_Blanco@3x.png |
| simca.png                 | https://www.unicauca.edu.co/wp-content/uploads/2023/08/SIMCA@300x.png |
| lvmen.png                 | https://www.unicauca.edu.co/wp-content/uploads/2023/08/LVMEN@300x.png |
| psi.png                   | https://www.unicauca.edu.co/wp-content/uploads/2023/08/psi_2@300x.png |
| pse.png                   | https://www.unicauca.edu.co/wp-content/uploads/2023/08/pse@300x.png |

## WhatsApp y código QR

- Número configurado: **+57 318 003 2204**, enlace `https://wa.me/573180032204`.
- El enlace aparece en dos lugares de `index.html`: el botón flotante (`class="whatsapp"`) y el QR del footer.
- Para cambiar el número, edita ambos enlaces (`wa.me/57` + número, sin espacios) y genera un QR nuevo
  con esa misma URL, guardándolo como `assets/img/qr-whatsapp.svg` (o `.png`; si es PNG, actualiza el
  `src` del `<img>` del footer).
- El mensaje del globo del botón está en `<span class="whatsapp__tip">`.

## Personalización rápida

- Colores y variables: al inicio de `css/styles.css` (`:root`).
- Fuente: **Exo 2** (Google Fonts), la más parecida a la del sitio.
- Resaltado de "Admisiones" en la barra (como en la captura): quita `class="is-active"` en `index.html`.
- Las herramientas de accesibilidad guardan su estado en `localStorage`.
