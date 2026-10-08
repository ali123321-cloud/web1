// Calculates the final coffee order price after applicable discounts.
function calculatePrice(size, quantity, isMember, hour) {
  if (!["small", "medium", "large"].includes(size)) return "Invalid size";
  if (!Number.isInteger(quantity) || quantity <= 0) return "Invalid quantity";
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return "Invalid hour";

  let pricePerCup;
  switch (size) {
    case "small": pricePerCup = 2.5; break;
    case "medium": pricePerCup = 3.5; break;
    case "large": pricePerCup = 4.5; break;
  }

  let total = pricePerCup * quantity;
  if (quantity >= 5) total *= 0.9;
  if (isMember === true) total *= 0.95;
  if (hour >= 15 && hour <= 17) total -= 1;
  return Math.round(Math.max(0, total) * 100) / 100;
}

// Prints the price of ordering each quantity from 1 to 10 cups.
function printPriceTable(size, isMember, hour) {
  for (let quantity = 1; quantity <= 10; quantity++) {
    const price = calculatePrice(size, quantity, isMember, hour);
    console.log(`Qty ${quantity} -> ${typeof price === "number" ? `$${price.toFixed(2)}` : price}`);
  }
}

// Finds the earliest hour with the lowest valid order price.
function cheapestHour(size, quantity, isMember) {
  let bestHour = 0;
  let lowestPrice = calculatePrice(size, quantity, isMember, 0);
  if (typeof lowestPrice !== "number") return lowestPrice;
  for (let hour = 1; hour < 24; hour++) {
    const price = calculatePrice(size, quantity, isMember, hour);
    if (price < lowestPrice) {
      lowestPrice = price;
      bestHour = hour;
    }
  }
  return bestHour;
}

console.log("Q1 Part A: Provided tests");
const tests = [
  ["large", 2, false, 10],
  ["medium", 5, true, 16],
  ["small", 4, true, 9],
  ["small", 1, false, 15],
  ["xl", 1, false, 9],
  ["large", 0, false, 9],
  ["large", 2.5, true, 9],
  ["medium", 2, true, 25],
  ["small", 1, true, 17], // Additional test 1
  ["medium", 1, false, -1] // Additional test 2
];
tests.forEach(args => console.log(`calculatePrice(${args.map(x => JSON.stringify(x)).join(", ")}):`, calculatePrice(...args)));
console.log("Q1 Part B: Price table");
printPriceTable("medium", false, 16);
console.log("Q1 Part C: Best deal");
const size = "large", quantity = 3, isMember = false;
const hour = cheapestHour(size, quantity, isMember);
console.log(`The best time to order ${quantity} ${size} coffees is at ${String(hour).padStart(2, "0")}:00 for $${calculatePrice(size, quantity, isMember, hour).toFixed(2)}.`);
console.log("Additional best-hour test:", cheapestHour("small", 1, true));
