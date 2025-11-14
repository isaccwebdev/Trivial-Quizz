
# Trivia Quiz - Juego Interactivo 

¡Bienvenido a **Trivia Quiz**! 🖥️🎮  
Un juego de preguntas tipo quiz donde puedes aprender y practicar sobre **El tema que quieras**  mientras te diviertes.

El juego lee las preguntas desde un archivo JSON, ¡así que puedes crear tus propios cuestionarios sin tocar el código!

---

## 🎯 Características

- Carga **preguntas dinámicamente** desde archivos JSON.
- Interfaz web simple y responsive.
- Indicador de progreso: muestra la pregunta actual y el total de preguntas.
- Calcula y muestra tu **puntaje final** al terminar.
- Permite agregar preguntas desde la carpeta `data/` sin modificar el código.

---

## 📁 Estructura del Proyecto

```

project-root/
│
├─ data/
│   └─ preguntas.json       # JSON con todas las preguntas
│
├─ public/
│   └─ index.html           # Interfaz web del juego
│
├─ src/
│   ├─ main.js              # Lógica del juego
│   └─ main.css             # Estilos del juego
│
└─ README.md                # Este archivo

````

## 📄 Formato del JSON

Cada archivo JSON debe seguir este formato:

```json
[
  {
    "pregunta": "¿Cuál es la capital de Francia?",
    "opciones": ["Lyon", "Marsella", "París"],
    "correcta": 2
  },
  {
    "pregunta": "¿Qué significa LAN?",
    "opciones": ["Large Area Network", "Local Area Network", "Long Access Network"],
    "correcta": 1
  }
]
````

* `pregunta`: Texto de la pregunta.
* `opciones`: Array con las posibles respuestas.
* `correcta`: Índice de la opción correcta (empieza en 0).

> 💡 Tip: Puedes añadir todas las preguntas que quieras, solo asegúrate de mantener el formato.

---

## 🚀 Cómo jugar 

En local:

1. Coloca tu JSON en la carpeta `data/` (por ejemplo `preguntas.json`).
2. Abre `index.html` en tu navegador.
3. El juego cargará automáticamente las preguntas.
4. Selecciona tu respuesta y avanza a la siguiente.
5. Al finalizar, verás tu **puntaje final**.

Online:
La opcion mas comoda, pega el url del json en el campo url, asegurandote de copiar el raw de github
---

## ✨ Personalización

* Cambia los colores y fuentes en `styles.css`.
* Modifica la interfaz o añade animaciones en `index.html` y `main.js`.
* Agrega categorías de preguntas creando múltiples archivos JSON y cargándolos según la elección del jugador.

---

## 🛠 Requisitos

* Navegador moderno (Chrome, Edge, Firefox).
* No necesita servidor web para funcionar (opcional si quieres usar fetch en local, usar Live Server de VSCode).

---

## 📌 Contribuciones

* Puedes crear nuevos JSON con preguntas.
* Mantén el formato para que el juego funcione sin errores.
* Comparte tus packs de preguntas con otros jugadores.

---

## 📜 Licencia

MIT License

---

¡Diviértete aprendiendo  mientras juegas! 🚀

