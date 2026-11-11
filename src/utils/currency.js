export function formatPeso(cents) {
  return `₱${(Number(cents || 0) / 100).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
