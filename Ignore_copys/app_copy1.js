// Fase 1: Datos ficticios estructurados en JSON/Objetos de JS
const viajesIniciales = [
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

// Función para pintar las tarjetas en la pantalla (Fase 1 maqueta)
function renderizarViajes(lista) {
    const contenedor = document.getElementById("lista-viajes");
    contenedor.innerHTML = ""; // Limpiar contenedor

    lista.forEach(viaje => {
        const estadoClass = viaje.estado === "Visitado" ? "badge-visitado" : "badge-pendiente";
        
        const cardHTML = `
            <div class="card">
                <div class="card-img" style="background-image: url('${viaje.imagenUrl}')"></div>
                <div class="card-content">
                    <span class="badge ${estadoClass}">${viaje.estado}</span>
                    <h3 class="card-title">${viaje.titulo}</h3>
                    <div class="card-meta">📍 ${viaje.pais} | 🏷️ ${viaje.categoria}</div>
                    <p class="card-text">${viaje.descripcion}</p>
                </div>
            </div>
        `;
        contenedor.innerHTML += cardHTML;
    });
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    renderizarViajes(viajesIniciales);
});
