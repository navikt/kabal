export const BYTES_PER_KB = 1_024;

const UNITS = ['KiB', 'MiB', 'GiB', 'TiB'];

export const formatFileSize = (size: number) => {
  if (size < 0) {
    throw new Error('Size cannot be negative');
  }

  if (size < BYTES_PER_KB) {
    return `${size} byte`;
  }

  for (let i = 0; i < UNITS.length; i++) {
    const unit = UNITS[i];
    const limit = BYTES_PER_KB ** (i + 2);

    if (size < limit) {
      return `${(size / BYTES_PER_KB ** (i + 1)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} ${unit}`;
    }
  }
};
