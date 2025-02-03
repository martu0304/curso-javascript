document.addEventListener("DOMContentLoaded", function() {
  // Agregar event listener al botón
  document.getElementById("calcularBtn").addEventListener("click", calcularSuscripcion);
});

function calcularSuscripcion() {
  const precioMensual = 5000;
  let librosDonados = parseInt(document.getElementById("libros").value, 10);

  // Validación: si no es un número válido
  if (isNaN(librosDonados) || librosDonados < 0) {
      document.getElementById("resultado").innerText = "⚠️ Ingresá un número válido.";
      return;
  }

  // Calcular el descuento
  let descuento = librosDonados * 1000;

  // Limitar el descuento máximo a 5000 (un mes gratis)
  if (descuento > precioMensual) {
      descuento = precioMensual;
  }

  // Calcular cuánto debe pagar el usuario
  let totalAPagar = precioMensual - descuento;

  // Crear el mensaje con los resultados
  let mensaje = `📚 Donando ${librosDonados} libro(s) \n`;
  mensaje += `💸 Obtenés un descuento de $${descuento} \n`;
  mensaje += `✅ El próximo mes vas a pagar $${totalAPagar}`;

  // Mensaje especial si donó 5 libros o más
  if (librosDonados >= 5) {
      mensaje += `\n🎉 ¡Felicitaciones! Obtuviste un mes gratis`;
  }

  // Mostrar el resultado en la página
  document.getElementById("resultado").innerText = mensaje;
}