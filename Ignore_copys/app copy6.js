// const API_URL = "http://localhost:3000/api/viajes";
// ACTUALIZADO: Al quitar "http://localhost:3000", funcionará en cualquier puerto configurado en el .env
const API_URL = "/api/viajes"; 
let filtroActual = "Todos";
// Variable global nueva para saber si estamos editando
let idViajeEditando = null;

async function cargarViajes() {
    try {
        const respuesta = await fetch(API_URL);
        const viajes = await respuesta.json();
        renderizarViajes(viajes);
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
    }
}

// function renderizarViajes(viajes) {
//     const contenedor = document.getElementById("lista-viajes");
//     contenedor.innerHTML = "";

//     const viajesFiltrados = viajes.filter(viaje => {
//         if (filtroActual === "Todos") return true;
//         return viaje.estado === filtroActual;
//     });

//     if (viajesFiltrados.length === 0) {
//         contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #6c757d;">No hay escapadas registradas aquí.</p>`;
//         return;
//     }

//     viajesFiltrados.forEach(viaje => {
//         const estadoClass = viaje.estado === "Visitado" ? "badge-visitado" : "badge-pendiente";
//         const nuevoEstado = viaje.estado === "Pendiente" ? "Visitado" : "Pendiente";
//         const textoBoton = viaje.estado === "Pendiente" ? "✅ Marcar Visitado" : "⏳ Volver Pendiente";
//         const botonClass = viaje.estado === "Pendiente" ? "btn-action" : "btn-action btn-secondary";

//         const cardHTML = `
//             <div class="card">
//                 <div class="card-img" style="background-image: url('${viaje.imagenUrl}')">
//                     <button class="btn-delete" onclick="borrarViajeServidor(${viaje.id})" title="Eliminar escapada">×</button>
//                 </div>
//                 <div class="card-content">
//                     <span class="badge ${estadoClass}">${viaje.estado}</span>
//                     <h3 class="card-title">${viaje.titulo}</h3>
//                     <div class="card-meta">📍 ${viaje.pais} | 🏷️ ${viaje.categoria}</div>
//                     <p class="card-text">${viaje.descripcion}</p>
//                     <button class="${botonClass}" onclick="cambiarEstadoServidor(${viaje.id}, '${nuevoEstado}')">${textoBoton}</button>
//                 </div>
//             </div>
//         `;
//         contenedor.innerHTML += cardHTML;
//     });
// }

// NUEVA FUNCIÓN: Actualiza la miniatura en tiempo real
function renderizarViajes(viajes) {
    const contenedor = document.getElementById("lista-viajes");
    contenedor.innerHTML = "";

    const viajesFiltrados = viajes.filter(viaje => {
        if (filtroActual === "Todos") return true;
        return viaje.estado === filtroActual;
    });

    if (viajesFiltrados.length === 0) {
        contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #6c757d;">No hay escapadas registradas aquí.</p>`;
        return;
    }

    viajesFiltrados.forEach(viaje => {
        const estadoClass = viaje.estado === "Visitado" ? "badge-visitado" : "badge-pendiente";
        const nuevoEstado = viaje.estado === "Pendiente" ? "Visitado" : "Pendiente";
        const textoBoton = viaje.estado === "Pendiente" ? "✅ Marcar Visitado" : "⏳ Volver Pendiente";
        const botonClass = viaje.estado === "Pendiente" ? "btn-action" : "btn-action btn-secondary";

        // Escapamos los textos para evitar problemas con las comillas en el HTML dinámico
        const viajeJSON = btoa(unescape(encodeURIComponent(JSON.stringify(viaje))));

        const cardHTML = `
            <div class="card">
                <div class="card-img" style="background-image: url('${viaje.imagenUrl}')">
                    <button class="btn-delete" onclick="borrarViajeServidor(${viaje.id})" title="Eliminar escapada">×</button>
                </div>
                <div class="card-content">
                    <span class="badge ${estadoClass}">${viaje.estado}</span>
                    <h3 class="card-title">${viaje.titulo}</h3>
                    <div class="card-meta">📍 ${viaje.pais} | 🏷️ ${viaje.categoria}</div>
                    <p class="card-text">${viaje.descripcion}</p>
                    <div style="display: flex; gap: 8px; margin-top: 10px;">
                        <button class="${botonClass}" style="flex: 1;" onclick="cambiarEstadoServidor(${viaje.id}, '${nuevoEstado}')">${textoBoton}</button>
                        <!-- NUEVO: Botón de editar -->
                        <button class="btn-action" style="background-color: #ffc107; color: #212529; width: auto;" onclick="cargarDatosEnFormulario('${viajeJSON}')" title="Editar datos">✏️ Editar</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += cardHTML;
    });
}

// NUEVA FUNCIÓN: Rellena el formulario con los datos de la tarjeta seleccionada
// function cargarDatosEnFormulario(viajeBase64) {
//     const viaje = JSON.parse(decodeURIComponent(escape(atob(viajeBase64))));
    
//     // Guardamos el ID de forma global para saber qué viaje se está modificando
//     idViajeEditando = viaje.id;

//     // Rellenamos los campos del formulario
//     document.getElementById("titulo").value = viaje.titulo;
//     document.getElementById("categoria").value = viaje.categoria;
//     document.getElementById("pais").value = viaje.pais;
//     document.getElementById("descripcion").value = viaje.descripcion;
//     document.getElementById("imagenUrl").value = viaje.imagenUrl;

//     // Disparamos la vista previa de la imagen que creamos en el paso anterior
//     actualizarVistaPreviaImagen();

//     // Cambiamos el texto del botón del formulario para dar feedback visual
//     const botonFormulario = document.querySelector("#viaje-form button[type='submit']");
//     if (botonFormulario) botonFormulario.innerText = "💾 Actualizar Experiencia";
// }

// ACTUALIZADO: Rellena el formulario, hace scroll y muestra el botón de cancelar
function cargarDatosEnFormulario(viajeBase64) {
    const viaje = JSON.parse(decodeURIComponent(escape(atob(viajeBase64))));
    
    idViajeEditando = viaje.id;

    // Rellenamos los campos del formulario
    document.getElementById("titulo").value = viaje.titulo;
    document.getElementById("categoria").value = viaje.categoria;
    document.getElementById("pais").value = viaje.pais;
    document.getElementById("descripcion").value = viaje.descripcion;
    document.getElementById("imagenUrl").value = viaje.imagenUrl;

    // Actualiza la vista previa de la imagen que creamos previamente
    actualizarVistaPreviaImagen();

    // Cambiamos el texto del botón del formulario
    const botonFormulario = document.querySelector("#viaje-form button[type='submit']");
    if (botonFormulario) botonFormulario.innerText = "💾 Actualizar Experiencia";

    // NUEVO: Muestra el botón de cancelar edición
    document.getElementById("btn-cancelar").style.display = "block";

    // NUEVO: Hace scroll suave automático hacia el formulario
    document.getElementById("viaje-form").scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}


function actualizarVistaPreviaImagen() {
    const inputUrl = document.getElementById("imagenUrl").value.trim();
    const contenedor = document.getElementById("contenedor-vista-previa");
    const imgElemento = document.getElementById("vista-previa-img");

    // Si el campo tiene texto, muestra el contenedor y asigna la URL
    if (inputUrl) {
        imgElemento.src = inputUrl;
        contenedor.style.display = "block";
    } else {
        // Si el campo está vacío, esconde la vista previa
        contenedor.style.display = "none";
        imgElemento.src = "";
    }

    // Si la URL es inválida o no carga una imagen, se ejecuta esto para que no se vea roto
    imgElemento.onerror = function() {
        imgElemento.src = "https://unsplash.com"; // Imagen de aviso de error
    };
}


// ACTUALIZADO: Usa POST y envía los datos en el cuerpo (body) en formato JSON
// async function registrarViaje(event) {
//     event.preventDefault();

//     const titulo = document.getElementById("titulo").value;
//     const categoria = document.getElementById("categoria").value;
//     const pais = document.getElementById("pais").value || "No especificado";
//     const descripcion = document.getElementById("descripcion").value;
//     const imagenUrl = document.getElementById("imagenUrl").value || `https://unsplash.com/foto${Math.random()}`;

//     try {
//         await fetch(API_URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 titulo,
//                 descripcion,
//                 categoria,
//                 pais,
//                 imagenUrl
//             })
//         });
        
//         document.getElementById("viaje-form").reset();
//          // NUEVO: Oculta la vista previa al limpiar el formulario
//         document.getElementById("contenedor-vista-previa").style.display = "none";
//         document.getElementById("vista-previa-img").src = "";

//         cargarViajes();
//     } catch (error) {
//         console.error("Error al guardar la escapada:", error);
//     }
// }

// ACTUALIZADO: Maneja tanto la creación (POST) como la actualización completa (PUT)
// async function registrarViaje(event) {
//     event.preventDefault();

//     const titulo = document.getElementById("titulo").value;
//     const categoria = document.getElementById("categoria").value;
//     const pais = document.getElementById("pais").value || "No especificado";
//     const descripcion = document.getElementById("descripcion").value;
//     const imagenUrl = document.getElementById("imagenUrl").value || `https://unsplash.com{Math.random()}`;

//     // Datos estructurados para el body de la petición
//     const datosViaje = { titulo, descripcion, categoria, pais, imagenUrl };

//     try {
//         let url = API_URL;
//         let metodo = 'POST';

//         // Si idViajeEditando contiene un número, significa que estamos EDITANDO
//         if (idViajeEditando !== null) {
//             url = `${API_URL}/${idViajeEditando}`;
//             metodo = 'PUT';
//         }

//         await fetch(url, {
//             method: metodo,
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(datosViaje)
//         });
        
//         // Limpiamos el formulario y restablecemos el estado inicial
//         document.getElementById("viaje-form").reset();
//         idViajeEditando = null;
        
//         const botonFormulario = document.querySelector("#viaje-form button[type='submit']");
//         if (botonFormulario) botonFormulario.innerText = "➕ Guardar Experiencia";

//         document.getElementById("contenedor-vista-previa").style.display = "none";
//         document.getElementById("vista-previa-img").src = "";
        
//         cargarViajes();
//     } catch (error) {
//         console.error("Error al procesar la escapada:", error);
//     }
// }

// ACTUALIZADO: Llama a cancelarEdicion() tras una respuesta exitosa
async function registrarViaje(event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const categoria = document.getElementById("categoria").value;
    const pais = document.getElementById("pais").value || "No especificado";
    const descripcion = document.getElementById("descripcion").value;
    const imagenUrl = document.getElementById("imagenUrl").value || `https://unsplash.com{Math.random()}`;

    const datosViaje = { titulo, descripcion, categoria, pais, imagenUrl };

    try {
        let url = API_URL;
        let metodo = 'POST';

        if (idViajeEditando !== null) {
            url = `${API_URL}/${idViajeEditando}`;
            metodo = 'PUT';
        }

       const respuesta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosViaje)
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo procesar la solicitud en el servidor");
        }
        
        cancelarEdicion();
        cargarViajes();
    } catch (error) {
        console.error("Error al procesar la escapada:", error);
    }
}
// NUEVA FUNCIÓN: Restablece el formulario a su estado original de creación
function cancelarEdicion() {
    idViajeEditando = null;
    
    // Limpia los textos del formulario
    document.getElementById("viaje-form").reset();
    
    // Restablece el texto del botón principal
    const botonFormulario = document.querySelector("#viaje-form button[type='submit']");
    if (botonFormulario) botonFormulario.innerText = "➕ Guardar Experiencia";
    
    // Oculta el botón de cancelar
    document.getElementById("btn-cancelar").style.display = "none";
    
    // Limpia y oculta la vista previa de la imagen
    document.getElementById("contenedor-vista-previa").style.display = "none";
    document.getElementById("vista-previa-img").src = "";
}

// ACTUALIZADO: Usa PUT y envía el estado modificado dentro del body
async function cambiarEstadoServidor(id, nuevoEstado) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                estado: nuevoEstado
            })
        });
        
        cargarViajes();
    } catch (error) {
        console.error("Error al actualizar el estado:", error);
    }
}

// ACTUALIZADO: Usa el método DELETE directamente apuntando al recurso por ID
async function borrarViajeServidor(id) {
    if (confirm("¿Seguro que quieres eliminar este recuerdo de viaje?")) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            cargarViajes();
        } catch (error) {
            console.error("Error al borrar la escapada:", error);
        }
    }
}

function configurarFiltros() {
    const botones = document.querySelectorAll(".filter-buttons button");
    botones.forEach(boton => {
        boton.addEventListener("click", (e) => {
            botones.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");

            const texto = e.target.innerText;
            filtroActual = texto === "Todos" ? "Todos" : texto === "Visitados" ? "Visitado" : "Pendiente";
            
            cargarViajes();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("viaje-form").addEventListener("submit", registrarViaje);
    // NUEVO: Escucha cuando el usuario escribe (input) o pega (paste) una URL
    const inputImagen = document.getElementById("imagenUrl");
    if (inputImagen) {
        inputImagen.addEventListener("input", actualizarVistaPreviaImagen);
    }

    configurarFiltros();
    cargarViajes();
});
