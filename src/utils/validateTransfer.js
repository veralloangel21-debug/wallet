export function validateTransfer(recipient, amount, availableBalance) {
  if (recipient.trim().length < 3) {
    return "Enter a valid recipient username or wallet ID.";
  }

  const value = amount.trim();

  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    return "Enter a valid amount with up to 2 decimal places.";
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return "Amount must be greater than zero.";
  }

  if (number > availableBalance) {
    return "Insufficient demo wallet balance.";
  }

  return null;
}
