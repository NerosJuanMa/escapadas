# 🌍 Gestor de Escapadas y Viajes

Una aplicación web interactiva para registrar, planificar y gestionar recuerdos de viajes o escapadas pendientes. Permite clasificar los destinos por categorías, cambiar su estado entre "Pendiente" o "Visitado", y editarlos o eliminarlos en tiempo real.

Este proyecto implementa una arquitectura limpia basada en el patrón **MVC (Modelo-Vista-Controlador)** en el backend y una comunicación REST semántica en el frontend.

---

## 🚀 Características

* **Operaciones CRUD Completas**: Crear, Leer, Actualizar y Borrar viajes de forma persistente.
* **Arquitectura MVC**: Separación estricta de responsabilidades en el servidor (Rutas, Controladores y Modelos).
* **API REST Semántica**: Uso correcto de los verbos HTTP (`GET`, `POST`, `PUT`, `DELETE`) pasándole datos estructurados en formato JSON a través del cuerpo (`body`) de las peticiones.
* **Autoincremento Seguro**: Sistema inteligente en el backend para calcular IDs autoincrementales correlativos basados en archivos locales, evitando colisiones incluso al borrar registros.
* **Vista Previa Dinámica**: Visualización en tiempo real de la imagen miniatura en el formulario mediante enlaces URL externos antes de guardar la experiencia.
* **UX Optimizada**: Desplazamiento suave (*scroll*) automático al editar, opción de cancelar cambios y sistema de filtrado rápido por estados ("Todos", "Pendientes", "Visitados").
* **Control de Enlaces Rotos**: Manejo de eventos `onerror` en JavaScript para evitar imágenes caídas si la URL externa no es válida.

---

## 📁 Estructura del Proyecto

```text
proyecto-viajes/
├── src/
│   ├── backend/
│   │   ├── controllers/
│   │   │   └── viaje.controller.js   # Lógica de negocio y manejo de req/res
│   │   ├── models/
│   │   │   └── viaje.model.js        # Persistencia de datos y lectura/escritura JSON
│   │   ├── routes/
│   │   │   └── viaje.routes.js       # Definición de endpoints semánticos
│   │   ├── viajes.json               # Base de datos local en formato JSON
│   │   └── server.js                 # Servidor central Express y middlewares
│   └── frontend/
│       ├── app.js                    # Lógica interactiva y peticiones fetch
│       ├── index.html                # Interfaz de usuario y formulario
│       └── estilos.css               # Diseño visual de la aplicación
├── README.md                         # Documentación del proyecto
└── package.json                      # Configuración de dependencias de Node.js
```

---

## 🛠️ Tecnologías Utilizadas

* **Frontend**: HTML5, CSS3, JavaScript Moderno (ES6+, Async/Await, Fetch API).
* **Backend**: Node.js, Express.js, Cors.
* **Módulos**: ES Modules nativos (`import`/`export`).
* **Persistencia**: Sistema de archivos local (`fs` de Node.js).

---

## ⚙️ Instalación y Uso

Sigue estos pasos para levantar el proyecto en tu entorno local:

### 1. Clonar el repositorio
```bash
git clone https://github.com
cd TU_REPOSITORIO
```

### 2. Instalar dependencias
Asegúrate de tener instalado [Node.js](https://nodejs.org). Ejecuta en la terminal principal para instalar Express y CORS:
```bash
npm install express cors
```
*(Asegúrate de tener `"type": "module"` en tu archivo `package.json` para dar soporte a los imports nativos).*

### 3. Iniciar el servidor
Navega hasta la carpeta del backend e inicia el servidor con Node:
```bash
cd src/backend
node server.js
```

### 4. Acceder a la aplicación
Abre tu navegador web favorito e ingresa a la siguiente dirección:
* **Frontend e Interfaz**: [http://localhost:3000](http://localhost:3000)
* **Endpoint de la API**: [http://localhost:3000/api/viajes](http://localhost:3000/api/viajes)

---

## 📡 Endpoints de la API REST


| Método | Endpoint | Descripción | Cuerpo de la Petición (JSON) |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/viajes` | Obtiene la lista completa de escapadas. | *Ninguno* |
| **POST** | `/api/viajes` | Crea una nueva escapada vacía o con datos. | `{ titulo, descripcion, categoria, pais, imagenUrl }` |
| **PUT** | `/api/viajes/:id` | Modifica por completo o actualiza el estado de un viaje. | `{ titulo, descripcion, categoria, pais, imagenUrl, estado }` |
| **DELETE** | `/api/viajes/:id` | Elimina un viaje permanentemente usando su ID. | *Ninguno* |

---

## 📝 Notas de Implementación
* El campo `id` autoincremental empieza en `1` si el archivo `viajes.json` está vacío. Si ya existen registros, busca dinámicamente el identificador numérico más alto y le suma uno para garantizar que no se repitan identificadores si se eliminan filas intermedias.
* No se requiere configurar ninguna base de datos externa (como MySQL o MongoDB), ya que el modelo maneja la persistencia de forma asíncrona estructurada directamente sobre el fichero local `viajes.json`.
