const menu = [
  { name: "Espresso", price: 3.0 },
  { name: "Latte", price: 4.5 },
  { name: "Mocha", price: 5.0 },
  { name: "Muffin", price: 2.5 },
];
let cart = [];

const menuList = document.querySelector("#menu-list");
const cartList = document.querySelector("#cart-list");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");
const rewardMsg = document.querySelector("#reward-msg");
const nameInput = document.querySelector("#item-name");
const priceInput = document.querySelector("#item-price");
const errorMsg = document.querySelector("#error-msg");

// Creates the menu entries and their Add buttons using DOM methods.
function renderMenu() {
  menuList.replaceChildren();
  menu.forEach((item, index) => {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = `${item.name} — $${item.price.toFixed(2)}`;
    const button = document.createElement("button");
    button.textContent = "Add";
    button.className = "add-btn";
    button.addEventListener("click", () => {
      cart.push({ ...menu[index] });
      renderCart();
    });
    li.append(label, button);
    menuList.appendChild(li);
  });
}

// Displays cart entries as quantities, with +, − and Remove controls.
function renderCart() {
  cartList.replaceChildren();
  cartCount.textContent = String(cart.length);
  if (cart.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Your cart is empty.";
    cartList.appendChild(empty);
  } else {
    const groups = [];
    cart.forEach((item, index) => {
      const group = groups.find(group => group.name === item.name && group.price === item.price);
      if (group) {
        group.quantity++;
      } else {
        groups.push({ name: item.name, price: item.price, quantity: 1, index });
      }
    });
    groups.forEach(group => {
      const li = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = `${group.name} ×${group.quantity} — $${(group.price * group.quantity).toFixed(2)}`;
      const actions = document.createElement("span");
      actions.className = "item-actions";
      for (const [action, title] of [["plus", "+"], ["minus", "−"], ["remove", "Remove"]]) {
        const button = document.createElement("button");
        button.textContent = title;
        button.className = action === "remove" ? "remove-btn" : "qty-btn";
        button.dataset.action = action;
        button.dataset.index = String(group.index);
        actions.appendChild(button);
      }
      li.append(label, actions);
      cartList.appendChild(li);
    });
  }
  updateTotal();
}

// Calculates the total and toggles the free-cookie reward above $15.
function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = total.toFixed(2);
  cartTotal.style.color = total > 15 ? "red" : "";
  rewardMsg.classList.toggle("hidden", total <= 15);
}

// Validates a custom item and adds it to the menu when valid.
function addCustomItem() {
  const name = nameInput.value.trim();
  const priceText = priceInput.value.trim();
  const price = Number(priceText);
  errorMsg.textContent = "";
  if (name === "") {
    errorMsg.textContent = "Name is required.";
    return;
  }
  if (priceText === "" || !Number.isFinite(price) || price <= 0) {
    errorMsg.textContent = "Price must be a positive number.";
    return;
  }
  if (menu.some(item => item.name.toLowerCase() === name.toLowerCase())) {
    errorMsg.textContent = "This item is already on the menu.";
    return;
  }
  menu.push({ name, price });
  renderMenu();
  nameInput.value = "";
  priceInput.value = "";
  errorMsg.textContent = "";
}

// Uses one delegated listener to update or remove individual cart entries.
cartList.addEventListener("click", event => {
  const button = event.target.closest("button[data-index]");
  if (!button || !cartList.contains(button)) return;
  const index = Number(button.dataset.index);
  const item = cart[index];
  if (!item) return;
  if (button.dataset.action === "plus") {
    cart.push({ ...item });
  } else if (button.dataset.action === "minus") {
    cart.splice(index, 1);
  } else if (button.dataset.action === "remove") {
    cart.splice(index, 1);
  }
  renderCart();
});

document.querySelector("#add-custom-btn").addEventListener("click", addCustomItem);
document.querySelector("#clear-cart-btn").addEventListener("click", () => {
  cart = [];
  renderCart();
});
renderMenu();
renderCart();
