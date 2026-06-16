const API_URL = "/api/viajes";
let filtroActual = "Todos";
let idViajeEditando = null;

// Inicialización de eventos al cargar la ventana
document.addEventListener("DOMContentLoaded", () => {
    // Escucha el submit del formulario (sirve para Guardar y para Actualizar)
    const formulario = document.getElementById("viaje-form");
    if (formulario) {
        formulario.addEventListener("submit", registrarViaje);
    }

    // Escucha el click del botón cancelar
    const btnCancelar = document.getElementById("btn-cancelar");
    if (btnCancelar) {
        btnCancelar.addEventListener("click", cancelarEdicion);
    }

    const inputImagen = document.getElementById("imagenUrl");
    if (inputImagen) {
        inputImagen.addEventListener("input", actualizarVistaPreviaImagenUrl);
    }

    const inputImagenFile = document.getElementById("imagenFile");
    if (inputImagenFile) {
        inputImagenFile.addEventListener("change", actualizarVistaPreviaImagenFile);
    }

    configurarFiltros();
    establecerFechaDeHoy(); 
    cargarViajes();
    // Ejecutas la función cuando la página cargue
   

});


// Ordena los viajes por fecha (los más recientes primero) antes de renderizar
async function cargarViajes() {
    try {
        const respuesta = await fetch(API_URL);
        const viajes = await respuesta.json();

        viajes.sort((a, b) => {
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
    if (!contenedor) return;
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
        const fechaFormateada = viaje.fecha ? new Date(viaje.fecha).toLocaleDateString('es-ES') : "Sin fecha";

        const viajeJSON = btoa(unescape(encodeURIComponent(JSON.stringify(viaje))));
        const imagen = viaje.imagenRutaLocal
            ? `http://localhost:3000${viaje.imagenRutaLocal}`
            : (viaje.imagenUrl || "img/default-placeholder.jpg");

        const cardHTML = `
            <div class="card">
                <div class="card-img" style="background-image: url('${imagen}')">
                    <button class="btn-delete" onclick="borrarViajeServidor(${viaje.id})" title="Eliminar escapada">×</button>
                </div>
                <div class="card-content">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <span class="badge ${estadoClass}">${viaje.estado}</span>
                        <span style="font-size: 14px;">${estrellas}</span>
                    </div>
                    <h3 class="card-title">${viaje.titulo}</h3>
                    <div class="card-meta">📍 ${viaje.pais || "No especificado"} | 🏷️ ${viaje.categoria}</div>
                    <div class="card-meta" style="color: #6c757d; font-size: 12px; margin-top: -5px; margin-bottom: 8px;">📅 Fecha: ${fechaFormateada}</div>
                    <p class="card-text">${viaje.descripcion || ""}</p>
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

// Carga los datos guardados en Base64 directamente a la interfaz del formulario
function cargarDatosEnFormulario(viajeBase64) {
    const viaje = JSON.parse(decodeURIComponent(escape(atob(viajeBase64))));

    idViajeEditando = viaje.id;

    document.getElementById("titulo").value = viaje.titulo || "";
    document.getElementById("categoria").value = viaje.categoria || "Playa/Mar";
    document.getElementById("pais").value = viaje.pais || "";
    document.getElementById("descripcion").value = viaje.descripcion || "";
    document.getElementById("imagenUrl").value = viaje.imagenUrl || "";
    document.getElementById("estado").value = viaje.estado || "Pendiente";
    document.getElementById("fecha").value = viaje.fecha || "";
    document.getElementById("calificacion").value = viaje.calificacion || "";

    const inputArchivo = document.getElementById("imagenFile");
    if (inputArchivo) inputArchivo.value = "";

    const rutaDeLaImagen = viaje.imagenRutaLocal;
    const vistaPreviaImg = document.getElementById("vista-previa-img-archivo");
    const contenedorVistaPrevia = document.getElementById("contenedor-vista-previa-archivo");
    
    if (rutaDeLaImagen && vistaPreviaImg && contenedorVistaPrevia) {
        vistaPreviaImg.src = rutaDeLaImagen.startsWith('http') ? rutaDeLaImagen : `http://localhost:3000${rutaDeLaImagen}`;
        contenedorVistaPrevia.style.display = "block";
    } else {
        actualizarVistaPreviaImagenFile();
        actualizarVistaPreviaImagenUrl();
    }

    const botonFormulario = document.querySelector("#viaje-form button[type='submit']");
    if (botonFormulario) botonFormulario.innerText = "💾 Actualizar Experiencia";

    const btnCancelar = document.getElementById("btn-cancelar");
    if (btnCancelar) btnCancelar.style.display = "block";
    
    const eliminarImagen = document.getElementById("eliminarImagen");
    if (eliminarImagen) eliminarImagen.style.display = "inline-flex";

    document.getElementById("viaje-form").scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}


// Envía el formulario procesándolo mediante FormData multimedia hacia el servidor
async function registrarViaje(event) {
    event.preventDefault();

    const formData = new FormData();

    formData.append("titulo", document.getElementById("titulo").value);
    formData.append("categoria", document.getElementById("categoria").value);
    formData.append("pais", document.getElementById("pais").value || "No especificado");
    formData.append("descripcion", document.getElementById("descripcion").value);
    formData.append("estado", document.getElementById("estado").value);
    formData.append("fecha", document.getElementById("fecha").value);
    formData.append("calificacion", document.getElementById("calificacion").value);

    const imagenUrl = document.getElementById("imagenUrl")?.value || "";
    formData.append("imagenUrl", imagenUrl);

    const inputFile = document.getElementById("imagenFile");

    if (inputFile && inputFile.files.length > 0) {
        formData.append("imagenFile", inputFile.files[0]);
    }

    const chkEliminar = document.getElementById("chekeliminarImagen");

    if (chkEliminar) {
        formData.append("eliminarImagen", chkEliminar.checked);
    }

    try {

        if (idViajeEditando !== null) {

            console.log("Procesando actualización...");

            await enviarActualizacionServidor(formData);

        } else {

            console.log("Procesando creación...");

            await enviarCreacionServidor(formData);
        }

    } catch (error) {

        console.error("Error al procesar la escapada:", error);

    }
    console.log(req.file);
}

// Actualizar viaje existente
async function enviarActualizacionServidor(formData) {

    try {

        const respuesta = await fetch(
            `${API_URL}/${idViajeEditando}`,
            {
                method: "PUT",
                body: formData
            }
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo actualizar la experiencia");
        }

        cancelarEdicion();
        await cargarViajes();

    } catch (error) {

        console.error("Error al actualizar:", error);
    }
}

// Crear nuevo viaje
async function enviarCreacionServidor(formData) {

    try {

        const respuesta = await fetch(
            API_URL,
            {
                method: "POST",
                body: formData
            }
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo guardar la experiencia");
        }

        cancelarEdicion();
        await cargarViajes();

    } catch (error) {

        console.error("Error al guardar:", error);
    }
}

// Cambia el estado rápido desde la tarjeta
async function cambiarEstadoServidor(id, nuevoEstado) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        await cargarViajes();
    } catch (error) {
        console.error("Error al actualizar el estado:", error);
    }
}

// Elimina una tarjeta mediante su ID único
async function borrarViajeServidor(id) {
    if (confirm("¿Seguro que quieres eliminar este recuerdo de viaje?")) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            await cargarViajes();
        } catch (error) {
            console.error("Error al borrar la escapada:", error);
        }
    }
}

// Limpia el formulario y restablece los elementos visuales
function cancelarEdicion() {
    idViajeEditando = null;

    const formulario = document.getElementById("viaje-form");
    if (formulario) formulario.reset();
    
    establecerFechaDeHoy(); 

    const botonFormulario = document.querySelector("#viaje-form button[type='submit']");
    if (formulario && botonFormulario) botonFormulario.innerText = "➕ Guardar Experiencia";

    const btnCancelar = document.getElementById("btn-cancelar");
    if (btnCancelar) btnCancelar.style.display = "none";

    const eliminarImagen = document.getElementById("eliminarImagen");
    if (eliminarImagen) eliminarImagen.style.display = "none";

    const contenedorUrl = document.getElementById("contenedor-vista-previa-url");
    const contenedorArchivo = document.getElementById("contenedor-vista-previa-archivo");
    const vistaPreviaImg = document.getElementById("vista-previa-img-archivo");

    if (contenedorUrl) contenedorUrl.style.display = "none";
    if (contenedorArchivo) contenedorArchivo.style.display = "none";
    if (vistaPreviaImg) vistaPreviaImg.src = "";
}

// Controla el renderizado de la imagen previa local
function actualizarVistaPreviaImagenFile() {
    const inputFile = document.getElementById("imagenFile");
    const contenedor = document.getElementById("contenedor-vista-previa-archivo");
    const imgFile = document.getElementById("vista-previa-img-archivo");
    
    if (!inputFile || !contenedor || !imgFile) return;

    const file = inputFile.files;
    if (!file || file.length === 0) {
        contenedor.style.display = "none";
        imgFile.src = "";
        return;
    }

    imgFile.onerror = function () {
        contenedor.style.display = "none";
        imgFile.src = "";
    };

    const reader = new FileReader();
    reader.onload = (e) => {
        imgFile.src = e.target.result;
        contenedor.style.display = "block";
    };
    reader.readAsDataURL(file[0]);
}

// Controla el renderizado de la imagen previa remota
function actualizarVistaPreviaImagenUrl() {
    const inputUrlElem = document.getElementById("imagenUrl");
    const inputUrl = inputUrlElem ? inputUrlElem.value.trim() : "";
    const contenedor = document.getElementById("contenedor-vista-previa-url");
    const imgUrl = document.getElementById("vista-previa-img-url");
    
    if (!contenedor || !imgUrl) return;

    if (inputUrl) {
        imgUrl.src = inputUrl;
        contenedor.style.display = "block";
    } else {
        contenedor.style.display = "none";
        imgUrl.src = "";
    }

    imgUrl.onerror = function () {
        imgUrl.src = "";
    };
}

// Configura interacciones de botones de filtro
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
