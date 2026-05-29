// 1. Estado de la aplicación (en memoria durante esta fase)
let misViajes = [
    {
        id: 1,
        titulo: "Fin de semana en Tarifa",
        descripcion: "Mucho viento, pero el atardecer en la duna de Bolonia fue increíble. Comimos pescaíto frito frente al mar.",
        categoria: "Playa/Mar",
        pais: "España",
        imagenUrl: "https://unsplash.com",
        estado: "Visitado"
    },
    {
        id: 2,
        titulo: "Ruta por los Picos de Europa",
        descripcion: "Senderismo duro pero las vistas del Naranjo de Bulnes valieron la pena. Vimos vacas en libertad.",
        categoria: "Montaña",
        pais: "España",
        imagenUrl: "https://unsplash.com",
        estado: "Visitado"
    },
    {
        id: 3,
        titulo: "Escapada pendiente a los Alpes",
        descripcion: "Quiero ir el próximo invierno para ver paisajes nevados y practicar fotografía de alta montaña.",
        categoria: "Montaña",
        pais: "Francia",
        imagenUrl: "https://unsplash.com",
        estado: "Pendiente"
    }
];

let filtroActual = "Todos"; // Rastrea qué filtro está activo

// 2. Función para renderizar las tarjetas según el filtro activo
function renderizarViajes() {
    const contenedor = document.getElementById("lista-viajes");
    contenedor.innerHTML = ""; 

    // Filtrar los datos antes de dibujarlos
    const viajesFiltrados = misViajes.filter(viaje => {
        if (filtroActual === "Todos") return true;
        return viaje.estado === filtroActual;
    });

    if (viajesFiltrados.length === 0) {
        contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #6c757d;">No hay experiencias en esta categoría.</p>`;
        return;
    }

    viajesFiltrados.forEach(viaje => {
        const estadoClass = viaje.estado === "Visitado" ? "badge-visitado" : "badge-pendiente";
        
        // El botón permite cambiar el estado de forma dinámica (Requisito Mínimo del PDF)
        const botonAccionHTML = viaje.estado === "Pendiente" 
            ? `<button class="btn-action" onclick="cambiarEstado(${viaje.id}, 'Visitado')">✅ Marcar como Visitado</button>`
            : `<button class="btn-action btn-secondary" onclick="cambiarEstado(${viaje.id}, 'Pendiente')">⏳ Volver a Pendiente</button>`;

        const cardHTML = `
            <div class="card">
                <div class="card-img" style="background-image: url('${viaje.imagenUrl}')"></div>
                <div class="card-content">
                    <span class="badge ${estadoClass}">${viaje.estado}</span>
                    <h3 class="card-title">${viaje.titulo}</h3>
                    <div class="card-meta">📍 ${viaje.pais} | 🏷️ ${viaje.categoria}</div>
                    <p class="card-text">${viaje.descripcion}</p>
                    ${botonAccionHTML}
                </div>
            </div>
        `;
        contenedor.innerHTML += cardHTML;
    });
}

// 3. Controlador del Formulario: Añadir nuevos elementos (CREATE)
function registrarViaje(event) {
    event.preventDefault(); // Evitar que la página se recargue

    // Capturar los valores de los inputs
    const titulo = document.getElementById("titulo").value;
    const categoria = document.getElementById("categoria").value;
    const pais = document.getElementById("pais").value || "No especificado";
    const descripcion = document.getElementById("descripcion").value;
    
    // Generar una imagen aleatoria bonita de Unsplash para simular el viaje
    const imagenUrl = `https://unsplash.com{Math.random()}`;

    // Crear el nuevo objeto con la estructura común de datos
    const nuevoViaje = {
        id: Date.now(), // ID único basado en milisegundos
        titulo,
        descripcion,
        categoria,
        pais,
        imagenUrl,
        estado: "Pendiente" // Por defecto nacen como pendientes de visitar
    };

    // Añadir al array de estado y actualizar pantalla
    misViajes.push(nuevoViaje);
    renderizarViajes();

    // Limpiar el formulario
    document.getElementById("viaje-form").reset();
}

// 4. Cambiar Estado dinámicamente (UPDATE)
function cambiarEstado(id, nuevoEstado) {
    misViajes = misViajes.map(viaje => {
        if (viaje.id === id) {
            return { ...viaje, estado: nuevoEstado };
        }
        return viaje;
    });
    renderizarViajes();
}

// 5. Configurar los Filtros de la interfaz
function configurarFiltros() {
    const botones = document.querySelectorAll(".filter-buttons button");
    
    botones.forEach(boton => {
        boton.addEventListener("click", (e) => {
            // Quitar clase activa a todos
            botones.forEach(b => b.classList.remove("active"));
            // Añadir clase activa al pulsado
            e.target.classList.add("active");
            
            // Cambiar el criterio de filtrado según el texto del botón
            const textoBoton = e.target.innerText;
            if (textoBoton === "Todos") filtroActual = "Todos";
            if (textoBoton === "Visitados") filtroActual = "Visitado";
            if (textoBoton === "Pendientes") filtroActual = "Pendiente";
            
            renderizarViajes();
        });
    });
}

// 6. Inicialización del DOM
document.addEventListener("DOMContentLoaded", () => {
    // Escuchar el evento submit del formulario real
    const formulario = document.getElementById("viaje-form");
    formulario.addEventListener("submit", registrarViaje);
    
    configurarFiltros();
    renderizarViajes();
});
