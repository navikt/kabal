import { getFullName } from '@app/domain/name';
import { LegacyPartView } from '@app/types/legacy';
import { IPart, IdType } from '@app/types/oppgave-common';

export const migrateLegacyPart = (legacyPart: LegacyPartView): IPart => ({
  id: legacyPart?.person?.foedselsnummer ?? legacyPart?.virksomhet?.virksomhetsnummer ?? '',
  name: getFullName(legacyPart?.person?.navn) ?? legacyPart?.virksomhet?.navn,
  type: legacyPart?.person !== null ? IdType.FNR : IdType.ORGNR,
});
