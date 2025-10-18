import { listReservations, removeReservation } from "../services/reservationService.js";
import { SPACES } from "../services/spacesData.js";

export function renderReservationList(root) {
  root.innerHTML = "<h2>Mis reservas</h2>";
  const list = listReservations();
  if (!list.length) {
    const p = document.createElement("p");
    p.textContent = "No hay reservas.";
    root.appendChild(p);
    return;
  }

  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "0.5rem";

  list.forEach(r => {
    const space = SPACES.find(s => s.id === r.spaceId) || { name: "Desconocido", img: "" };
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "0.6rem";
    row.style.marginBottom = "0.6rem";

    if (space.img) {
      const img = document.createElement("img");
      img.src = space.img;
      img.alt = space.name;
      img.style.width = "80px";
      img.style.height = "60px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "4px";
      row.appendChild(img);
    }

    const info = document.createElement("div");
    info.style.flex = "1";
    info.innerHTML = `<strong>${r.name}</strong><br/><small>${space.name} — ${r.date} ${r.time}</small>`;
    row.appendChild(info);

    const btn = document.createElement("button");
    btn.textContent = "Cancelar";
    btn.addEventListener("click", () => {
      removeReservation(r.id);
      renderReservationList(root);
    });
    row.appendChild(btn);

    container.appendChild(row);
  });

  root.appendChild(container);
}