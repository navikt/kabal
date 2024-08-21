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
// #66CBEC
// const LIGHT_BLUE: BaseColor = { red: 102, green: 203, blue: 236 };
// #0067C5
const BLUE: BaseColor = { red: 0, green: 103, blue: 197 };
// #FF9100
const ORANGE: BaseColor = { red: 255, green: 145, blue: 0 };
// #005B82
// const DEEP_BLUE: BaseColor = { red: 0, green: 91, blue: 130 };
// #634689
const PURPLE: BaseColor = { red: 99, green: 70, blue: 137 };

const COLORS = [RED, GREEN, BLUE, ORANGE, PURPLE];
const COLOR_MAX = COLORS.length;

export const getColor = (key: string, opacity: number): string => {
  const existing = MAP.get(key);

  if (existing === undefined) {
    const randomColorIndex = Math.floor(Math.random() * COLOR_MAX);
    const baseColor = COLORS[randomColorIndex]!;

    MAP.set(key, baseColor);

    return formatColor(baseColor, opacity);
  }

  return formatColor(existing, opacity);
};

const formatColor = (color: BaseColor, opacity: number): string =>
  `rgba(${color.red}, ${color.green}, ${color.blue}, ${opacity})`;
