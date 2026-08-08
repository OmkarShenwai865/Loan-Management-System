const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Builds a daily count series for the last `days` days (oldest -> newest),
 * filling in zero for days with no leads, from real lead.created_at values.
 */
export function computeDailyCounts(leads, days = 30, referenceDate = new Date()) {
  const today = startOfDay(referenceDate);
  const counts = new Map();

  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today.getTime() - i * DAY_MS);
    const key = d.toISOString().slice(0, 10);
    counts.set(key, 0);
  }

  leads.forEach((lead) => {
    const key = startOfDay(new Date(lead.created_at)).toISOString().slice(0, 10);
    if (counts.has(key)) {
      counts.set(key, counts.get(key) + 1);
    }
  });

  return Array.from(counts.entries()).map(([key, count]) => {
    const d = new Date(key);
    return {
      date: key,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count,
    };
  });
}

/**
 * Compares lead volume in the last `windowDays` vs the `windowDays` before that,
 * using real created_at timestamps (bounded by however many leads were fetched).
 */
export function computeWindowTotals(leads, windowDays = 30, referenceDate = new Date()) {
  const today = startOfDay(referenceDate).getTime();
  const currentStart = today - windowDays * DAY_MS;
  const previousStart = today - 2 * windowDays * DAY_MS;

  let current = 0;
  let previous = 0;

  leads.forEach((lead) => {
    const t = startOfDay(new Date(lead.created_at)).getTime();
    if (t >= currentStart && t <= today) current += 1;
    else if (t >= previousStart && t < currentStart) previous += 1;
  });

  return { current, previous };
}

/**
 * Returns a trend descriptor, or null when there's no prior-period baseline
 * to compare against (graceful empty state instead of a fake percentage).
 */
export function computeTrend(current, previous, { moreIsGood = true, label = "vs last month" } = {}) {
  if (!previous) return null;

  const pctChange = ((current - previous) / previous) * 100;
  const direction = pctChange >= 0 ? "up" : "down";
  const isGoodDirection = direction === "up" ? moreIsGood : !moreIsGood;

  return {
    direction,
    tone: pctChange === 0 ? "neutral" : isGoodDirection ? "positive" : "negative",
    text: `${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(0)}% ${label}`,
  };
}

/**
 * Average credit_score for leads created in the current vs previous
 * `windowDays`-day window (null scores ignored). Returns nulls when a
 * window has no scored leads, so callers can fall back gracefully.
 */
export function computeWindowAverageScore(leads, windowDays = 30, referenceDate = new Date()) {
  const today = startOfDay(referenceDate).getTime();
  const currentStart = today - windowDays * DAY_MS;
  const previousStart = today - 2 * windowDays * DAY_MS;

  const currentScores = [];
  const previousScores = [];

  leads.forEach((lead) => {
    if (lead.credit_score === null || lead.credit_score === undefined) return;
    const t = startOfDay(new Date(lead.created_at)).getTime();
    if (t >= currentStart && t <= today) currentScores.push(lead.credit_score);
    else if (t >= previousStart && t < currentStart) previousScores.push(lead.credit_score);
  });

  const avg = (arr) => (arr.length ? arr.reduce((sum, v) => sum + v, 0) / arr.length : null);

  return { current: avg(currentScores), previous: avg(previousScores) };
}
