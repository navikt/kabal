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

  it('should prefer accessible variants', () => {
    const SLADDET_NO_ACCESS = { ...SLADDET, hasAccess: false };
    const ARKIV_NO_ACCESS = { ...ARKIV, hasAccess: false };

    expect(getDefaultVariant([SLADDET_NO_ACCESS, ARKIV])).toBe(ARKIV);
    expect(getDefaultVariant([SLADDET_NO_ACCESS, ARKIV_NO_ACCESS, FULLVERSJON])).toBe(FULLVERSJON);
  });

  it('should fall back to priority order when no variant is accessible', () => {
    const SLADDET_NO_ACCESS = { ...SLADDET, hasAccess: false };
    const ARKIV_NO_ACCESS = { ...ARKIV, hasAccess: false };

    expect(getDefaultVariant([ARKIV_NO_ACCESS, SLADDET_NO_ACCESS])).toBe(SLADDET_NO_ACCESS);
  });

  it('should prefer ARKIV over FULLVERSJON regardless of order', () => {
    expect(getDefaultVariant([FULLVERSJON, ARKIV])).toBe(ARKIV);
    expect(getDefaultVariant([ARKIV, FULLVERSJON])).toBe(ARKIV);
  });
});
