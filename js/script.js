document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calcularBtn").addEventListener("click", calcularDescuento);
    document.getElementById("formularioDescuento").addEventListener("submit", function (event) {
        event.preventDefault();
        calcularDescuento();
    });

    mostrarLibrosGuardados();
});

function cargarDescuentos() {
    return fetch("../descuentos.json")
        .then(response => response.json())
        .then(data => data.descuentos)
        .catch(error => {
            console.error("Error al cargar el archivo JSON:", error);
            return [];
        });
}

async function calcularDescuento() {
    const precioMensual = 5000;
    let librosDonados = parseInt(document.getElementById("libros").value, 10);
    let resultado = document.getElementById("resultado");
    let formLibros = document.getElementById("formLibros");

    // Limpiar contenido previo
    resultado.innerText = "";
    formLibros.innerHTML = "";
    document.getElementById("libros").value = "";  // Limpiar el campo de número de libros

    // Validar entrada
    if (isNaN(librosDonados) || librosDonados <= 0) {
        resultado.innerText = "⚠️ Ingresá un número válido.";
        return;
    }

    // Cargar los descuentos desde el archivo JSON
    let descuentos = await cargarDescuentos();

    // Buscar el descuento correspondiente
    let descuento = descuentos.find(d => d.libros === librosDonados);
    if (!descuento) {
        resultado.innerText = "⚠️ No se encuentra descuento para esa cantidad de libros.";
        return;
    }

    // Calcular el monto a pagar después del descuento
    let montoDescuento = descuento.descuento;
    let totalAPagar = precioMensual - montoDescuento;
    resultado.innerText = `📚 Donando ${librosDonados} libro(s)\n💸 Obtenés un descuento de $${montoDescuento}\n✅ Próximo mes: $${totalAPagar}`;
    if (librosDonados >= 5) resultado.innerText += `\n🎉 ¡Felicitaciones! Obtuviste un mes gratis`;

    // Agregar título del formulario solo si no existe
    if (!document.getElementById("tituloFormulario")) {
        let tituloFormulario = document.createElement("h2");
        tituloFormulario.id = "tituloFormulario";
        tituloFormulario.innerText = "📚 Contanos los libros que a donar";
        tituloFormulario.classList.add("form-titulo");
        formLibros.appendChild(tituloFormulario);
    }

    // Generar formulario dinámico
    for (let i = 1; i <= librosDonados; i++) {
        let nuevoFormulario = document.createElement("div");
        nuevoFormulario.classList.add("form-container");
        nuevoFormulario.innerHTML = `
            <h3>Libro ${i}</h3>
            <label for="titulo${i}">Título:</label>
            <input type="text" id="titulo${i}" class="input-libro" placeholder="Ingrese el título" required>

            <label for="autor${i}">Autor:</label>
            <input type="text" id="autor${i}" class="input-libro" placeholder="Ingrese el autor" required>

            <label for="estado${i}">Estado:</label>
            <select id="estado${i}" class="input-libro">
                <option value="">Seleccionar</option>      
                <option value="Malo">Malo</option>
                <option value="Bueno">Bueno</option>
                <option value="Muy bueno">Muy bueno</option>
                <option value="Como nuevo">Como nuevo</option>
            </select>
        `;
        formLibros.appendChild(nuevoFormulario);
    }

    // Agregar botón para guardar en localStorage
    let guardarBtn = document.createElement("button");
    guardarBtn.classList.add("boton-storage");
    guardarBtn.innerText = "Guardar Libros";
    guardarBtn.id = "guardarBtn";
    guardarBtn.addEventListener("click", guardarLibros);
    formLibros.appendChild(guardarBtn);
}

function guardarLibros() {
    localStorage.removeItem("librosDonados");
    let librosDonados = document.querySelectorAll(".input-libro");
    let libros = [];

    for (let i = 0; i < librosDonados.length; i += 3) {
        let titulo = librosDonados[i].value.trim();
        let autor = librosDonados[i + 1].value.trim();
        let estado = librosDonados[i + 2].value.trim();

        if (titulo && autor) {
            libros.push({ titulo, autor, estado });
        }
    }

    if (libros.length === 0) {
        alert("⚠️ Debes completar al menos un libro antes de guardarlo.");
        return;
    }

    localStorage.setItem("librosDonados", JSON.stringify(libros));
    mostrarLibrosGuardados();
    limpiarFormulario();  // Limpiar el formulario después de guardar los libros
}

function mostrarLibrosGuardados() {
    let listaLibros = document.getElementById("listaLibros");
    listaLibros.innerHTML = "";

    let libros = JSON.parse(localStorage.getItem("librosDonados")) || [];

    if (libros.length > 0) {
        if (!document.getElementById("tituloLibrosGuardados")) {
            let tituloLibros = document.createElement("h2");
            tituloLibros.id = "tituloLibrosGuardados";
            tituloLibros.innerText = "📚 Tus libros guardados";
            tituloLibros.classList.add("form-titulo");
            listaLibros.appendChild(tituloLibros);
        }

        libros.forEach((libro) => {
            let libroItem = document.createElement("p");
            libroItem.classList.add("form-parrafo");
            libroItem.innerHTML = `📖 <strong>${libro.titulo}</strong> ${libro.autor} - Estado, ${libro.estado}`;
            listaLibros.appendChild(libroItem);
        });

        // Agregar botón para eliminar libros guardados
        let eliminarBtn = document.createElement("button");
        eliminarBtn.classList.add("boton-storage");
        eliminarBtn.innerText = "Eliminar Libros Guardados";
        eliminarBtn.id = "eliminarBtn";
        eliminarBtn.addEventListener("click", eliminarLibros);
        listaLibros.appendChild(eliminarBtn);
    } else {
        let mensajeVacio = document.createElement("p");
        mensajeVacio.classList.add("form-parrafo");
        mensajeVacio.innerText = "Todavía no cargaste libros.";
        listaLibros.appendChild(mensajeVacio);
    }
}

function eliminarLibros() {
    localStorage.removeItem("librosDonados");
    mostrarLibrosGuardados();
    // Eliminar también el mensaje de descuento
    let resultado = document.getElementById("resultado");
    resultado.innerText = "";
    
    // Mostrar alerta con SweetAlert
    Swal.fire({
        title: "Libros eliminados",
        text: "Se han eliminado tus libros guardados.",
        icon: "warning",
        confirmButtonText: "Aceptar"
    });
}

function limpiarFormulario() {
    // Limpiar los campos del formulario después de guardar los libros
    let librosDonados = document.querySelectorAll(".input-libro");
    librosDonados.forEach((input) => {
        input.value = "";
    });
}
