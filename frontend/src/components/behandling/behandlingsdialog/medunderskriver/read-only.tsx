import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { formatEmployeeName } from '@app/domain/employee-name';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { IMedunderskriverRol } from '@app/types/oppgave-common';
import { getTitleCapitalized } from './get-title';

interface Props {
  medunderskriver: IMedunderskriverRol;
  typeId: SaksTypeEnum;
}

export const MedunderskriverReadOnly = ({ medunderskriver, typeId }: Props) => {
  const title = getTitleCapitalized(typeId);

  return (
    <>
      <Label size="small">{title}</Label>
      <BodyShort>{formatEmployeeName(medunderskriver.employee, 'Ikke satt')}</BodyShort>
    </>
  );
};
