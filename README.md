# 🌍 Gestor de Escapadas y Viajes

Una aplicación web interactiva para registrar, planificar y gestionar recuerdos de viajes o escapadas pendientes. Permite clasificar los destinos por categorías, cambiar su estado entre "Pendiente" o "Visitado", editarlos o eliminarlos y ordenarlos cronológicamente en tiempo real.

Este proyecto implementa una arquitectura limpia basada en el patrón **MVC (Modelo-Vista-Controlador)** en el backend y una comunicación REST semántica en el frontend.

---

## 🚀 Características

* **Operaciones CRUD Completas**: Crear, Leer, Actualizar y Borrar viajes de forma persistente.
* **Arquitectura MVC**: Separación estricta de responsabilidades en el servidor (Rutas, Controladores y Modelos).
* **API REST Semántica**: Uso correcto de los verbos HTTP (`GET`, `POST`, `PUT`, `DELETE`) enviando datos estructurados en formato JSON a través del cuerpo (`body`) de las peticiones.
* **Autoincremento Seguro**: Sistema inteligente en el backend para calcular IDs autoincrementales correlativos basados en archivos locales, evitando colisiones incluso al borrar registros.
* **Variables de Entorno (.env)**: Configuración dinámica y segura del puerto del servidor mediante variables de entorno aisladas.
* **Ordenamiento Cronológico**: El frontend procesa y ordena automáticamente las tarjetas de los viajes, mostrando siempre los destinos más recientes al principio de la lista.
* **Campos Avanzados**: Soporte completo para almacenar y renderizar la **Fecha de viaje** (con autocompletado del día de hoy) y una **Calificación personal** mediante estrellas (⭐).
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
│   │   │   └── viaje.controller.js   # Lógica de negocio y desestructuración dinámica de req.body
│   │   ├── models/
│   │   │   └── viaje.model.js        # Persistencia de datos y lectura/escritura JSON
│   │   ├── routes/
│   │   │   └── viaje.routes.js       # Definición de endpoints semánticos
│   │   ├── viajes.json               # Base de datos local en formato JSON
│   │   └── server.js                 # Servidor central Express, inicialización de dotenv y middlewares
│   └── frontend/
│       ├── js/
│       │   └── app.js                # Lógica interactiva, ordenamiento y peticiones fetch
│       ├── css/
│       │   └── style.css             # Diseño visual de la aplicación
│       └── index.html                # Interfaz de usuario, filtros y formulario avanzado
├── .env                              # Archivo local de variables de entorno (no subir a GitHub)
├── .env.example                      # Plantilla de variables de entorno de ejemplo
├── .gitignore                        # Archivos excluidos del control de versiones
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
npm install express cors dotenv
```
*(Asegúrate de tener `"type": "module"` en tu archivo `package.json` para dar soporte a los imports nativos).*

##### Actualización para subir imagenes como archivo a un servidor local
Instalamos el multer
```bash
npm install multer
```

### 3. Configurar variables de entorno (`.env`)
Crea un archivo llamado `.env` en la raíz de tu proyecto basándote en la plantilla de ejemplo:
```ini
# Copia esto en tu archivo .env
PORT=3000
```
### 4. Iniciar el servidor
Navega hasta la carpeta del backend e inicia el servidor con Node:
```bash
cd src/backend
node server.js
```

### 5. Acceder a la aplicación
Abre tu navegador web favorito e ingresa a la siguiente dirección:
* **Frontend e Interfaz**: [http://localhost:3000](http://localhost:3000)
* **Endpoint de la API**: [http://localhost:3000/api/viajes](http://localhost:3000/api/viajes)

---

## 📡 Endpoints de la API REST


| Método | Endpoint | Descripción | Cuerpo de la Petición (JSON) |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/viajes` | Obtiene la lista completa de escapadas. | *Ninguno* |
| **POST** | `/api/viajes` | Crea una nueva escapada vacía o con datos. | `{ titulo, descripcion, categoria, pais, imagenUrl, estado, fecha, calificacion }` |
| **PUT** | `/api/viajes/:id` | Modifica por completo o actualiza el estado de un viaje. | `{ titulo, descripcion, categoria, pais, imagenUrl, estado, fecha, calificacion }` |
| **DELETE** | `/api/viajes/:id` | Elimina un viaje permanentemente usando su ID. | *Ninguno* |

---

## 📝 Notas de Implementación

* El proyecto cuenta con un archivo `.gitignore` configurado para evitar la subida de la carpeta `node_modules/` y del archivo `.env` por motivos de seguridad y optimización del repositorio.
* Al usar el operador Spread (`...req.body`) en el controlador del backend, cualquier campo nuevo que añadas en el formulario HTML se guardará automáticamente en el archivo `viajes.json` sin necesidad de modificar el servidor.
* El campo `id` autoincremental empieza en `1` si el archivo `viajes.json` está vacío. Si ya existen registros, busca dinámicamente el identificador numérico más alto y le suma uno para garantizar que no se repitan identificadores si se eliminan filas intermedias.
* No se requiere configurar ninguna base de datos externa (como MySQL o MongoDB), ya que el modelo maneja la persistencia de forma asíncrona estructurada directamente sobre el fichero local `viajes.json`.

## 📝 Notas de Gulp
* Comando que ejecuta el gupfile:
```bash
npx gulp
```
## 📝 Notas de Docker
* Comando que construye la imagen:
```bash
docker build -t escapadas-app-final .
```
* Comando que ejecuta el contenedor:
```bash
docker run -p 3000:3000 --env-file .env escapadas-app-final
```
* Comando para ver si se esta ejecutando el contenedor
```bash
docker ps
```
* Comando para ver el log del contenedor
```bash
docker logs <container_id>
```
## 📝 Notas de Docker-Composer
* Comando para ejecutar, crea la imagen con el gulp, el contenedor, los volumenes y lo lanza.
```bash
docker compose up --build
```
* Comando para borrar el contenedor sin borrar los volumenes -v
```bash
docker compose down 
```