const tripKey = "vakantie-thijn-trip";
const packingKey = "vakantie-thijn-packing";
const budgetKey = "vakantie-thijn-budget";

const destinationInput = document.querySelector("#destinationInput");
const dateInput = document.querySelector("#dateInput");
const saveTripButton = document.querySelector("#saveTripButton");
const tripSummary = document.querySelector("#tripSummary");

const packingInput = document.querySelector("#packingInput");
const addPackingButton = document.querySelector("#addPackingButton");
const packingList = document.querySelector("#packingList");

const budgetInput = document.querySelector("#budgetInput");
const spentInput = document.querySelector("#spentInput");
const saveBudgetButton = document.querySelector("#saveBudgetButton");
const budgetSummary = document.querySelector("#budgetSummary");

function readJson(key, fallback) {
  const raw = localStorage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "nog geen datum";
  }

  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));
}

function renderTrip() {
  const trip = readJson(tripKey, null);

  if (!trip) {
    tripSummary.textContent = "Nog geen trip opgeslagen.";
    return;
  }

  tripSummary.innerHTML =
    "<strong>" +
    trip.destination +
    "</strong><br />Vertrek: " +
    formatDate(trip.date);
}

function renderPacking() {
  const items = readJson(packingKey, []);

  if (!items.length) {
    packingList.innerHTML = "<li>Je lijst is nog leeg.</li>";
    return;
  }

  packingList.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = item.done ? "done" : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.addEventListener("change", () => togglePackingItem(item.id));

    const label = document.createElement("span");
    label.className = "packing-label";
    label.textContent = item.label;

    const removeButton = document.createElement("button");
    removeButton.className = "ghost-button";
    removeButton.textContent = "Verwijder";
    removeButton.addEventListener("click", () => removePackingItem(item.id));

    li.append(checkbox, label, removeButton);
    packingList.append(li);
  });
}

function renderBudget() {
  const budget = readJson(budgetKey, null);

  if (!budget) {
    budgetSummary.textContent = "Vul je budget in om inzicht te krijgen.";
    return;
  }

  const remaining = budget.total - budget.spent;
  const statusText =
    remaining >= 0
      ? "Je hebt nog euro " + remaining + " over."
      : "Je zit euro " + Math.abs(remaining) + " boven budget.";

  budgetSummary.innerHTML =
    "<strong>Totaal:</strong> euro " +
    budget.total +
    "<br /><strong>Geschat:</strong> euro " +
    budget.spent +
    "<br />" +
    statusText;
}

function saveTrip() {
  const destination = destinationInput.value.trim();

  if (!destination) {
    tripSummary.textContent = "Vul eerst een bestemming in.";
    return;
  }

  writeJson(tripKey, {
    destination,
    date: dateInput.value,
  });

  renderTrip();
}

function addPackingItem() {
  const label = packingInput.value.trim();

  if (!label) {
    return;
  }

  const items = readJson(packingKey, []);
  items.push({
    id: crypto.randomUUID(),
    label,
    done: false,
  });
  writeJson(packingKey, items);
  packingInput.value = "";
  renderPacking();
}

function togglePackingItem(id) {
  const items = readJson(packingKey, []).map((item) =>
    item.id === id ? { ...item, done: !item.done } : item,
  );
  writeJson(packingKey, items);
  renderPacking();
}

function removePackingItem(id) {
  const items = readJson(packingKey, []).filter((item) => item.id !== id);
  writeJson(packingKey, items);
  renderPacking();
}

function saveBudget() {
  const total = Number(budgetInput.value);
  const spent = Number(spentInput.value);

  if (Number.isNaN(total) || Number.isNaN(spent)) {
    budgetSummary.textContent = "Vul beide bedragen in.";
    return;
  }

  writeJson(budgetKey, { total, spent });
  renderBudget();
}

saveTripButton.addEventListener("click", saveTrip);
addPackingButton.addEventListener("click", addPackingItem);
saveBudgetButton.addEventListener("click", saveBudget);
packingInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addPackingItem();
  }
});

renderTrip();
renderPacking();
renderBudget();
