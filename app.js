// =============================================
// D1 — PRODUCT INVENTORY
// Each product has: id, name, price, quantity
// =============================================
let products = [
  { id: 1, name: "Instant Noodles",  price: 15,  quantity: 50  },
  { id: 2, name: "Canned Sardines",  price: 25,  quantity: 3   },
  { id: 3, name: "Rice (per kilo)",  price: 55,  quantity: 100 },
  { id: 4, name: "Cooking Oil",      price: 60,  quantity: 2   },
  { id: 5, name: "Soy Sauce",        price: 12,  quantity: 0   },
  { id: 6, name: "Vinegar",          price: 10,  quantity: 0   },
  { id: 7, name: "Sugar (per kilo)", price: 75,  quantity: 8   },
  { id: 8, name: "Coffee Mix",       price: 8,   quantity: 30  },
];


// =============================================
// D2 — ZONE ASSIGNMENTS
// Maps productId -> zone name
// Valid zones: "storage", "shelf", "out-of-stock"
// =============================================
let zoneAssignments = {
  1: "shelf",
  2: "shelf",
  3: "storage",
  4: "storage",
  5: "out-of-stock",
  6: "out-of-stock",
  7: "shelf",
  8: "storage",
};


// =============================================
// D3 — ALERT THRESHOLDS
// Maps productId -> minimum quantity before alert.
// Uses "let" so new products can add their own.
// =============================================
let thresholds = {
  1: 10,
  2: 5,
  3: 20,
  4: 5,
  5: 5,
  6: 5,
  7: 10,
  8: 10,
};


// =============================================
// STORAGE KEYS
// Names of the keys saved in localStorage.
// =============================================
const STORAGE_KEY_D1 = "sari_d1_products";
const STORAGE_KEY_D2 = "sari_d2_zones";
const STORAGE_KEY_D3 = "sari_d3_thresholds";


// =============================================
// PERSISTENCE — SAVE
// Writes D1, D2, and D3 to localStorage.
// Call this after every change to keep data fresh.
// =============================================
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY_D1, JSON.stringify(products));
  localStorage.setItem(STORAGE_KEY_D2, JSON.stringify(zoneAssignments));
  localStorage.setItem(STORAGE_KEY_D3, JSON.stringify(thresholds));
}


// =============================================
// PERSISTENCE — LOAD
// Reads from localStorage on page load.
// Each store loads independently so missing one
// won't wipe out the others.
// =============================================
function loadFromStorage() {
  var savedProducts   = localStorage.getItem(STORAGE_KEY_D1);
  var savedZones      = localStorage.getItem(STORAGE_KEY_D2);
  var savedThresholds = localStorage.getItem(STORAGE_KEY_D3);

  if (savedProducts)   products        = JSON.parse(savedProducts);
  if (savedZones)      zoneAssignments = JSON.parse(savedZones);
  if (savedThresholds) thresholds      = JSON.parse(savedThresholds);

  // Very first visit — save the hardcoded defaults
  if (!savedProducts) saveToStorage();
}


// =============================================
// HELPERS
// =============================================

// P4: Returns true if the product's quantity is
// below its threshold in D3.
function isLowStock(product) {
  var minimum = thresholds[product.id];
  if (minimum === undefined) return false;
  return product.quantity < minimum;
}

// Generates the next available ID for a new product.
function generateId() {
  if (products.length === 0) return 1;
  var ids = products.map(function(p) { return p.id; });
  return Math.max.apply(null, ids) + 1;
}


// =============================================
// RENDERING
// Builds one product card element from data.
// =============================================
function createProductCard(product) {
  var lowStock = isLowStock(product);

  var card = document.createElement("div");
  card.className = "product-card" + (lowStock ? " low-stock" : "");
  card.draggable = true;
  card.dataset.productId = String(product.id);

  card.innerHTML = `
    <div class="card-name">${product.name}</div>
    <div class="card-details">
      <span class="card-price">&#8369;${product.price.toFixed(2)}</span>
      <span class="card-quantity">Qty: ${product.quantity}</span>
    </div>
    ${lowStock ? '<div class="low-stock-badge">&#9888; Low Stock</div>' : ""}
    <div class="card-edit-hint">click to edit</div>
  `;

  card.addEventListener("dragstart", handleDragStart);
  card.addEventListener("dragend",   handleDragEnd);
  card.addEventListener("click",     handleCardClick);

  return card;
}


// Redraws all three zones from the current data.
function renderBoard() {
  var zoneNames = ["storage", "shelf", "out-of-stock"];

  zoneNames.forEach(function(zoneName) {
    var dropArea   = document.querySelector('[data-zone="' + zoneName + '"]');
    var countBadge = document.getElementById("count-" + zoneName);

    // Clear existing cards
    dropArea.innerHTML = "";

    // Find all products assigned to this zone
    var productsInZone = products.filter(function(p) {
      return zoneAssignments[p.id] === zoneName;
    });

    productsInZone.forEach(function(product) {
      dropArea.appendChild(createProductCard(product));
    });

    // Update the count badge in the zone banner
    if (countBadge) {
      countBadge.textContent = productsInZone.length;
    }
  });
}


// =============================================
// P1 — MANAGE PRODUCTS (Add / Edit)
// =============================================

// Tracks which product is open in the form.
// null = add mode. A number = edit mode.
var editingProductId = null;


// Opens the modal in either "add" or "edit" mode.
function openModal(mode, productId) {
  var overlay   = document.getElementById("modal-overlay");
  var title     = document.getElementById("modal-title");
  var submitBtn = document.getElementById("btn-submit");
  var errorMsg  = document.getElementById("form-error");

  errorMsg.textContent = "";

  if (mode === "edit") {
    editingProductId = productId;

    // Pre-fill form with the product's current values
    var product = products.find(function(p) { return p.id === productId; });

    document.getElementById("field-name").value      = product.name;
    document.getElementById("field-price").value     = product.price;
    document.getElementById("field-qty").value       = product.quantity;
    document.getElementById("field-threshold").value = thresholds[productId] !== undefined ? thresholds[productId] : 5;
    document.getElementById("field-zone").value      = zoneAssignments[productId];

    title.textContent     = "Edit Product";
    submitBtn.textContent = "Save Changes";

  } else {
    editingProductId = null;

    // Clear the form for a fresh new product
    document.getElementById("product-form").reset();
    document.getElementById("field-threshold").value = 5;
    document.getElementById("field-zone").value      = "storage";

    title.textContent     = "Add Product";
    submitBtn.textContent = "Add Product";
  }

  overlay.classList.add("open");
  document.getElementById("field-name").focus();
}


// Hides the modal and resets the editing state.
function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
  editingProductId = null;
}


// Handles the form when the user clicks Add or Save.
function handleFormSubmit(event) {
  event.preventDefault();

  var name      = document.getElementById("field-name").value.trim();
  var price     = parseFloat(document.getElementById("field-price").value);
  var qty       = parseInt(document.getElementById("field-qty").value, 10);
  var threshold = parseInt(document.getElementById("field-threshold").value, 10);
  var zone      = document.getElementById("field-zone").value;
  var errorMsg  = document.getElementById("form-error");

  // Validate — all three main fields are required
  if (!name) {
    errorMsg.textContent = "Product name is required.";
    return;
  }
  if (isNaN(price) || price < 0) {
    errorMsg.textContent = "Please enter a valid price.";
    return;
  }
  if (isNaN(qty) || qty < 0) {
    errorMsg.textContent = "Please enter a valid quantity.";
    return;
  }

  errorMsg.textContent = "";

  // Clean up threshold — default to 5 if left blank or invalid
  var cleanThreshold = (isNaN(threshold) || threshold < 0) ? 5 : threshold;

  if (editingProductId !== null) {
    // --- EDIT: update the existing product in D1 ---
    var product = products.find(function(p) { return p.id === editingProductId; });
    product.name     = name;
    product.price    = price;
    product.quantity = qty;

    // Update D2 (zone) and D3 (threshold)
    zoneAssignments[editingProductId] = zone;
    thresholds[editingProductId]      = cleanThreshold;

  } else {
    // --- ADD: create a brand new product ---
    var newId = generateId();

    // Push to D1
    products.push({ id: newId, name: name, price: price, quantity: qty });

    // Record its zone in D2 and threshold in D3
    zoneAssignments[newId] = zone;
    thresholds[newId]      = cleanThreshold;
  }

  saveToStorage();
  renderBoard();
  closeModal();
}


// Called when the user clicks directly on a product card.
// Opens the modal pre-filled with that product's data.
function handleCardClick(event) {
  var productId = Number(event.currentTarget.dataset.productId);
  openModal("edit", productId);
}


// =============================================
// P2 — DRAG-AND-DROP ZONE ASSIGNMENT
// Uses the HTML5 Drag and Drop API.
//
// Flow:
//   1. dragstart  -> record which product is moving
//   2. dragover   -> mark target zone as highlighted
//   3. dragleave  -> un-highlight if cursor left
//   4. drop       -> update D2 and re-render
//   5. dragend    -> clean up
// =============================================

// save yung ID ng item na hinohold.
var draggedProductId = null;

function handleDragStart(event) {
  draggedProductId = event.currentTarget.dataset.productId;
  // Small delay needed here
  setTimeout(function() {
    event.currentTarget.classList.add("dragging");
  }, 0);
}

function handleDragEnd(event) {
  event.currentTarget.classList.remove("dragging");
  draggedProductId = null;
}

function handleDragOver(event) {
  // iiwan yan dyan. dont touch!
  event.preventDefault();
  event.currentTarget.classList.add("drag-over");
}

function handleDragLeave(event) {
  // logic ng drag drop. para hindi mawala agad yung highlight.
  if (!event.currentTarget.contains(event.relatedTarget)) {
    event.currentTarget.classList.remove("drag-over");
  }
}

// Handles dropping a card onto a zone.
function handleDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove("drag-over");

  var targetZone = event.currentTarget.dataset.zone;

  if (!draggedProductId || !targetZone) return;

  var productId   = Number(draggedProductId);
  var currentZone = zoneAssignments[productId];

  // Skip re-render if dropped in the same zone
  if (currentZone === targetZone) return;

  // P2: update D2
  zoneAssignments[productId] = targetZone;

  saveToStorage();
  renderBoard();
}


// =============================================
// P1 — DELETE (drag card to trash)
// =============================================
function handleTrashDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove("drag-over");

  if (!draggedProductId) return;

  var productId = Number(draggedProductId);
  var product   = products.find(function(p) { return p.id === productId; });

  // Ask user to confirm before deleting
  var confirmed = window.confirm('Delete "' + product.name + '"? This cannot be undone.');
  if (!confirmed) return;

  // Remove from D1
  products = products.filter(function(p) { return p.id !== productId; });

  // Remove from D2 and D3
  delete zoneAssignments[productId];
  delete thresholds[productId];

  saveToStorage();
  renderBoard();
}


// =============================================
// P3 — RESTOCK (drag card to restock area)
// Prompts for a restock amount, adds it to the
// product's quantity, and moves it out of
// "out-of-stock" if it was there.
// =============================================
function handleRestockDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove("drag-over");

  if (!draggedProductId) return;

  var productId = Number(draggedProductId);
  var product   = products.find(function(p) { return p.id === productId; });

  // Ask how many units to add
  var input = window.prompt(
    'Restocking "' + product.name + '"\n' +
    'Current quantity: ' + product.quantity + '\n\n' +
    'How many units to add?',
    "20"
  );

  // User cancelled the prompt
  if (input === null) return;

  var amount = parseInt(input, 10);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a number greater than 0.");
    return;
  }

  // Add to D1 quantity
  product.quantity += amount;

  // If restocked from out-of-stock, move it to storage
  if (zoneAssignments[productId] === "out-of-stock") {
    zoneAssignments[productId] = "storage";
  }

  saveToStorage();
  renderBoard();
}


// =============================================
// INITIALIZATION
// Wires up all event listeners and renders the
// board for the first time.
// =============================================
function init() {
  // Zone drop targets
  document.querySelectorAll(".zone-cards").forEach(function(zone) {
    zone.addEventListener("dragover",  handleDragOver);
    zone.addEventListener("dragleave", handleDragLeave);
    zone.addEventListener("drop",      handleDrop);
  });

  // Restock drop target
  var restockArea = document.getElementById("restock-area");
  restockArea.addEventListener("dragover",  handleDragOver);
  restockArea.addEventListener("dragleave", handleDragLeave);
  restockArea.addEventListener("drop",      handleRestockDrop);

  // Trash drop target
  var trashArea = document.getElementById("trash-area");
  trashArea.addEventListener("dragover",  handleDragOver);
  trashArea.addEventListener("dragleave", handleDragLeave);
  trashArea.addEventListener("drop",      handleTrashDrop);

  // Add Product button opens the modal
  document.getElementById("btn-add-product").addEventListener("click", function() {
    openModal("add");
  });

  // Close modal via the X button
  document.getElementById("modal-close").addEventListener("click", closeModal);

  // Close modal by clicking the dark backdrop
  document.getElementById("modal-overlay").addEventListener("click", function(event) {
    if (event.target === this) closeModal();
  });

  // Close modal with the Escape key
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") closeModal();
  });

  // Form submit (handles both add and edit)
  document.getElementById("product-form").addEventListener("submit", handleFormSubmit);

  // Cancel button
  document.getElementById("btn-cancel").addEventListener("click", closeModal);

  // Load saved data then draw the board
  loadFromStorage();
  renderBoard();
}

// Entry point
init();
