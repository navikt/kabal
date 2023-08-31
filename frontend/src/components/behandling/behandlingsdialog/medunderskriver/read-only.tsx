import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { Name } from '@app/components/behandling/behandlingsdialog/common/name';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { IHelper } from '@app/types/oppgave-common';
import { getTitleCapitalized } from './get-title';

interface Props {
  medunderskriver: IHelper;
  typeId: SaksTypeEnum;
}

export const MedunderskriverReadOnly = ({ medunderskriver, typeId }: Props) => {
  const title = getTitleCapitalized(typeId);

  return (
    <>
      <Label size="small">{title}</Label>
      <BodyShort>
        {medunderskriver.navIdent === null ? 'Ikke satt' : <Name navIdent={medunderskriver.navIdent} />}
      </BodyShort>
    </>
  );
};