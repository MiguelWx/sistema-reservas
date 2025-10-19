export function renderSpaceList(root, spaces) {
  root.innerHTML = '<h2>Espacios</h2>';
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '0.5rem';

  spaces.forEach(s => {
    const card = document.createElement('div');
    card.style.display = 'flex';
    card.style.alignItems = 'center';
    card.style.gap = '0.6rem';
    card.style.marginBottom = '0.6rem';

    const img = document.createElement('img');
    img.src = s.img;
    img.alt = s.name;
    img.style.width = '80px';
    img.style.height = '60px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '4px';

    const info = document.createElement('div');
    info.innerHTML = `<strong>${s.name}</strong><br/><small>${s.type}</small>`;

    card.appendChild(img);
    card.appendChild(info);
    container.appendChild(card);
  });

  root.appendChild(container);
}
