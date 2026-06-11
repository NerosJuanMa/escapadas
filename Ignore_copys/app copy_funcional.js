const API_URL = "/api/viajes"; 
let filtroActual = "Todos";
let idViajeEditando = null;

// ACTUALIZADO: Ordena los viajes por fecha (los más recientes primero) antes de renderizar
async function cargarViajes() {
    try {
        const respuesta = await fetch(API_URL);
        const viajes = await respuesta.json();

        // NUEVO: Lógica de ordenamiento cronológico descendente
        viajes.sort((a, b) => {
            // Si alguno no tiene fecha, lo mandamos al final
            if (!a.fecha) return 1;
            if (!b.fecha) return -1;
            return new Date(b.fecha) - new Date(a.fecha);
        });

        renderizarViajes(viajes);
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
    }
}

// Muestra todas las tarjetas en la interfaz con los nuevos datos
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

        const estrellas = viaje.calificacion ? "⭐".repeat(parseInt(viaje.calificacion)) : "Sin calificar";
        
        // Formateo de fecha legible
        const fechaFormateada = viaje.fecha ? new Date(viaje.fecha).toLocaleDateString('es-ES') : "Sin fecha";

        const viajeJSON = btoa(unescape(encodeURIComponent(JSON.stringify(viaje))));

        const cardHTML = `
            <div class="card">
                <div class="card-img" style="background-image: url('${viaje.imagenUrl}')">
                    <button class="btn-delete" onclick="borrarViajeServidor(${viaje.id})" title="Eliminar escapada">×</button>
                </div>
                <div class="card-content">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <span class="badge ${estadoClass}">${viaje.estado}</span>
                        <span style="font-size: 14px;">${estrellas}</span>
                    </div>
                    <h3 class="card-title">${viaje.titulo}</h3>
                    <div class="card-meta">📍 ${viaje.pais} | 🏷️ ${viaje.categoria}</div>
                    <div class="card-meta" style="color: #6c757d; font-size: 12px; margin-top: -5px; margin-bottom: 8px;">📅 Fecha: ${fechaFormateada}</div>
                    <p class="card-text">${viaje.descripcion}</p>
                    <div style="display: flex; gap: 8px; margin-top: 10px;">
                        <button class="${botonClass}" style="flex: 1;" onclick="cambiarEstadoServidor(${viaje.id}, '${nuevoEstado}')">${textoBoton}</button>
                        <button class="btn-action" style="background-color: #ffc107; color: #212529; width: auto;" onclick="cargarDatosEnFormulario('${viajeJSON}')" title="Editar datos">✏️ Editar</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += cardHTML;
    });
}

function cargarDatosEnFormulario(viajeBase64) {
    const viaje = JSON.parse(decodeURIComponent(escape(atob(viajeBase64))));
    
    idViajeEditando = viaje.id;

    document.getElementById("titulo").value = viaje.titulo;
    document.getElementById("categoria").value = viaje.categoria;
    document.getElementById("pais").value = viaje.pais;
    document.getElementById("descripcion").value = viaje.descripcion;
    document.getElementById("imagenUrl").value = viaje.imagenUrl;
    document.getElementById("estado").value = viaje.estado;
    document.getElementById("fecha").value = viaje.fecha || ""; 
    document.getElementById("calificacion").value = viaje.calificacion || ""; 

    actualizarVistaPreviaImagen();

    const botonFormulario = document.querySelector("#viaje-form button[type='submit']");
    if (botonFormulario) botonFormulario.innerText = "💾 Actualizar Experiencia";

    const btnCancelar = document.getElementById("btn-cancelar");
    if (btnCancelar) btnCancelar.style.display = "block";

    document.getElementById("viaje-form").scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

// ACTUALIZADO: Al cancelar o limpiar, vuelve a poner la fecha de hoy
function cancelarEdicion() {
    idViajeEditando = null;
    
    document.getElementById("viaje-form").reset();
    establecerFechaDeHoy(); // NUEVO: Restablece el valor predeterminado del input date
    
    const botonFormulario = document.querySelector("#viaje-form button[type='submit']");
    if (botonFormulario) botonFormulario.innerText = "➕ Guardar Experiencia";
    
    const btnCancelar = document.getElementById("btn-cancelar");
    if (btnCancelar) btnCancelar.style.display = "none";
    
    document.getElementById("contenedor-vista-previa").style.display = "none";
    document.getElementById("vista-previa-img").src = "";
}

async function registrarViaje(event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const categoria = document.getElementById("categoria").value;
    const pais = document.getElementById("pais").value || "No especificado";
    const descripcion = document.getElementById("descripcion").value;
    const imagenUrl = document.getElementById("imagenUrl").value || "https://unsplash.com";
    const estado = document.getElementById("estado").value;
    const fecha = document.getElementById("fecha").value;
    const calificacion = document.getElementById("calificacion").value;

    const datosViaje = { titulo, descripcion, categoria, pais, imagenUrl, estado, fecha, calificacion };

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

async function cambiarEstadoServidor(id, nuevoEstado) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        cargarViajes();
    } catch (error) {
        console.error("Error al actualizar el estado:", error);
    }
}

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

function actualizarVistaPreviaImagen() {
    const inputUrl = document.getElementById("imagenUrl").value.trim();
    const contenedor = document.getElementById("contenedor-vista-previa");
    const imgElemento = document.getElementById("vista-previa-img");

    if (inputUrl) {
        imgElemento.src = inputUrl;
        contenedor.style.display = "block";
    } else {
        contenedor.style.display = "none";
        imgElemento.src = "";
    }

    imgElemento.onerror = function() {
        imgElemento.src = "https://unsplash.com"; 
    };
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

// NUEVA FUNCIÓN: Calcula y asigna la fecha actual en formato YYYY-MM-DD
function establecerFechaDeHoy() {
    const inputFecha = document.getElementById("fecha");
    if (inputFecha) {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        inputFecha.value = `${yyyy}-${mm}-${dd}`;
    }
}

// Inicialización de eventos al cargar la ventana
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("viaje-form").addEventListener("submit", registrarViaje);
    
    const inputImagen = document.getElementById("imagenUrl");
    if (inputImagen) {
        inputImagen.addEventListener("input", actualizarVistaPreviaImagen);
    }
    
    configurarFiltros();
    establecerFechaDeHoy(); // NUEVO: Autocompleta la fecha al abrir la web
    cargarViajes();
});
