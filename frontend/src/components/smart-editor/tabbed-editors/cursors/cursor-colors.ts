interface BaseColor {
  red: number;
  green: number;
  blue: number;
}

const MAP: Map<string, BaseColor> = new Map();

// #C30000
const RED: BaseColor = { red: 195, green: 0, blue: 0 };
// #06893A
const GREEN: BaseColor = { red: 6, green: 137, blue: 58 };
// #0067C5
const BLUE: BaseColor = { red: 0, green: 103, blue: 197 };
// #FF9100
const ORANGE: BaseColor = { red: 255, green: 145, blue: 0 };
// #634689
const PURPLE: BaseColor = { red: 99, green: 70, blue: 137 };

const ALL_COLORS = [RED, GREEN, BLUE, ORANGE, PURPLE];

interface Colors {
  caretColor: string;
  selectionColor: string;
}

export const getColors = (key: string): Colors => {
  const existing = MAP.get(key);

  if (existing === undefined) {
    const availableColors = getAvailableColors();

    const randomColorIndex = Math.floor(Math.random() * availableColors.length);
    const baseColor = availableColors[randomColorIndex]!;

    MAP.set(key, baseColor);

    return {
      selectionColor: formatColor(baseColor, 0.2),
      caretColor: formatColor(baseColor, 1),
    };
  }

  return {
    selectionColor: formatColor(existing, 0.2),
    caretColor: formatColor(existing, 1),
  };
};

const getAvailableColors = (): BaseColor[] => {
  const availableColors = ALL_COLORS.filter((color) => ![...MAP.values()].includes(color));

  if (availableColors.length === 0) {
    return ALL_COLORS;
  }

  return availableColors;
};

const formatColor = (color: BaseColor, opacity: number): string =>
  `rgba(${color.red}, ${color.green}, ${color.blue}, ${opacity})`;
