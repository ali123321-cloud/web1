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
    // Adds a copy of this menu item to the cart.
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
    // Group entries by item. Each line keeps the index of its LAST entry, so "−" and
    // "Remove" delete the newest copy and the line does not move in the list.
    const groups = [];
    cart.forEach((item, index) => {
      const group = groups.find(group => group.name === item.name && group.price === item.price);
      if (group) {
        group.quantity++;
        group.index = index;
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
  // Round to cents so floating-point sums like 15.000000000000002 count as 15.00.
  const total = Math.round(cart.reduce((sum, item) => sum + item.price, 0) * 100) / 100;
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
  // Only plain decimal prices with up to 2 decimals (e.g. 4, 4.5, 4.50), so 0x10 or 1e3 are rejected.
  if (!/^(\d+(\.\d{1,2})?|\.\d{1,2})$/.test(priceText) || price <= 0) {
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

// Uses one delegated listener on #cart-list to handle the +, − and Remove buttons.
// "Remove" deletes only that one entry (Part B), like "−"; a line disappears when its quantity reaches 0.
cartList.addEventListener("click", event => {
  const button = event.target.closest("button[data-index]");
  if (!button || !cartList.contains(button)) return;
  const index = Number(button.dataset.index);
  const item = cart[index];
  if (!item) return;
  if (button.dataset.action === "plus") {
    cart.push({ ...item });
  } else {
    cart.splice(index, 1);
  }
  renderCart();
});

document.querySelector("#add-custom-btn").addEventListener("click", addCustomItem);
// Empties the cart and re-renders it, which resets the total and count and shows "Your cart is empty.".
document.querySelector("#clear-cart-btn").addEventListener("click", () => {
  cart = [];
  renderCart();
});
renderMenu();
renderCart();

// Own tests for Question 3: open the console (F12) and type runOwnTests().
// They click the real buttons, print PASS/FAIL, then restore the menu, cart and form.
function runOwnTests() {
  const savedMenu = [...menu];
  const savedCart = [...cart];
  const savedForm = [nameInput.value, priceInput.value, errorMsg.textContent];
  // Picks a custom item name that is not on the menu yet ("Tea", "Tea 2", ...).
  let newName = "Tea";
  for (let n = 2; menu.some(item => item.name.toLowerCase() === newName.toLowerCase()); n++) newName = `Tea ${n}`;
  // Finds the "Add" button of a menu item by its name.
  const addButton = name => [...menuList.querySelectorAll("li")]
    .find(li => li.textContent.startsWith(`${name} —`)).querySelector("button");
  // Returns the text of every cart line, e.g. "Latte ×2 — $9.00".
  const lineTexts = () => [...cartList.querySelectorAll("li > span:first-child")].map(span => span.textContent);
  // Prints one test result.
  const check = (label, passed) => console.log(`${passed ? "PASS" : "FAIL"} - ${label}`);

  cart = [];
  renderCart();
  addButton("Latte").click();
  addButton("Latte").click();
  cartList.querySelector('[data-action="remove"]').click();
  check("Remove deletes only one of two Lattes", cart.length === 1 && cartCount.textContent === "1");

  cart = [];
  ["Latte", "Mocha", "Latte"].forEach(name => addButton(name).click());
  cartList.querySelector('[data-action="minus"]').click();
  check("− on Latte keeps the line order", lineTexts().join(" | ") === "Latte ×1 — $4.50 | Mocha ×1 — $5.00");

  cart = [];
  ["Mocha", "Mocha", "Mocha"].forEach(name => addButton(name).click());
  check("$15.00 exactly is not red and has no reward", cartTotal.style.color === "" && rewardMsg.classList.contains("hidden"));
  addButton("Muffin").click();
  check("$17.50 is red and shows the reward", cartTotal.style.color === "red" && !rewardMsg.classList.contains("hidden"));

  nameInput.value = "  LATTE ";
  priceInput.value = "3";
  addCustomItem();
  check("Duplicate name ignoring case is rejected", errorMsg.textContent === "This item is already on the menu." && menu.length === savedMenu.length);
  nameInput.value = newName;
  priceInput.value = "-2";
  addCustomItem();
  check("Negative price is rejected", errorMsg.textContent === "Price must be a positive number.");
  priceInput.value = "2.75";
  addCustomItem();
  addButton(newName).click();
  check("A valid custom item is added and can go in the cart", errorMsg.textContent === "" && cart[cart.length - 1].name === newName);

  menu.splice(0, menu.length, ...savedMenu);
  cart = savedCart;
  [nameInput.value, priceInput.value, errorMsg.textContent] = savedForm;
  renderMenu();
  renderCart();
}
