/* ====== MiniFlix - app.js ======
   Funcion para filtrar tarjetas por texto.
*/

const input = document.getElementById("search");
const grid = document.getElementById("grid");
const status = document.getElementById("status");

// Se seleccionan todas las tarjetas 
const cards = Array.from(grid.querySelectorAll(".card"));

/**
 * filtrarCatalogo(texto)
 * - texto: string que viene del input.
 * - Compara con el atributo data-title de cada card.
 */
function filtrarCatalogo(texto) {
  const q = texto.trim().toLowerCase();
  let visibles = 0;

  cards.forEach((card) => {
    const title = (card.dataset.title || "").toLowerCase();
    const match = title.includes(q);

    // Mostrar/ocultar
    card.style.display = match ? "" : "none";
    if (match) visibles++;
  });

  status.textContent = q
    ? `Resultados: ${visibles}`
    : ""; // si no hay búsqueda, se oculta el mensaje
}

// Cada vez que el usuario escribe, se filtra
input.addEventListener("input", (e) => {
  filtrarCatalogo(e.target.value);
});
