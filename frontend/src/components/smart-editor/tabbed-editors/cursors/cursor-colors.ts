enum ColorKey {
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  ORANGE = 'orange',
  PURPLE = 'purple',
}

const RED_COLOR_CLASS = 'bg-ax-bg-danger-strong';
const RED_BACKGROUND_CLASS = 'bg-ax-bg-danger-moderate-a';

const GREEN_COLOR_CLASS = 'bg-ax-bg-success-strong';
const GREEN_BACKGROUND_CLASS = 'bg-ax-bg-success-moderate-a';

const BLUE_COLOR_CLASS = 'bg-ax-bg-info-strong';
const BLUE_BACKGROUND_CLASS = 'bg-ax-bg-info-moderate-a';

const ORANGE_COLOR_CLASS = 'bg-ax-bg-warning-strong';
const ORANGE_BACKGROUND_CLASS = 'bg-ax-bg-warning-moderate-a';

const PURPLE_COLOR_CLASS = 'bg-ax-bg-info-strong';
const PURPLE_BACKGROUND_CLASS = 'bg-ax-bg-info-moderate-a';

type ColorSet = [string, string];

const COLOR_MAP: Record<ColorKey, ColorSet> = {
  [ColorKey.RED]: [RED_BACKGROUND_CLASS, RED_COLOR_CLASS],
  [ColorKey.GREEN]: [GREEN_BACKGROUND_CLASS, GREEN_COLOR_CLASS],
  [ColorKey.BLUE]: [BLUE_BACKGROUND_CLASS, BLUE_COLOR_CLASS],
  [ColorKey.ORANGE]: [ORANGE_BACKGROUND_CLASS, ORANGE_COLOR_CLASS],
  [ColorKey.PURPLE]: [PURPLE_BACKGROUND_CLASS, PURPLE_COLOR_CLASS],
};

const COLOR_KEYS = Object.values(ColorKey);

const MAP: Map<string, ColorKey> = new Map();

interface Colors {
  caretBackgroundColorClass: string;
  selectionBackgroundColorClass: string;
}

export const getColorClasses = (key: string): Colors => {
  const colorKey = getColorKey(key);

  const [selectionBackgroundColorClass, caretBackgroundColorClass] = COLOR_MAP[colorKey];

  return { selectionBackgroundColorClass, caretBackgroundColorClass };
};

const getColorKey = (key: string): ColorKey => {
  const existing = MAP.get(key);

  if (existing !== undefined) {
    return existing;
  }

  const availableColors = getAvailableColors();

  const randomColorIndex = Math.floor(Math.random() * availableColors.length);
  // biome-ignore lint/style/noNonNullAssertion: Index is guaranteed to be in bounds.
  const colorKey = availableColors[randomColorIndex]!;

  MAP.set(key, colorKey);

  return colorKey;
};

const getAvailableColors = (): ColorKey[] => {
  const availableColors = COLOR_KEYS.filter((colorKey) => MAP.values().every((k) => k !== colorKey));

  if (availableColors.length === 0) {
    return COLOR_KEYS;
  }

  return availableColors;
};
