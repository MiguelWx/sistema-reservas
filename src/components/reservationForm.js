import { addReservation } from "../services/reservationService.js";

export function renderReservationForm(root, spaces, onSave) {
  root.innerHTML = "<h2>Reservar</h2>";
  const form = document.createElement("form");

  // Nombre
  const lblName = document.createElement("label");
  lblName.innerHTML = "Nombre<br/>";
  const inputName = document.createElement("input");
  inputName.name = "name";
  inputName.required = true;
  lblName.appendChild(inputName);
  form.appendChild(lblName);
  form.appendChild(document.createElement("br"));

  // Fecha
  const lblDate = document.createElement("label");
  lblDate.innerHTML = "Fecha<br/>";
  const inputDate = document.createElement("input");
  inputDate.type = "date";
  inputDate.name = "date";
  inputDate.required = true;
  lblDate.appendChild(inputDate);
  form.appendChild(lblDate);
  form.appendChild(document.createElement("br"));

  // Hora
  const lblTime = document.createElement("label");
  lblTime.innerHTML = "Hora<br/>";
  const inputTime = document.createElement("input");
  inputTime.type = "time";
  inputTime.name = "time";
  inputTime.required = true;
  lblTime.appendChild(inputTime);
  form.appendChild(lblTime);
  form.appendChild(document.createElement("br"));

  // Espacio (select)
  const lblSpace = document.createElement("label");
  lblSpace.innerHTML = "Espacio<br/>";
  const select = document.createElement("select");
  select.name = "spaceId";
  select.required = true;
  spaces.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = `${s.name} (${s.type})`;
    select.appendChild(opt);
  });
  lblSpace.appendChild(select);
  form.appendChild(lblSpace);
  form.appendChild(document.createElement("br"));

  // Preview
  const previewWrap = document.createElement("div");
  previewWrap.id = "space-preview";
  previewWrap.style.marginTop = "0.5rem";
  form.appendChild(previewWrap);

  function updatePreview() {
    const id = select.value;
    const sp = spaces.find(x => x.id === id);
    previewWrap.innerHTML = "";
    if (sp) {
      const img = document.createElement("img");
      img.src = sp.img;
      img.alt = sp.name;
      img.style.maxWidth = "200px";
      img.style.borderRadius = "6px";
      const caption = document.createElement("div");
      caption.textContent = sp.name;
      previewWrap.appendChild(img);
      previewWrap.appendChild(caption);
    }
  }
  updatePreview();
  select.addEventListener("change", updatePreview);

  // Submit button
  const btn = document.createElement("button");
  btn.type = "submit";
  btn.textContent = "Confirmar";
  form.appendChild(btn);

  // Handler submit (con validación de fecha/hora pasada)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = inputName.value.trim();
    const date = inputDate.value;
    const time = inputTime.value;
    const spaceId = select.value;

    if (!name || !date || !time) {
      alert("Completa nombre, fecha y hora.");
      return;
    }

    const selectedDateTime = new Date(`${date}T${time}:00`);
    if (selectedDateTime.getTime() < Date.now()) {
      alert("No puedes reservar en una fecha/hora pasada.");
      return;
    }

    const reservation = {
      id: "r_" + Date.now(),
      name,
      date,
      time,
      spaceId
    };

    try {
      addReservation(reservation);
      alert("Reserva creada");
      form.reset();
      updatePreview();
      if (onSave) onSave();
    } catch (err) {
      alert(err.message || "Error al crear reserva");
    }
  });

  root.appendChild(form);
}
