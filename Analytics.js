const orders = [
  { id: 1, customer: "Rami", items: ["latte", "croissant"], total: 7.5 },
  { id: 2, customer: "Lea", items: ["espresso"], total: 3.0 },
  { id: 3, customer: "Rami", items: ["latte", "muffin"], total: 8.0 },
  { id: 4, customer: "Karim", items: ["mocha", "croissant"], total: 9.0 },
  { id: 5, customer: "Lea", items: ["latte"], total: 4.5 },
  { id: 6, customer: "Nour", items: ["espresso", "latte", "muffin"], total: 10.5 },
];
const mondayCustomers = ["Rami", "Lea", "Karim", "Nour"];
const tuesdayCustomers = ["Lea", "Nour", "Tony", "Rami", "Lea"];

// Adds all order totals to calculate revenue.
function getTotalRevenue(orders) {
  return orders.reduce((sum, order) => sum + order.total, 0);
}

// Returns orders whose total meets the minimum amount.
function getBigOrders(orders, min) {
  return orders.filter(order => order.total >= min);
}

// Creates readable descriptions of all orders.
function getOrderSummaries(orders) {
  return orders.map(order => `#${order.id} ${order.customer} - ${order.items.length} item(s) - $${order.total.toFixed(2)}`);
}

// Sorts a copy of the orders from most expensive to least expensive.
function getSortedByTotal(orders) {
  return [...orders].sort((a, b) => b.total - a.total);
}

// Returns the ids of orders containing a requested item.
function findOrdersByItem(orders, item) {
  return orders.filter(order => order.items.includes(item)).map(order => order.id);
}

// Counts the total occurrences of each menu item.
function countItems(orders) {
  return orders.reduce((counts, order) => {
    order.items.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return counts;
  }, {});
}

// Finds the most frequently ordered item.
function getMostPopularItem(orders) {
  const counts = countItems(orders);
  return Object.keys(counts).reduce((best, item) =>
    best === null || counts[item] > counts[best] ? item : best, null);
}

// Groups the total amount spent by customer name.
function getSpendingPerCustomer(orders) {
  return orders.reduce((spending, order) => {
    spending[order.customer] = (spending[order.customer] || 0) + order.total;
    return spending;
  }, {});
}

// Lists each customer once in first-appearance order.
function getUniqueCustomers(orders) {
  return [...new Set(orders.map(order => order.customer))];
}

// Lists all distinct items using flatMap and Set.
function getAllItems(orders) {
  return [...new Set(orders.flatMap(order => order.items))];
}

// Returns the names appearing in both sets.
function bothDays(setA, setB) {
  return [...setA].filter(customer => setB.has(customer));
}

// Returns the names appearing only in the first set.
function onlyFirstDay(setA, setB) {
  return [...setA].filter(customer => !setB.has(customer));
}

// Returns every name in either set without duplicates.
function allCustomers(setA, setB) {
  return [...new Set([...setA, ...setB])];
}

const mondaySet = new Set(mondayCustomers);
const tuesdaySet = new Set(tuesdayCustomers);
console.log("Total revenue:", getTotalRevenue(orders));
console.log("Big orders (minimum $8):", getBigOrders(orders, 8));
console.log("Order summaries:", getOrderSummaries(orders));
console.log("Sorted orders:", getSortedByTotal(orders));
console.log("Orders containing muffin:", findOrdersByItem(orders, "muffin"));
console.log("Item counts:", countItems(orders));
console.log("Most popular item:", getMostPopularItem(orders));
console.log("Spending per customer:", getSpendingPerCustomer(orders));
console.log("Unique customers:", getUniqueCustomers(orders));
console.log("All distinct items:", getAllItems(orders));
console.log("Customers on both days:", bothDays(mondaySet, tuesdaySet));
console.log("Customers only on Monday:", onlyFirstDay(mondaySet, tuesdaySet));
console.log("Customers on either day:", allCustomers(mondaySet, tuesdaySet));
// tuesdayCustomers has 5 entries, but "Lea" appears twice. A Set only stores unique values,
// so the duplicate "Lea" is kept once and the size is 4, not 5.
console.log("Distinct Tuesday customers:", tuesdaySet.size);
// Additional tests for Question 2.
console.log("Extra test - no orders revenue:", getTotalRevenue([]));
console.log("Extra test - missing item:", findOrdersByItem(orders, "tea"));
console.log("Extra test - original order preserved:", orders.map(order => order.id));
