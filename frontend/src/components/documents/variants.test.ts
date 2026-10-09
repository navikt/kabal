import { describe, expect, it } from 'bun:test';
import { getActiveFormat, getActiveVariant, getSelectableFormats } from '@/components/documents/variants';
import { Filtype, type Variant, VariantFormat } from '@/types/arkiverte-documents';

const createVariant = (format: VariantFormat, hasAccess = true): Variant => ({
  filtype: Filtype.PDF,
  hasAccess,
  format,
  filstoerrelse: 1024,
  skjerming: null,
});

const SLADDET = createVariant(VariantFormat.SLADDET);
const SLADDET_NO_ACCESS = createVariant(VariantFormat.SLADDET, false);
const ARKIV = createVariant(VariantFormat.ARKIV);
const ARKIV_NO_ACCESS = createVariant(VariantFormat.ARKIV, false);
const FULLVERSJON = createVariant(VariantFormat.FULLVERSJON);
const FULLVERSJON_NO_ACCESS = createVariant(VariantFormat.FULLVERSJON, false);

describe('getActiveVariant', () => {
  it('should use the selected format when accessible', () => {
    expect(getActiveVariant([ARKIV, SLADDET, FULLVERSJON], VariantFormat.SLADDET)).toBe(SLADDET);
    expect(getActiveVariant([ARKIV, SLADDET, FULLVERSJON], VariantFormat.FULLVERSJON)).toBe(FULLVERSJON);
  });

  it('should fall back to SLADDET, then ARKIV, then FULLVERSJON', () => {
    expect(getActiveVariant([ARKIV, SLADDET], VariantFormat.FULLVERSJON)).toBe(SLADDET);
    expect(getActiveVariant([FULLVERSJON, ARKIV], VariantFormat.SLADDET)).toBe(ARKIV);
    expect(getActiveVariant([FULLVERSJON], VariantFormat.ARKIV)).toBe(FULLVERSJON);
  });

  it('should skip inaccessible variants', () => {
    expect(getActiveVariant([SLADDET_NO_ACCESS, ARKIV], VariantFormat.SLADDET)).toBe(ARKIV);
    expect(getActiveVariant([ARKIV_NO_ACCESS, FULLVERSJON], VariantFormat.ARKIV)).toBe(FULLVERSJON);
    expect(getActiveVariant([SLADDET, ARKIV_NO_ACCESS, FULLVERSJON_NO_ACCESS], VariantFormat.ARKIV)).toBe(SLADDET);
  });

  it('should use the first candidate when none are accessible', () => {
    expect(getActiveVariant([ARKIV_NO_ACCESS, SLADDET_NO_ACCESS], VariantFormat.SLADDET)).toBe(SLADDET_NO_ACCESS);
    expect(getActiveVariant([FULLVERSJON_NO_ACCESS, ARKIV_NO_ACCESS], VariantFormat.SLADDET)).toBe(ARKIV_NO_ACCESS);
  });

  it('should return undefined without variants', () => {
    expect(getActiveVariant([], VariantFormat.ARKIV)).toBeUndefined();
  });
});

describe('getSelectableFormats', () => {
  it('should list accessible formats in display order', () => {
    expect(getSelectableFormats([FULLVERSJON, ARKIV, SLADDET])).toEqual([
      VariantFormat.SLADDET,
      VariantFormat.ARKIV,
      VariantFormat.FULLVERSJON,
    ]);
    expect(getSelectableFormats([FULLVERSJON, ARKIV_NO_ACCESS, SLADDET_NO_ACCESS])).toEqual([
      VariantFormat.FULLVERSJON,
    ]);
    expect(getSelectableFormats([])).toEqual([]);
  });

  it('should include a format if any variant of it is accessible', () => {
    expect(getSelectableFormats([ARKIV_NO_ACCESS, SLADDET, ARKIV])).toEqual([
      VariantFormat.SLADDET,
      VariantFormat.ARKIV,
    ]);
  });
});

describe('getActiveFormat', () => {
  it('should use the selected format when selectable', () => {
    expect(getActiveFormat([VariantFormat.SLADDET, VariantFormat.ARKIV], VariantFormat.SLADDET)).toBe(
      VariantFormat.SLADDET,
    );
  });

  it('should fall back to SLADDET, then ARKIV, then FULLVERSJON', () => {
    expect(getActiveFormat([VariantFormat.ARKIV, VariantFormat.SLADDET], VariantFormat.FULLVERSJON)).toBe(
      VariantFormat.SLADDET,
    );
    expect(getActiveFormat([VariantFormat.FULLVERSJON, VariantFormat.ARKIV], VariantFormat.SLADDET)).toBe(
      VariantFormat.ARKIV,
    );
    expect(getActiveFormat([VariantFormat.FULLVERSJON], VariantFormat.ARKIV)).toBe(VariantFormat.FULLVERSJON);
  });

  it('should return undefined when nothing is selectable', () => {
    expect(getActiveFormat([], VariantFormat.ARKIV)).toBeUndefined();
  });
});
