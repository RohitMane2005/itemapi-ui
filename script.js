const BASE_URL = "https://itemapi-springboot-production.up.railway.app";

function clearMessages() {
  document.querySelectorAll(".error").forEach(e => e.textContent = "");
  document.querySelectorAll(".badge").forEach(b => b.style.display = "none");
}

async function addItem() {
  clearMessages();

  const name = document.getElementById("name").value.trim();
  const desc = document.getElementById("description").value.trim();
  const price = document.getElementById("price").value;
  const qty = document.getElementById("quantity").value;

  let valid = true;

  if (!name) { document.getElementById("nameError").textContent = "Name required"; valid = false; }
  if (!desc) { document.getElementById("descError").textContent = "Description required"; valid = false; }
  if (price <= 0) { document.getElementById("priceError").textContent = "Price must be > 0"; valid = false; }
  if (qty < 0) { document.getElementById("qtyError").textContent = "Quantity cannot be negative"; valid = false; }

  if (!valid) return;

  document.getElementById("addSpinner").style.display = "block";

  try {
    const res = await fetch(`${BASE_URL}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: desc, price: Number(price), quantity: Number(qty) })
    });

    const data = await res.json();
    document.getElementById("addSuccess").textContent = "Item added successfully!";
    document.getElementById("addSuccess").style.display = "block";
  } catch {
    document.getElementById("addFail").textContent = "Failed to add item";
    document.getElementById("addFail").style.display = "block";
  } finally {
    document.getElementById("addSpinner").style.display = "none";
  }
}

async function getItem() {
  clearMessages();

  const id = document.getElementById("itemId").value;
  if (!id) {
    document.getElementById("idError").textContent = "Item ID required";
    return;
  }

  document.getElementById("getSpinner").style.display = "block";

  try {
    const res = await fetch(`${BASE_URL}/api/items/${id}`);
    if (!res.ok) throw new Error();

    const data = await res.json();
    document.getElementById("getResult").textContent =
      JSON.stringify(data, null, 2);
  } catch {
    document.getElementById("getFail").textContent = "Item not found";
    document.getElementById("getFail").style.display = "block";
  } finally {
    document.getElementById("getSpinner").style.display = "none";
  }
}
