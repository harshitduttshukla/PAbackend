export function formatDateExact(isoString) {
  if (!isoString) return "--";

  const date = new Date(isoString);
  if (isNaN(date)) return "--";

  const day = String(date.getDate()).padStart(2, "0");
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${day} ${month}, ${year} ${hours}:${minutes} ${ampm}`;
}
