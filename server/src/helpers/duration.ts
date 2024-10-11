export const getDuration = (start: number) => Math.round(performance.now() - start);

export const formatDuration = (ms: number): string => {
  if (ms < 1_000) {
    return `${ms.toFixed(0)}ms`;
  }
  if (ms < 60_000) {
    return `${(ms / 1_000).toFixed(3)}s`;
  }

  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = ((ms % 60_000) / 1_000).toFixed(3);

  if (hours === 0) {
    if (minutes === 0) {
      return `${seconds}s`;
    }

    return `${minutes}m${seconds}s`;
  }

  return `${hours}h${minutes}m${seconds}s`;
};
