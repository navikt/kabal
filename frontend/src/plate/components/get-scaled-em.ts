// Actual size specced in retningslinjer: https://aksel.nav.no/god-praksis/artikler/visuelle-retningslinjer-for-brev
export const BASE_FONT_SIZE_PX = 11;

// Size we want to "mimic" at 100 % (same as other text in Kabal)
export const SCREEN_FONT_SIZE_PX = 16;

const RETNINGSLINJER_SHEET_WIDTH_PX = 595;
const RETNINGSLINJER_SHEET_HEIGHT_PX = 842;

// We want the smart editor to look as similar as possible to the generated PDF. Simple trial and error led to these values.
export const SHEET_WIDTH_PX = 800;
export const SHEET_MIN_HEIGHT_PX = SHEET_WIDTH_PX * (RETNINGSLINJER_SHEET_HEIGHT_PX / RETNINGSLINJER_SHEET_WIDTH_PX);

export const PADDING_INLINE_PX = 64;
export const PADDING_TOP_PX = 64;
export const PADDING_BOTTOM_PX = 74;

export const pxToEm = (px: number, base = BASE_FONT_SIZE_PX) => `${(px / base).toFixed(4)}em`;

const BASE_INDENT_SIZE = 20;
/**
 *
 * @param indent - Number of indents, NOT size of indents
 * @returns Actual indent size in em
 */
export const indentInEm = (indent = 0) => pxToEm(BASE_INDENT_SIZE * indent);
