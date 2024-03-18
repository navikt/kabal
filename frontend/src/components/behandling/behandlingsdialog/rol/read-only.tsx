import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { formatEmployeeNameAndIdFallback } from '@app/domain/employee-name';
import { IMedunderskriverRol } from '@app/types/oppgave-common';

interface Props {
  rol: IMedunderskriverRol;
}

export const RolReadOnly = ({ rol }: Props) => (
  <>
    <Label size="small">Rådgivende overlege</Label>
    <BodyShort>{formatEmployeeNameAndIdFallback(rol.employee, 'Ikke satt')}</BodyShort>
  </>
);
