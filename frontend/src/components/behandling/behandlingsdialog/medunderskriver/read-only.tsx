import { BodyShort } from '@navikt/ds-react';
import { formatEmployeeNameAndIdFallback } from '@/domain/employee-name';
import type { IMedunderskriver } from '@/types/oppgave-common';

interface Props {
  medunderskriver: IMedunderskriver;
}

export const MedunderskriverReadOnly = ({ medunderskriver }: Props) => (
  <BodyShort>{formatEmployeeNameAndIdFallback(medunderskriver.employee, 'Ikke satt')}</BodyShort>
);
