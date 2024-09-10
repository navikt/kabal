import { formatEmployeeNameAndIdFallback } from '@app/domain/employee-name';
import type { IMedunderskriverRol } from '@app/types/oppgave-common';
import { BodyShort, Label } from '@navikt/ds-react';

interface Props {
  rol: IMedunderskriverRol;
}

export const RolReadOnly = ({ rol }: Props) => (
  <>
    <Label size="small">Rådgivende overlege</Label>
    <BodyShort>{formatEmployeeNameAndIdFallback(rol.employee, 'Ikke satt')}</BodyShort>
  </>
);
