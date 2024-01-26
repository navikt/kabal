import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { IMedunderskriverRol } from '@app/types/oppgave-common';

interface Props {
  rol: IMedunderskriverRol;
}

export const RolReadOnly = ({ rol }: Props) => (
  <>
    <Label size="small">Rådgivende overlege</Label>
    <BodyShort>{rol.employee === null ? 'Ikke satt' : `${rol.employee.navn} (${rol.employee.navIdent})`}</BodyShort>
  </>
);
