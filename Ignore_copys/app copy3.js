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

async function registrarViaje(event) {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const categoria = document.getElementById("categoria").value;
    const pais = document.getElementById("pais").value || "No especificado";
    const descripcion = document.getElementById("descripcion").value;
    const imagenUrl = document.getElementById("imagenUrl").value || `https://unsplash.com/foto${Math.random()}`;
    

    const urlPeticion = `${API_URL}/crear?titulo=${encodeURIComponent(titulo)}&descripcion=${encodeURIComponent(descripcion)}&categoria=${encodeURIComponent(categoria)}&pais=${encodeURIComponent(pais)}&imagenUrl=${encodeURIComponent(imagenUrl)}`;

    try {
        await fetch(urlPeticion);
        document.getElementById("viaje-form").reset();
        cargarViajes();
    } catch (error) {
        console.error("Error al guardar la escapada:", error);
    }
}

async function cambiarEstadoServidor(id, nuevoEstado) {
    try {
        await fetch(`${API_URL}/actualizar/${id}?estado=${nuevoEstado}`);
        cargarViajes();
    } catch (error) {
        console.error("Error al actualizar el estado:", error);
    }
}

async function borrarViajeServidor(id) {
    if (confirm("¿Seguro que quieres eliminar este recuerdo de viaje?")) {
        try {
            await fetch(`${API_URL}/borrar/${id}`);
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
    configurarFiltros();
    cargarViajes();
});
