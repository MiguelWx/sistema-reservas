import { addReservation } from "../services/reservationService.js";

/**
 * Formulario de reserva (ahora solicita hora inicio y hora fin).
 * - Valida: fecha/hora no pasada, end > start
 * - Notificación visual y sonido al confirmar
 */
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

  // Hora inicio
  const lblStart = document.createElement("label");
  lblStart.innerHTML = "Hora inicio<br/>";
  const inputStart = document.createElement("input");
  inputStart.type = "time";
  inputStart.name = "timeStart";
  inputStart.required = true;
  lblStart.appendChild(inputStart);
  form.appendChild(lblStart);
  form.appendChild(document.createElement("br"));

  // Hora fin
  const lblEnd = document.createElement("label");
  lblEnd.innerHTML = "Hora fin<br/>";
  const inputEnd = document.createElement("input");
  inputEnd.type = "time";
  inputEnd.name = "timeEnd";
  inputEnd.required = true;
  lblEnd.appendChild(inputEnd);
  form.appendChild(lblEnd);
  form.appendChild(document.createElement("br"));

  // Espacio
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
      previewWrap.appendChild(img);
      const cap = document.createElement("div");
      cap.textContent = sp.name;
      previewWrap.appendChild(cap);
    }
  }
  updatePreview();
  select.addEventListener("change", updatePreview);

  // Botón
  const btn = document.createElement("button");
  btn.type = "submit";
  btn.textContent = "Confirmar";
  form.appendChild(btn);

  // helper time -> minutos
  const toMinutes = t => {
    if (!t) return NaN;
    const [hh,mm] = t.split(":").map(x => parseInt(x,10));
    return hh*60 + mm;
  };

  // notificación visual (toast) y sonido (beep)
  function showNotification(message) {
    // toast
    let toast = document.getElementById("toast-notify");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast-notify";
      toast.style.position = "fixed";
      toast.style.right = "20px";
      toast.style.bottom = "20px";
      toast.style.background = "#1f8a70";
      toast.style.color = "white";
      toast.style.padding = "12px 18px";
      toast.style.borderRadius = "8px";
      toast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
      toast.style.zIndex = "9999";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = "1";
    setTimeout(() => {
      toast.style.transition = "opacity 600ms";
      toast.style.opacity = "0";
    }, 1600);

    // beep corto usando Web Audio API
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880; // A6
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.value = 0.02;
      o.start();
      setTimeout(() => { o.stop(); ctx.close(); }, 140);
    } catch (e) {
      // si falla audio, no bloquea
      console.warn("Audio failed:", e);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = inputName.value.trim();
    const date = inputDate.value;
    const timeStart = inputStart.value;
    const timeEnd = inputEnd.value;
    const spaceId = select.value;

    if (!name || !date || !timeStart || !timeEnd) {
      alert("Completa nombre, fecha, hora inicio y hora fin.");
      return;
    }

    const sMin = toMinutes(timeStart);
    const eMin = toMinutes(timeEnd);
    if (Number.isNaN(sMin) || Number.isNaN(eMin) || sMin >= eMin) {
      alert("El horario final debe ser posterior al inicio.");
      return;
    }

    // comprobación fecha/hora pasada (start datetime)
    const startDT = new Date(`${date}T${timeStart}:00`);
    if (startDT.getTime() < Date.now()) {
      alert("No puedes reservar en una fecha/hora pasada.");
      return;
    }

    const reservation = {
      id: "r_" + Date.now(),
      name,
      date,
      timeStart,
      timeEnd,
      spaceId
    };

    try {
      addReservation(reservation);
      showNotification("Reserva confirmada");
      form.reset();
      updatePreview();
      if (onSave) onSave();
    } catch (err) {
      alert(err.message || "Error al crear reserva");
    }
  });

  root.appendChild(form);
}