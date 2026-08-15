interface MetricEntry {
  count: number;
  totalMs: number;
  errors: number;
  lastUpdated: number;
}

const metrics = new Map<string, MetricEntry>();

export const recordMetric = (
  name: string,
  durationMs: number,
  isError = false
): void => {
  const existing = metrics.get(name) ?? {
    count: 0,
    totalMs: 0,
    errors: 0,
    lastUpdated: Date.now(),
  };
  existing.count += 1;
  existing.totalMs += durationMs;
  if (isError) existing.errors += 1;
  existing.lastUpdated = Date.now();
  metrics.set(name, existing);
};

export const getMetrics = (): Record<
  string,
  { count: number; avgMs: number; errors: number; errorRate: number }
> => {
  const result: Record<
    string,
    { count: number; avgMs: number; errors: number; errorRate: number }
  > = {};

  for (const [name, entry] of metrics.entries()) {
    result[name] = {
      count: entry.count,
      avgMs: entry.count > 0 ? Math.round(entry.totalMs / entry.count) : 0,
      errors: entry.errors,
      errorRate: entry.count > 0 ? entry.errors / entry.count : 0,
    };
  }

  return result;
};

export const resetMetrics = (): void => {
  metrics.clear();
};

export const metricsMiddleware = (routeName: string) => {
  const start = Date.now();
  return (isError = false): void => {
    recordMetric(routeName, Date.now() - start, isError);
  };
};
