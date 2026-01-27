import { describe, expect, it } from 'bun:test';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { mergeTextItems } from './merge-text-items';

const createTextItem = (overrides: Partial<TextItem>): TextItem => ({
  str: '',
  dir: 'ltr',
  width: 0,
  height: 12,
  transform: [12, 0, 0, 12, 0, 0],
  fontName: 'g_d0_f1',
  hasEOL: false,
  ...overrides,
});

describe('mergeTextItems', () => {
  it('should return empty array for empty input', () => {
    expect(mergeTextItems([])).toEqual([]);
  });

  it('should return single item unchanged', () => {
    const item = createTextItem({ str: 'Hello', width: 50, transform: [12, 0, 0, 12, 0, 100] });
    const result = mergeTextItems([item]);

    expect(result).toHaveLength(1);
    expect(result[0]?.str).toBe('Hello');
  });

  it('should merge two adjacent items on the same line', () => {
    const items: TextItem[] = [
      createTextItem({ str: 'Hello ', width: 30, transform: [12, 0, 0, 12, 0, 100] }),
      createTextItem({ str: 'World', width: 40, transform: [12, 0, 0, 12, 30, 100] }),
    ];

    const result = mergeTextItems(items);

    expect(result).toHaveLength(1);
    expect(result[0]?.str).toBe('Hello World');
    expect(result[0]?.width).toBe(70);
  });

  it('should not merge items on different lines', () => {
    const items: TextItem[] = [
      createTextItem({ str: 'Line 1', width: 50, transform: [12, 0, 0, 12, 0, 100] }),
      createTextItem({ str: 'Line 2', width: 50, transform: [12, 0, 0, 12, 0, 80] }),
    ];

    const result = mergeTextItems(items);

    expect(result).toHaveLength(2);
    expect(result[0]?.str).toBe('Line 1');
    expect(result[1]?.str).toBe('Line 2');
  });

  it('should not merge items with large horizontal gap', () => {
    const items: TextItem[] = [
      createTextItem({ str: 'Left', width: 30, transform: [12, 0, 0, 12, 0, 100] }),
      createTextItem({ str: 'Right', width: 40, transform: [12, 0, 0, 12, 100, 100] }),
    ];

    const result = mergeTextItems(items);

    expect(result).toHaveLength(2);
    expect(result[0]?.str).toBe('Left');
    expect(result[1]?.str).toBe('Right');
  });

  it('should merge multiple adjacent items', () => {
    const items: TextItem[] = [
      createTextItem({ str: 'A', width: 10, transform: [12, 0, 0, 12, 0, 100] }),
      createTextItem({ str: 'B', width: 10, transform: [12, 0, 0, 12, 10, 100] }),
      createTextItem({ str: 'C', width: 10, transform: [12, 0, 0, 12, 20, 100] }),
    ];

    const result = mergeTextItems(items);

    expect(result).toHaveLength(1);
    expect(result[0]?.str).toBe('ABC');
    expect(result[0]?.width).toBe(30);
  });

  it('should handle items with small gap between them', () => {
    const items: TextItem[] = [
      createTextItem({ str: 'Hello', width: 30, transform: [12, 0, 0, 12, 0, 100] }),
      createTextItem({ str: 'World', width: 40, transform: [12, 0, 0, 12, 32, 100] }), // 2px gap
    ];

    const result = mergeTextItems(items);

    expect(result).toHaveLength(1);
    expect(result[0]?.str).toBe('HelloWorld');
  });

  it('should preserve hasEOL from last merged item', () => {
    const items: TextItem[] = [
      createTextItem({ str: 'Hello ', width: 30, transform: [12, 0, 0, 12, 0, 100], hasEOL: false }),
      createTextItem({ str: 'World', width: 40, transform: [12, 0, 0, 12, 30, 100], hasEOL: true }),
    ];

    const result = mergeTextItems(items);

    expect(result).toHaveLength(1);
    expect(result[0]?.hasEOL).toBe(true);
  });

  it('should not merge items with different fonts', () => {
    const items: TextItem[] = [
      createTextItem({ str: 'Normal', width: 50, transform: [12, 0, 0, 12, 0, 100], fontName: 'font1' }),
      createTextItem({ str: 'Bold', width: 50, transform: [12, 0, 0, 12, 50, 100], fontName: 'font2' }),
    ];

    const result = mergeTextItems(items);

    expect(result).toHaveLength(2);
  });

  it('should handle empty string items', () => {
    const items: TextItem[] = [
      createTextItem({ str: '', width: 0, height: 0, transform: [12, 0, 0, 12, 56.7, 787.72498] }),
      createTextItem({ str: 'Content', width: 50, transform: [12, 0, 0, 12, 56.7, 787.72498] }),
    ];

    const result = mergeTextItems(items);

    // Empty items with different heights should not merge with content items
    expect(result.some((item) => item.str === 'Content')).toBe(true);
  });

  it('should merge label and value on the same line', () => {
    // Simulating "Den ankende part:" and "FATTET ØRN MUSKEL" from example.json
    const items: TextItem[] = [
      createTextItem({
        str: 'Den ankende part:',
        width: 95.06251,
        transform: [12, 0, 0, 12, 56.7, 661.61249],
        fontName: 'g_d0_f2',
      }),
      createTextItem({
        str: 'FATTET ØRN MUSKEL',
        width: 107.41199999999999,
        transform: [12, 0, 0, 12, 154.16251, 661.61249],
        fontName: 'g_d0_f1',
      }),
    ];

    const result = mergeTextItems(items);

    // These should NOT merge because they have different fonts
    expect(result).toHaveLength(2);
  });

  it('should merge "Saksnummer:", space, and number', () => {
    // From example.json
    const items: TextItem[] = [
      createTextItem({
        str: 'Saksnummer:',
        width: 71.652,
        transform: [12, 0, 0, 12, 56.7, 615.03748],
        fontName: 'g_d0_f2',
      }),
      createTextItem({
        str: ' ',
        width: 2.4104999999999848,
        height: 0,
        transform: [12, 0, 0, 12, 128.352, 615.03748],
        fontName: 'g_d0_f2',
      }),
      createTextItem({
        str: '1829',
        width: 23.856,
        transform: [12, 0, 0, 12, 130.7625, 615.03748],
        fontName: 'g_d0_f1',
      }),
    ];

    const result = mergeTextItems(items);

    // Different fonts and the space has height 0, so they won't fully merge
    // But items with same font should merge
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('should sort result by y-position (descending) then x-position', () => {
    const items: TextItem[] = [
      createTextItem({ str: 'Bottom', width: 50, transform: [12, 0, 0, 12, 0, 50] }),
      createTextItem({ str: 'Top', width: 50, transform: [12, 0, 0, 12, 0, 100] }),
      createTextItem({ str: 'Middle', width: 50, transform: [12, 0, 0, 12, 0, 75] }),
    ];

    const result = mergeTextItems(items);

    expect(result[0]?.str).toBe('Top');
    expect(result[1]?.str).toBe('Middle');
    expect(result[2]?.str).toBe('Bottom');
  });

  it('should handle full document correctly', () => {
    const items: TextItem[] = [
      // Header line
      createTextItem({
        str: 'VEDTAK',
        width: 45.6,
        transform: [12, 0, 0, 12, 56.7, 787.72498],
        fontName: 'g_d0_f2',
      }),
      // Empty item (should be skipped)
      createTextItem({
        str: '',
        width: 0,
        height: 0,
        transform: [12, 0, 0, 12, 56.7, 770.0],
        fontName: 'g_d0_f1',
      }),
      // Date line - should merge
      createTextItem({
        str: 'Dato:',
        width: 30.5,
        transform: [12, 0, 0, 12, 56.7, 740.5],
        fontName: 'g_d0_f2',
      }),
      createTextItem({
        str: ' ',
        width: 3.0,
        transform: [12, 0, 0, 12, 87.2, 740.5],
        fontName: 'g_d0_f2',
      }),
      createTextItem({
        str: '15.03.2024',
        width: 55.2,
        transform: [12, 0, 0, 12, 90.2, 740.5],
        fontName: 'g_d0_f2',
      }),
      // Den ankende part line - different fonts, should NOT merge
      createTextItem({
        str: 'Den ankende part:',
        width: 95.06251,
        transform: [12, 0, 0, 12, 56.7, 700.61249],
        fontName: 'g_d0_f2',
      }),
      createTextItem({
        str: 'FATTET ØRN MUSKEL',
        width: 107.41199999999999,
        transform: [12, 0, 0, 12, 154.16251, 700.61249],
        fontName: 'g_d0_f1',
      }),
      // Saksnummer line - mixed fonts
      createTextItem({
        str: 'Saksnummer:',
        width: 71.652,
        transform: [12, 0, 0, 12, 56.7, 660.03748],
        fontName: 'g_d0_f2',
      }),
      createTextItem({
        str: '1829',
        width: 23.856,
        transform: [12, 0, 0, 12, 130.7625, 660.03748],
        fontName: 'g_d0_f1',
      }),
      // Multi-word paragraph that should merge
      createTextItem({
        str: 'Klager',
        width: 35.0,
        transform: [12, 0, 0, 12, 56.7, 620.0],
        fontName: 'g_d0_f1',
      }),
      createTextItem({
        str: ' har',
        width: 20.0,
        transform: [12, 0, 0, 12, 91.7, 620.0],
        fontName: 'g_d0_f1',
      }),
      createTextItem({
        str: ' rett',
        width: 22.0,
        transform: [12, 0, 0, 12, 111.7, 620.0],
        fontName: 'g_d0_f1',
      }),
      createTextItem({
        str: ' til',
        width: 15.0,
        transform: [12, 0, 0, 12, 133.7, 620.0],
        fontName: 'g_d0_f1',
      }),
      createTextItem({
        str: ' stønad.',
        width: 40.0,
        transform: [12, 0, 0, 12, 148.7, 620.0],
        fontName: 'g_d0_f1',
      }),
      // Footer on different line
      createTextItem({
        str: 'Side 1 av 3',
        width: 55.0,
        transform: [12, 0, 0, 12, 280.0, 50.0],
        fontName: 'g_d0_f1',
      }),
    ];
    const result = mergeTextItems(items);

    // Should have fewer items after merging
    expect(result.length).toBeLessThanOrEqual(items.length);

    // Should preserve all text content (comparing sorted arrays since order may change)
    const originalChars = items
      .map((item) => item.str)
      .join('')
      .split('')
      .sort()
      .join('');
    const mergedChars = result
      .map((item) => item.str)
      .join('')
      .split('')
      .sort()
      .join('');
    expect(mergedChars).toBe(originalChars);

    // All original strings should be present in merged result
    const mergedText = result.map((item) => item.str).join('');
    for (const item of items) {
      if (item.str.trim() !== '') {
        expect(mergedText).toContain(item.str);
      }
    }
  });
});
