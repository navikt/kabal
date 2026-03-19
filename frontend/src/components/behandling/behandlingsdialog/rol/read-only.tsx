import { BodyShort, Label } from '@navikt/ds-react';
import { formatEmployeeNameAndIdFallback } from '@/domain/employee-name';
import type { IMedunderskriverRol } from '@/types/oppgave-common';

interface Props {
  rol: IMedunderskriverRol;
}

export const RolReadOnly = ({ rol }: Props) => (
  <>
    <Label size="small">Rådgivende overlege</Label>
    <BodyShort>{formatEmployeeNameAndIdFallback(rol.employee, 'Ikke satt')}</BodyShort>
  </>
);
