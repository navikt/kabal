import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { IHelper } from '@app/types/oppgave-common';

interface Props {
  rol: IHelper;
}

export const RolReadOnly = ({ rol }: Props) => (
  <>
    <Label size="small">Rådgivende overlege</Label>
    <BodyShort>{rol.navIdent === null ? 'Ikke satt' : rol.name}</BodyShort>
  </>
);
