/*
  The sizes in this file are from the page "Visuelle retningslinjer for brev"; https://aksel.nav.no/god-praksis/artikler/visuelle-retningslinjer-for-brev
  The guidelines specify the sizes in pixels, but their pixels are 1/72 inch. Which is one point in the PDF generator.
  A4 (210 mm * 297 mm) is 595 * 842 points.
  The actual physical size on screen for generated PDF pages at 100% scaling is 793.35 * 1122.65 pixels.
  1 point is 1.333... pixels.
  793.35 / 595 = 1,3333613445

  The Smart Editor should then also be 793.35 pixels wide, or simply 595 points (pt).
  595 * 842 points (pt) makes actual physical size on screen for the Smart Editor 793.333 * 1122.67 pixels.

  All pixel sizes from the guidelines are directly used as points here. Eg. 11 pixels font size => 11 points font size.

  We then convert points to em, for the scaling to work.
*/

const PT_TO_PX_RATIO = 1 + 1 / 3; // 1 pt is 1.333... pixels.

export const ptToPx = (pt: number) => pt * PT_TO_PX_RATIO;

export const ptToEm = (pt: number, base = FONT_SIZE_PT) => `${(pt / base).toFixed(4)}em`;

export const FONT_SIZE_PT = 11;
export const FONT_SIZE_PX = ptToPx(FONT_SIZE_PT);

export const LINE_HEIGHT_PT = 16;

export const SHEET_WIDTH_PT = 595;
export const SHEET_HEIGHT_PT = 842;

export const PADDING_INLINE_PT = 64;
export const PADDING_TOP_PT = 64;
export const PADDING_BOTTOM_PT = 74;

const BASE_INDENT_SIZE_PT = 20;

/**
 *
 * @param indent - Number of indents, NOT size of indents
 * @param base - The element's own font size in pt. Margin/padding `em` values are relative to the
 *               element's own computed font size, not the parent's, so this must match the font size
 *               set on the same element for the indent to be visually consistent across font sizes.
 * @returns Actual indent size in em
 */
export const indentInEm = (indent = 0, base = FONT_SIZE_PT) => ptToEm(BASE_INDENT_SIZE_PT * indent, base);
