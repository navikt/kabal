import { describe, expect, it } from 'bun:test';
import { normalizeVariants } from '@/plugins/file-viewer/encoding';

const BASE = { filtype: 'PDF', hasAccess: true, skjerming: null } as const;

const ARKIV = { ...BASE, format: 'ARKIV', filstoerrelse: 1024 } as const;
const SLADDET = { ...BASE, format: 'SLADDET' } as const;
const FULLVERSJON = { ...BASE, format: 'FULLVERSJON' } as const;

describe('normalizeVariants', () => {
  it('should pass through file type strings', () => {
    expect(normalizeVariants('PDF')).toBe('PDF');
  });

  it('should pass through a single variant', () => {
    expect(normalizeVariants(FULLVERSJON)).toBe(FULLVERSJON);
  });

  it('should unwrap a tuple with one variant', () => {
    expect(normalizeVariants([ARKIV])).toBe(ARKIV);
  });

  it('should pass through tuples with two or three variants', () => {
    expect(normalizeVariants([ARKIV, SLADDET])).toEqual([ARKIV, SLADDET]);
    expect(normalizeVariants([SLADDET, ARKIV, FULLVERSJON])).toEqual([SLADDET, ARKIV, FULLVERSJON]);
  });
});
