export const BASE_FONT_SIZE = 12;

export const ptToEm = (pt: number) => `${(pt / BASE_FONT_SIZE).toFixed(4)}em`;
export const pxToEm = (px: number) => `${((px * 0.75) / BASE_FONT_SIZE).toFixed(4)}em`;
