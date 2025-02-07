document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calcularBtn").addEventListener("click", calcularDescuento);
    document.getElementById("formularioDescuento").addEventListener("submit", function (event) {
        event.preventDefault();
        calcularDescuento();
    });

    mostrarLibrosGuardados();
});

function calcularDescuento() {
    const precioMensual = 5000;
    let librosDonados = parseInt(document.getElementById("libros").value, 10);
    let resultado = document.getElementById("resultado");
    let formLibros = document.getElementById("formLibros");

    // Limpiar contenido previo
    resultado.innerText = "";
    formLibros.innerHTML = "";

    // Validar entrada
    if (isNaN(librosDonados) || librosDonados <= 0) {
        resultado.innerText = "⚠️ Ingresá un número válido.";
        return;
    }

    // Calcular descuento
    let descuento = librosDonados * 1000;
    descuento = Math.min(descuento, precioMensual); // No puede superar el costo mensual
    let totalAPagar = precioMensual - descuento;
    resultado.innerText = `📚 Donando ${librosDonados} libro(s)\n💸 Obtenés un descuento de $${descuento}\n✅ Próximo mes: $${totalAPagar}`;
    if (librosDonados >= 5) resultado.innerText += `\n🎉 ¡Felicitaciones! Obtuviste un mes gratis`;

    // Agregar título del formulario solo si no existe
    if (!document.getElementById("tituloFormulario")) {
        let tituloFormulario = document.createElement("h2");
        tituloFormulario.id = "tituloFormulario";
        tituloFormulario.innerText = "📚 Contanos los libros que querés donar";
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
    // Eliminar los datos previos del localStorage antes de guardar los nuevos
    localStorage.removeItem("librosDonados");
    let librosDonados = document.querySelectorAll(".input-libro"); // Captura todos los inputs y selects
    let libros = [];
    
    // Recorrer los inputs en grupos de 3 (título, autor, estado)
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

    // Guardar en localStorage
    localStorage.setItem("librosDonados", JSON.stringify(libros));
    
    // Mostrar los libros guardados
    mostrarLibrosGuardados();
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
            libroItem.innerHTML = `📖 <strong>${libro.titulo}</strong> - ${libro.autor} (${libro.estado})`;
            listaLibros.appendChild(libroItem);
        });
    } else {
        let mensajeVacio = document.createElement("p");
        mensajeVacio.classList.add("form-parrafo");
        mensajeVacio.innerText = "Todavía no cargaste libros.";
        listaLibros.appendChild(mensajeVacio);
    }
}
