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
  let lowestPrice = Infinity;
  for (let hour = 0; hour <= 23; hour++) {
    const price = calculatePrice(size, quantity, isMember, hour);
    if (typeof price !== "number") return price;
    if (price < lowestPrice) {
      lowestPrice = price;
      bestHour = hour;
    }
  }
  return bestHour;
}

console.log("Q1 Part A: Provided tests and own tests");
// Each test is [arguments, expected result].
const tests = [
  [["large", 2, false, 10], 9],
  [["medium", 5, true, 16], 13.96],
  [["small", 4, true, 9], 9.5],
  [["small", 1, false, 15], 1.5],
  [["xl", 1, false, 9], "Invalid size"],
  [["large", 0, false, 9], "Invalid quantity"],
  [["large", 2.5, true, 9], "Invalid quantity"],
  [["medium", 2, true, 25], "Invalid hour"],
  [["small", 1, true, 17], 1.38], // Own test 1: member discount + happy hour at 17:00
  [["medium", 1, false, -1], "Invalid hour"], // Own test 2: negative hour
  [["large", "2", false, 9], "Invalid quantity"] // Own test 3: quantity given as a string
];
// Prints each call, its result and whether it matches the expected value.
tests.forEach(([args, expected]) => {
  const result = calculatePrice(...args);
  const status = result === expected ? "PASS" : `FAIL (expected ${JSON.stringify(expected)})`;
  console.log(`calculatePrice(${args.map(x => JSON.stringify(x)).join(", ")}):`, result, status);
});
console.log("Q1 Part B: Price table");
printPriceTable("medium", false, 16);
console.log("Q1 Part C: Best deal");
const size = "large", quantity = 3, isMember = false;
const bestHour = cheapestHour(size, quantity, isMember);
if (typeof bestHour === "number") {
  console.log(`The best time to order ${quantity} ${size} coffees is at ${String(bestHour).padStart(2, "0")}:00 for $${calculatePrice(size, quantity, isMember, bestHour).toFixed(2)}.`);
} else {
  console.log("Best deal:", bestHour);
}
console.log("Own test - cheapestHour(\"small\", 1, true):", cheapestHour("small", 1, true)); // Expected 15
console.log("Own test - cheapestHour(\"xl\", 1, false):", cheapestHour("xl", 1, false)); // Expected "Invalid size"
