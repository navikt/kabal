import { BodyShort } from '@navikt/ds-react';
import { formatEmployeeNameAndIdFallback } from '@/domain/employee-name';
import type { SaksTypeEnum } from '@/types/kodeverk';
import type { IMedunderskriver } from '@/types/oppgave-common';

interface Props {
  medunderskriver: IMedunderskriver;
  typeId: SaksTypeEnum;
}

export const MedunderskriverReadOnly = ({ medunderskriver }: Props) => (
  <BodyShort>{formatEmployeeNameAndIdFallback(medunderskriver.employee, 'Ikke satt')}</BodyShort>
);
