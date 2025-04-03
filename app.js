// URL MockAPI
const API_URL = "https://67ed967f4387d9117bbe14ee.mockapi.io/api/v1/Registros";

// Elementos DOM
const form = document.getElementById("registroForm");
const nombreInput = document.getElementById("nombre");
const fechaNacimientoInput = document.getElementById("fechaNacimiento");
const muerteCheckbox = document.getElementById("muerte");
const fechaDefuncionInput = document.getElementById("fechaDefuncion");
const listaRegistros = document.getElementById("listaRegistros");

const editarForm = document.getElementById("editarForm");
const editarId = document.getElementById("editarId");
const editarNombre = document.getElementById("editarNombre");
const editarFechaNacimiento = document.getElementById("editarFechaNacimiento");
const editarMuerte = document.getElementById("editarMuerte");
const editarFechaDefuncion = document.getElementById("editarFechaDefuncion");


// Habilitar/deshabilitar la fecha de defunción en el formulario de creación
muerteCheckbox.addEventListener("change", () => {
    fechaDefuncionInput.disabled = !muerteCheckbox.checked;
    if (!muerteCheckbox.checked) {
        fechaDefuncionInput.value = "";
    }
});

// Habilitar/deshabilitar la fecha de defunción en el formulario de edición
editarMuerte.addEventListener("change", () => {
    editarFechaDefuncion.disabled = !editarMuerte.checked;
    if (!editarMuerte.checked) {
        editarFechaDefuncion.value = "";
    }
});

// Obtener y mostrar los registros
async function obtenerRegistros() {
    try {
        const respuesta = await fetch(API_URL);
        const registros = await respuesta.json();
        listaRegistros.innerHTML = "";

        registros.forEach(registro => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${registro.nombre}</strong> 
                (Nació: ${registro.fechaNacimiento}) 
                ${registro.muerte ? `☠️ Falleció: ${registro.fechaDefuncion}` : "🟢 Vivo"}
                <button onclick="editarRegistro('${registro.id}')">✏️</button>
                <button onclick="eliminarRegistro('${registro.id}')">❌</button>
            `;
            listaRegistros.appendChild(li);
        });
    } catch (error) {
        console.error("Error al obtener registros:", error);
    }
}

// Agregar un nuevo registro
async function agregarRegistro(event) {
    event.preventDefault();

    const nuevoRegistro = {
        nombre: nombreInput.value,
        fechaNacimiento: fechaNacimientoInput.value,
        muerte: muerteCheckbox.checked,
        fechaDefuncion: muerteCheckbox.checked ? fechaDefuncionInput.value : null
    };

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoRegistro)
        });

        form.reset();
        fechaDefuncionInput.disabled = true;
        obtenerRegistros();
    } catch (error) {
        console.error("Error al agregar registro:", error);
    }
}

// Eliminar un registro
async function eliminarRegistro(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        obtenerRegistros();
    } catch (error) {
        console.error("Error al eliminar registro:", error);
    }
}

// Editar un registro
async function editarRegistro(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`);
        const registro = await respuesta.json();

        editarId.value = registro.id;
        editarNombre.value = registro.nombre;
        editarFechaNacimiento.value = registro.fechaNacimiento;
        editarMuerte.checked = registro.muerte;
        editarFechaDefuncion.value = registro.fechaDefuncion || "";
        editarFechaDefuncion.disabled = !registro.muerte;

        editarForm.style.display = "block";
    } catch (error) {
        console.error("Error al cargar registro para editar:", error);
    }
}

// Guardar cambios en un registro editado
editarForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = editarId.value;
    const registroActualizado = {
        nombre: editarNombre.value,
        fechaNacimiento: editarFechaNacimiento.value,
        muerte: editarMuerte.checked,
        fechaDefuncion: editarMuerte.checked ? editarFechaDefuncion.value : null
    };

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registroActualizado)
        });

        editarForm.style.display = "none";
        obtenerRegistros();
    } catch (error) {
        console.error("Error al actualizar registro:", error);
    }
});

// Cancelar edición
function cancelarEdicion() {
    editarForm.style.display = "none";
}

// Escuchar eventos
form.addEventListener("submit", agregarRegistro);
obtenerRegistros();
