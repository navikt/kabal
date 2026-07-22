import { describe, expect, it } from 'bun:test';
import { isTrygderettenTypeId } from '@/functions/is-trygderetten-sak';
import { SaksTypeEnum } from '@/types/kodeverk';

const CASES: [SaksTypeEnum, boolean][] = [
  [SaksTypeEnum.KLAGE, false],
  [SaksTypeEnum.ANKE, false],
  [SaksTypeEnum.ANKE_I_TRYGDERETTEN, true],
  [SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET, false],
  [SaksTypeEnum.OMGJØRINGSKRAV, false],
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK, false],
  [SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR, true],
];

describe('isTrygderettenTypeId', () => {
  it.each(CASES)('returns %s for %s', (typeId, expected) => {
    expect(isTrygderettenTypeId(typeId)).toBe(expected);
  });
});
