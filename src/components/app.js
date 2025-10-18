import { SPACES } from "../services/spacesData.js";
import { renderSpaceList } from "./spaceList.js";
import { renderReservationForm } from "./reservationForm.js";
import { renderReservationList } from "./reservationList.js";

export function renderApp(root) {
  root.innerHTML = "";
  const container = document.createElement("div");
  container.className = "container";

  const header = document.createElement("h1");
  header.textContent = "Sistema de Reservas - Prototipo";
  container.appendChild(header);

  // filtro por tipo
  const filterWrap = document.createElement("div");
  filterWrap.style.marginBottom = "0.6rem";
  filterWrap.innerHTML = '<label>Filtrar por tipo: </label>';
  const filterSelect = document.createElement("select");
  ["Todos", "Aula", "Laboratorio", "Cancha"].forEach(t => {
    const o = document.createElement("option");
    o.value = t === "Todos" ? "" : t;
    o.textContent = t;
    filterSelect.appendChild(o);
  });
  filterWrap.appendChild(filterSelect);
  container.appendChild(filterWrap);

  const top = document.createElement("div");
  top.className = "row";

  const left = document.createElement("div");
  left.style.flex = "1";

  const right = document.createElement("div");
  right.style.flex = "1";

  top.appendChild(left);
  top.appendChild(right);
  container.appendChild(top);

  const reservationListContainer = document.createElement("div");
  reservationListContainer.style.marginTop = "1rem";
  container.appendChild(reservationListContainer);

  function getFilteredSpaces() {
    const t = filterSelect.value;
    return t ? SPACES.filter(s => s.type === t) : SPACES.slice();
  }

  function renderAll() {
    left.innerHTML = "";
    right.innerHTML = "";
    const filtered = getFilteredSpaces();
    renderSpaceList(left, filtered);
    renderReservationForm(right, filtered, () => {
      reservationListContainer.innerHTML = "";
      renderReservationList(reservationListContainer);
    });
  }

  filterSelect.addEventListener("change", () => {
    renderAll();
  });

  // inicial
  renderAll();

  root.appendChild(container);
}