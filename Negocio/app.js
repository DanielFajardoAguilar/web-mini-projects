/* ====== app.js (Renta de Andamios) ======
   1) Generar un número de contrato simple
   2) Calcular días de renta
   3) Calcular total por productos + flete opcional
   4) Pintar un resumen en pantalla (vista previa)
*/

// ====== PRECIOS (constantes) ======
const PRICES = {
  small: 30,   // andamio chico por día
  big: 35,     // andamio grande por día
  plat: 15,    // plataforma metálica por día
  wheels: 35   // llantas (juego) por día
};

// ====== DOM: referencias a elementos ======
const contractNo = document.getElementById("contractNo");
const clientName = document.getElementById("clientName");
const idFile = document.getElementById("idFile");

const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");

const qtySmall = document.getElementById("qtySmall");
const qtyBig = document.getElementById("qtyBig");
const qtyPlat = document.getElementById("qtyPlat");
const qtyWheels = document.getElementById("qtyWheels");

const useDelivery = document.getElementById("useDelivery");
const deliveryBox = document.getElementById("deliveryBox");
const deliveryFee = document.getElementById("deliveryFee");

const btnGenerate = document.getElementById("btnGenerate");
const preview = document.getElementById("preview");
const totalEl = document.getElementById("total");

// ====== Para generar número de contrato ======
function generaContrato() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rnd = Math.floor(1000 + Math.random() * 9000);
  return `A-${y}${m}${day}-${rnd}`;
}

// ====== Calcular días ======
function diasEntre(inicio, fin) {
  const a = new Date(inicio);
  const b = new Date(fin);

  // Validación fechas 
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;

  // Diferencia en milisegundos
  const diff = b.getTime() - a.getTime();

  // Convertimos ms a días (24*60*60*1000)
  const days = Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;

  // Si fin < inicio, days quedará <= 0
  return days;
}

// ====== Lógica de cálculo ======
/**
 * calcularTotal(dias, cantidades, flete)
 * total = dias * sum(qty_i * price_i) + flete(opcional)
 */
function calcularTotal(dias, cantidades, flete) {
  const subtotalPorDia =
    (cantidades.small * PRICES.small) +
    (cantidades.big * PRICES.big) +
    (cantidades.plat * PRICES.plat) +
    (cantidades.wheels * PRICES.wheels);

  const subtotalRenta = dias * subtotalPorDia;
  return subtotalRenta + flete;
}

// Mostrar/ocultar caja de flete cuando se marca el checkbox
useDelivery.addEventListener("change", () => {
  deliveryBox.classList.toggle("hidden", !useDelivery.checked);
});

// Al cargar, se coloca un número de contrato
contractNo.value = generaContrato();

// Botón "Generar resumen"
btnGenerate.addEventListener("click", () => {
  // ====== Validaciones básicas ======
  if (!clientName.value.trim()) {
    alert("Falta el nombre del cliente.");
    return;
  }

  // Validar identificación adjunta (que haya archivo)
  if (!idFile.files || idFile.files.length === 0) {
    alert("Adjunta una identificación (archivo).");
    return;
  }

  if (!startDate.value || !endDate.value) {
    alert("Selecciona fecha de inicio y fin.");
    return;
  }

  const dias = diasEntre(startDate.value, endDate.value);
  if (dias <= 0) {
    alert("La fecha fin debe ser igual o posterior a la fecha inicio.");
    return;
  }

  // Conversion a número, y si viene vacío, se usa 0
  const cantidades = {
    small: Number(qtySmall.value || 0),
    big: Number(qtyBig.value || 0),
    plat: Number(qtyPlat.value || 0),
    wheels: Number(qtyWheels.value || 0)
  };

  // Validar que al menos pidan algo
  const totalItems = cantidades.small + cantidades.big + cantidades.plat + cantidades.wheels;
  if (totalItems <= 0) {
    alert("Agrega al menos un producto al pedido.");
    return;
  }

  // Flete: solo si está activo
  const flete = useDelivery.checked ? Number(deliveryFee.value || 0) : 0;

  // Calcular total
  const total = calcularTotal(dias, cantidades, flete);

  // ====== Construir resumen (HTML) ======
  const resumen = `
    <p><strong>No. de contrato:</strong> ${contractNo.value}</p>
    <p><strong>Cliente:</strong> ${clientName.value.trim()}</p>
    <p><strong>Renta:</strong> ${startDate.value} al ${endDate.value} (<strong>${dias}</strong> día(s))</p>

    <hr />

    <p><strong>Pedido (por día):</strong></p>
    <ul>
      <li>Andamio chico: ${cantidades.small} x $${PRICES.small}</li>
      <li>Andamio grande: ${cantidades.big} x $${PRICES.big}</li>
      <li>Plataformas metálicas: ${cantidades.plat} x $${PRICES.plat}</li>
      <li>Llantas (juego): ${cantidades.wheels} x $${PRICES.wheels}</li>
    </ul>

    <p><strong>Flete:</strong> ${flete > 0 ? `$${flete}` : "No aplica"}</p>

    <hr />

    <p class="muted small">
      Identificación adjunta: ${idFile.files[0].name}
    </p>

    <p class="muted small">
      Nota: Esta solicitud será revisada y confirmada de ser aprobada.
    </p>
  `;

  preview.innerHTML = resumen;


  totalEl.textContent = `$${total.toFixed(2)}`;
});

// Botón reset: al limpiar, se regenera contrato y limpiamos vista previa
document.getElementById("form").addEventListener("reset", () => {
  // setTimeout para esperar a que el reset borre los inputs
  setTimeout(() => {
    contractNo.value = generaContrato();
    preview.innerHTML = `<p class="muted">Completa el formulario y presiona “Generar resumen”.</p>`;
    totalEl.textContent = "$0";
    deliveryBox.classList.add("hidden");
  }, 0);
});
