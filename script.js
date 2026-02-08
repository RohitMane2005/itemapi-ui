const BASE_URL = "https://itemapi-springboot-production.up.railway.app";

/* ---------- Utility ---------- */
function clearMessages() {
  document.querySelectorAll(".error").forEach(e => e.textContent = "");
  document.querySelectorAll(".badge").forEach(b => b.style.display = "none");
  document.getElementById("getResult").textContent = "";
}

/* ---------- ADD ITEM ---------- */
async function addItem() {
  clearMessages();

  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = document.getElementById("price").value;
  const quantity = document.getElementById("quantity").value;

  let valid = true;

  if (!name) {
    document.getElementById("nameError").textContent = "Name is required";
    valid = false;
  }
  if (!description) {
    document.getElementById("descError").textContent = "Description is required";
    valid = false;
  }
  if (price === "" || Number(price) <= 0) {
    document.getElementById("priceError").textContent = "Price must be greater than 0";
    valid = false;
  }
  if (quantity === "" || Number(quantity) < 0) {
    document.getElementById("qtyError").textContent = "Quantity cannot be negative";
    valid = false;
  }

  if (!valid) return;

  document.getElementById("addSpinner").style.display = "block";

  try {
    const res = await fetch(`${BASE_URL}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        description: description,
        price: Number(price),
        quantity: Number(quantity)
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to add item");
    }

    const data = await res.json();

    document.getElementById("addSuccess").textContent =
      `Item added successfully! (ID: ${data.id})`;
    document.getElementById("addSuccess").style.display = "block";

    // Optional: clear form after success
    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "";

  } catch (err) {
    console.error("Add Item Error:", err);
    document.getElementById("addFail").textContent =
      "Failed to add item. Please try again.";
    document.getElementById("addFail").style.display = "block";
  } finally {
    document.getElementById("addSpinner").style.display = "none";
  }
}

/* ---------- GET ITEM ---------- */
async function getItem() {
  clearMessages();

  const id = document.getElementById("itemId").value;

  if (!id) {
    document.getElementById("idError").textContent = "Item ID is required";
    return;
  }

  document.getElementById("getSpinner").style.display = "block";

  try {
    const res = await fetch(`${BASE_URL}/api/items/${id}`);

    if (!res.ok) {
      throw new Error("Item not found");
    }

    const data = await res.json();
    document.getElementById("getResult").textContent =
      JSON.stringify(data, null, 2);

  } catch (err) {
    console.error("Get Item Error:", err);
    document.getElementById("getFail").textContent = "Item not found";
    document.getElementById("getFail").style.display = "block";
  } finally {
    document.getElementById("getSpinner").style.display = "none";
  }
}
