import { describe, expect, it } from 'bun:test';
import { getDefaultVariant } from '@/components/documents/filetype';
import { Filtype, type Variant, VariantFormat } from '@/types/arkiverte-documents';

const createVariant = (format: VariantFormat): Variant => ({
  filtype: Filtype.PDF,
  hasAccess: true,
  format,
  filstoerrelse: 1024,
  skjerming: null,
});

const SLADDET = createVariant(VariantFormat.SLADDET);
const ARKIV = createVariant(VariantFormat.ARKIV);
const FULLVERSJON = createVariant(VariantFormat.FULLVERSJON);

describe('getDefaultVariant', () => {
  it('should return the only variant', () => {
    expect(getDefaultVariant([ARKIV])).toBe(ARKIV);
    expect(getDefaultVariant([SLADDET])).toBe(SLADDET);
    expect(getDefaultVariant([FULLVERSJON])).toBe(FULLVERSJON);
  });

  it('should prefer SLADDET over ARKIV and FULLVERSJON regardless of order', () => {
    expect(getDefaultVariant([ARKIV, SLADDET])).toBe(SLADDET);
    expect(getDefaultVariant([SLADDET, ARKIV])).toBe(SLADDET);
    expect(getDefaultVariant([FULLVERSJON, SLADDET])).toBe(SLADDET);
    expect(getDefaultVariant([FULLVERSJON, ARKIV, SLADDET])).toBe(SLADDET);
    expect(getDefaultVariant([ARKIV, FULLVERSJON, SLADDET])).toBe(SLADDET);
  });

  it('should prefer ARKIV over FULLVERSJON regardless of order', () => {
    expect(getDefaultVariant([FULLVERSJON, ARKIV])).toBe(ARKIV);
    expect(getDefaultVariant([ARKIV, FULLVERSJON])).toBe(ARKIV);
  });
});
