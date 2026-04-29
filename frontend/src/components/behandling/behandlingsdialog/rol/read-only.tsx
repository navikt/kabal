import { BodyShort, Label } from '@navikt/ds-react';
import { formatEmployeeNameAndIdFallback } from '@/domain/employee-name';
import type { IRol } from '@/types/oppgave-common';

interface Props {
  rol: IRol;
}

export const RolReadOnly = ({ rol }: Props) => (
  <>
    <Label size="small">Rådgivende overlege</Label>
    <BodyShort>{formatEmployeeNameAndIdFallback(rol.employee, 'Ikke satt')}</BodyShort>
  </>
);
