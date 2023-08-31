import { Tag } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { useUser } from '@app/simple-api-state/use-user';
import { FlowState } from '@app/types/oppgave-common';
import { IOppgave } from '@app/types/oppgaver';

type Props = Pick<IOppgave, 'rol'>;

export const RolFlowStateLabel = ({ rol }: Props) => {
  const { data, isLoading } = useUser();

  if (isLoading || data === undefined) {
    return null;
  }

  if (rol.navIdent === null && rol.flowState === FlowState.SENT) {
    return <StyledTag variant="alt3">I felles kø for rådgivende overleger</StyledTag>;
  }

  const isRol = rol.navIdent === data.navIdent;

  if (isRol && rol.flowState === FlowState.SENT) {
    return <StyledTag variant="alt3">Rådgivende overlege</StyledTag>;
  }

  if (!isRol && rol.flowState === FlowState.SENT) {
    return <StyledTag variant="alt3">Sendt til rådgivende overlege</StyledTag>;
  }

  if (!isRol && rol.flowState === FlowState.RETURNED) {
    return <StyledTag variant="info">Sendt tilbake av rådgivende overlege</StyledTag>;
  }

  return null;
};

const StyledTag = styled(Tag)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
