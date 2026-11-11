import { formatPeso } from "./currency";

function dateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function getSpendingSummary(transactions = [], today = new Date()) {
  const year = today.getFullYear();
  const month = today.getMonth();

  const previousMonth = new Date(year, month - 1, 1);
  const previousMonthDays = new Date(year, month, 0).getDate();

  const previousDayLimit = Math.min(today.getDate(), previousMonthDays);

  // CREATE SEVEN DAYS FOR THE CHART
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(year, month, today.getDate() - (6 - index));

    return {
      key: dateKey(date),
      label: date.toLocaleDateString("en-PH", {
        weekday: "short",
      }),
      amountCents: 0,
    };
  });

  const dailyTotals = new Map(days.map((day) => [day.key, 0]));

  let currentCents = 0;
  let previousCents = 0;

  for (const item of transactions) {
    // ONLY OUTGOING TRANSACTIONS COUNT
    if (item.type !== "expense") continue;

    const cents = Number(item.amountCents);
    const date = new Date(item.createdAt);

    if (
      !Number.isSafeInteger(cents) ||
      cents <= 0 ||
      Number.isNaN(date.getTime()) ||
      date.getTime() > today.getTime()
    ) {
      continue;
    }

    // CURRENT MONTH
    if (date.getFullYear() === year && date.getMonth() === month) {
      currentCents += cents;
    }

    // SAME PERIOD OF THE PREVIOUS MONTH
    if (
      date.getFullYear() === previousMonth.getFullYear() &&
      date.getMonth() === previousMonth.getMonth() &&
      date.getDate() <= previousDayLimit
    ) {
      previousCents += cents;
    }

    // LAST SEVEN DAYS
    const key = dateKey(date);

    if (dailyTotals.has(key)) {
      dailyTotals.set(key, dailyTotals.get(key) + cents);
    }
  }

  const maxDaily = Math.max(0, ...dailyTotals.values());

  const lastSevenDays = days.map((day) => {
    const amountCents = dailyTotals.get(day.key);

    return {
      ...day,
      amountCents,
      height:
        maxDaily === 0
          ? 3
          : Math.max(3, Math.round((amountCents / maxDaily) * 65)),
    };
  });

  // MONTHLY COMPARISON
  let comparison = "No spending recorded yet";
  let trend = "neutral";

  if (previousCents === 0 && currentCents > 0) {
    comparison = "No spending in the previous period";
  } else if (previousCents > 0) {
    const change = Math.round(
      (Math.abs(currentCents - previousCents) / previousCents) * 100,
    );

    if (currentCents < previousCents) {
      comparison = `${change}% less than the previous period`;
      trend = "down";
    } else if (currentCents > previousCents) {
      comparison = `${change}% more than the previous period`;
      trend = "up";
    } else {
      comparison = "Same as the previous period";
    }
  }

  return {
    amountCents: currentCents,
    formatted: formatPeso(currentCents),
    comparison,
    trend,
    lastSevenDays,
  };
}
