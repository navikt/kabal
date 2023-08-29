import { Tag } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import {
  getTitleCapitalized,
  getTitleLowercase,
} from '@app/components/behandling/behandlingsdialog/medunderskriver/getTitle';
import { useUser } from '@app/simple-api-state/use-user';
import { MedunderskriverFlyt } from '@app/types/kodeverk';
import { IOppgave } from '@app/types/oppgaver';

type MedudunderskriverflytLabelProps = Pick<IOppgave, 'medunderskriverFlyt' | 'medunderskriverident' | 'typeId'>;

export const MedudunderskriverflytLabel = ({
  medunderskriverFlyt,
  medunderskriverident,
  typeId,
}: MedudunderskriverflytLabelProps) => {
  const { data, isLoading } = useUser();

  if (medunderskriverident === null || isLoading || data === undefined) {
    return null;
  }

  const erMedunderskriver = medunderskriverident === data.navIdent;

  if (erMedunderskriver && medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return <StyledTag variant="alt3">{getTitleCapitalized(typeId)}</StyledTag>;
  }

  if (!erMedunderskriver && medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return <StyledTag variant="alt3">Sendt til {getTitleLowercase(typeId)}</StyledTag>;
  }

  if (!erMedunderskriver && medunderskriverFlyt === MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER) {
    return <StyledTag variant="info">Sendt tilbake av {getTitleLowercase(typeId)}</StyledTag>;
  }

  return null;
};

const StyledTag = styled(Tag)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
