# Sistema de Reservas Universitarias — Prototipo Frontend

**Descripción**  
Prototipo frontend para reservar espacios universitarios (aulas, laboratorios, canchas).  
Funcionalidades principales: listado de espacios con imagen, formulario de reserva por intervalo (hora inicio — hora fin), detección de solapamientos, cancelación de reservas, persistencia en `localStorage`, notificación visual y sonora al confirmar, filtro por tipo de espacio y al menos una prueba automatizada (Vitest).

---

## Requisitos
- Node.js (recomendado LTS, p. ej. ≥18)
- npm (incluido con Node.js)
- Git



---

## Instalación 

```bash
# clonar el repositorio
git clone https://github.com/MiguelWx/sistema-reservas.git
cd sistema-reservas

# instalar dependencias
npm install

# levantar servidor dev (Vite)
npm run dev

Se ejecuta por defecto en: http://localhost:5173/

## Para ejecutar pruebas
npm run test
```
## Estructura del proyecto: 
```
sistema-reservas/
├─ node_modules/...
├─ src/
│  ├─ components/
│  │  ├─ app.js
│  │  ├─ spaceList.js
│  │  ├─ reservationForm.js
│  │  └─ reservationList.js
│  ├─ services/
│  │  ├─ spacesData.js
│  │  └─ reservationService.js
│  ├─ utils/
│  │  └─ storage.js
│  ├─ assets/
│  │  └─ (imagenes y sonido)
│  └─ tests/
│     └─ reservation.test.js
├─ index.html
├─ package-lock.json
├─ package.json
└─ README.md
```
## Tecnologías usadas

Vite — servidor de desarrollo y bundling.
Vanilla JS (ES Modules) — UI modular sin frameworks.
LocalStorage — persistencia local.
Vitest — pruebas unitarias.
HTML + CSS básicos.

## Cómo funciona 

Los espacios están definidos en src/services/spacesData.js.
El formulario pide: nombre, fecha, hora inicio (timeStart) y hora fin (timeEnd).
reservationService.js normaliza entradas, calcula duration y evita solapamientos si ya existe una reserva para el mismo spaceId y date cuyo intervalo se cruce.
Las reservas se guardan en localStorage bajo la clave reservas_v1.
Al confirmar, la app muestra un toast y reproduce /src/assets/beep.mp3 (si existe) o genera un tono por WebAudio como fallback.
Hay un filtro por tipo en la UI (Todos / Aula / Laboratorio / Cancha).
