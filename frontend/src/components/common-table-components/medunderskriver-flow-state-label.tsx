import { Tag } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import {
  getTitleCapitalized,
  getTitleLowercase,
} from '@app/components/behandling/behandlingsdialog/medunderskriver/get-title';
import { useUser } from '@app/simple-api-state/use-user';
import { FlowState } from '@app/types/oppgave-common';
import { IOppgave } from '@app/types/oppgaver';

type Props = Pick<IOppgave, 'medunderskriver' | 'typeId'>;

export const MedudunderskriverFlowStateLabel = ({ medunderskriver, typeId }: Props) => {
  const { data, isLoading } = useUser();

  if (medunderskriver.navIdent === null || isLoading || data === undefined) {
    return null;
  }

  const isMedunderskriver = medunderskriver.navIdent === data.navIdent;

  if (isMedunderskriver && medunderskriver.flowState === FlowState.SENT) {
    return <StyledTag variant="alt3">{getTitleCapitalized(typeId)}</StyledTag>;
  }

  if (!isMedunderskriver && medunderskriver.flowState === FlowState.SENT) {
    return <StyledTag variant="alt3">Sendt til {getTitleLowercase(typeId)}</StyledTag>;
  }

  if (!isMedunderskriver && medunderskriver.flowState === FlowState.RETURNED) {
    return <StyledTag variant="info">Sendt tilbake av {getTitleLowercase(typeId)}</StyledTag>;
  }

  return null;
};

const StyledTag = styled(Tag)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
