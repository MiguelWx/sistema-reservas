import { listReservations, removeReservation } from '../services/reservationService.js';
import { SPACES } from '../services/spacesData.js';

export function renderReservationList(root) {
  root.innerHTML = '<h2>Mis reservas</h2>';
  const list = listReservations();
  if (!list.length) { root.innerHTML += '<p>No hay reservas.</p>'; return; }
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '0.4rem';

  list.forEach(r => {
    const space = SPACES.find(s => s.id === r.spaceId) || { name: 'Desconocido', img: '' };
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.gap = '0.6rem';
    div.style.marginBottom = '0.6rem';

    if (space.img) {
      const img = document.createElement('img');
      img.src = space.img;
      img.alt = space.name;
      img.style.width = '80px';
      img.style.height = '60px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '4px';
      div.appendChild(img);
    }

    const info = document.createElement('div');
    info.style.flex = '1';
    info.innerHTML = `<strong>${r.name}</strong> — ${space.name} <br/><small>${r.date} ${r.timeStart} - ${r.timeEnd} (${r.duration}h)</small>`;
    div.appendChild(info);

    const btn = document.createElement('button');
    btn.textContent = 'Cancelar';
    btn.addEventListener('click', () => {
      removeReservation(r.id);
      renderReservationList(root);
    });
    div.appendChild(btn);

    container.appendChild(div);
  });

  root.appendChild(container);
}