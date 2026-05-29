const API_URL = "http://localhost:3000/api/viajes";
let filtroActual = "Todos";

async function cargarViajes() {
    try {
        const respuesta = await fetch(API_URL);
        const viajes = await respuesta.json();
        renderizarViajes(viajes);
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
    }
}

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
                    <button class="${botonClass}" onclick="cambiarEstadoServidor(${viaje.id}, '${nuevoEstado}')">${textoBoton}</button>
                </div>
            </div>
        `;
        contenedor.innerHTML += cardHTML;
    });
}

// NUEVA FUNCIÓN: Actualiza la miniatura en tiempo real
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
async function registrarViaje(event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const categoria = document.getElementById("categoria").value;
    const pais = document.getElementById("pais").value || "No especificado";
    const descripcion = document.getElementById("descripcion").value;
    const imagenUrl = document.getElementById("imagenUrl").value || `https://unsplash.com/foto${Math.random()}`;

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo,
                descripcion,
                categoria,
                pais,
                imagenUrl
            })
        });
        
        document.getElementById("viaje-form").reset();
         // NUEVO: Oculta la vista previa al limpiar el formulario
        document.getElementById("contenedor-vista-previa").style.display = "none";
        document.getElementById("vista-previa-img").src = "";

        cargarViajes();
    } catch (error) {
        console.error("Error al guardar la escapada:", error);
    }
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
