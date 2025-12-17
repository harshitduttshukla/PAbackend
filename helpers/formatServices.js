export function formatServices(services) {
  if (!services) return "";

  if (typeof services === "string") {
    services = JSON.parse(services);
  }

  const labelMap = {
    wifi: "Wi-fi",
    vegLunch: "Veg Lunch",
    vegDinner: "Veg Dinner",
    nonVegLunch: "Non-Veg Lunch",
    nonVegDinner: "Non-Veg Dinner",
    morningBreakfast: "Morning Breakfast",
  };

  return Object.entries(services)
    .filter(([_, value]) => value)
    .map(([key]) => labelMap[key] || key)
    .join(", ");
}
