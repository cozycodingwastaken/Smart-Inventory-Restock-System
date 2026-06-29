# Smart Inventory Restocking System
**Sari-Sari Store ni Badong**

Members:\
Jerwin Anacion\
Nathan Badango\
Elidan Fuertes\
Ronn Christian Rodillo


An inventory restocking system made by students of **Holy Trinity University** for their **Event Driven Programming** class.

A web app for managing inventory in a Filipino Sari-Sari convenience store. Products are organized into zones using drag-and-drop, with automatic low-stock alerts and full localStorage persistence.

---

## Features

| Feature | Description |
|---------|-------------|
| Drag-and-Drop Zones | Move product cards between Storage, Shelf, and Out of Stock |
| Add Product | Add new items via a modal form (name, price, quantity, threshold) |
| Edit Product | Click any card to open it and edit its details |
| Delete Product | Drag a card to the trash bin to remove it (with confirmation) |
| Restock Product | Drag a card to the Restock Area to add units back |
| Low Stock Alert | Red warning badge appears automatically when quantity is below threshold |
| Persistent Storage | All data is saved to `localStorage` — survives page refresh |

---

## How to Run

No installation, no dependencies.

1. Download or clone the repository
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge)
3. That's it
4. Or you can also Visit https://cozycodingwastaken.github.io/Smart-Inventory-Restock-System/

---

## How to Use

1. **Move a product** — drag a card and drop it into a different zone
2. **Add a product** — click **+ Add Product** in the top-right corner
3. **Edit a product** — click directly on any product card
4. **Delete a product** — drag a card onto the red **Drag here to Delete** area
5. **Restock a product** — drag a card onto the blue **Drag here to Restock** area; you'll be asked how many units to add

---

## File Structure

```
Sari-Sari Store/
├── index.html          Page layout and structure
├── style.css           All visual styling (flat design, Flexbox)
├── app.js              All JavaScript logic (no frameworks)
```

---

## Data Layer

All data is stored in the browser's `localStorage`. There is no backend or database.

| Store | localStorage Key | Contents |
|-------|-----------------|----------|
| D1 | `sari_d1_products` | Product list — id, name, price, quantity |
| D2 | `sari_d2_zones` | Zone assignment per product |
| D3 | `sari_d3_thresholds` | Low-stock threshold per product |

---

## Processes (DFD Level 1)

| Process | What it does |
|---------|-------------|
| P1 — Manage Products | Add, edit, and delete products via modal form |
| P2 — Manage Zone Assignment | Drag-and-drop cards between zones |
| P3 — Restock Products | Drag card to Restock Area → adds units, moves out of OOS |
| P4 — Monitor Stock Levels | Auto-detects low quantity, shows badge and red border |

---

## Tech Stack

- **HTML5** — semantic tags, data attributes, drag-and-drop API
- **CSS3** — Flexbox layout, pseudo-elements, transitions
- **Vanilla JavaScript** — no frameworks, no libraries
- **localStorage** — browser-side data persistence
