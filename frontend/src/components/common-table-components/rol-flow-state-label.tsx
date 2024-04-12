import { Tag } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { FlowState } from '@app/types/oppgave-common';
import { IOppgave } from '@app/types/oppgaver';

type Props = Pick<IOppgave, 'rol'>;

export const RolFlowStateLabel = ({ rol }: Props) => {
  const { user } = useContext(StaticDataContext);

  if (rol.employee === null && rol.flowState === FlowState.SENT) {
    return (
      <StyledTag variant="alt3" title="I felles kø for rådgivende overlege">
        I felles kø for ROL
      </StyledTag>
    );
  }

  const isRol = rol.employee?.navIdent === user.navIdent;

  if (isRol && rol.flowState === FlowState.SENT) {
    return (
      <StyledTag variant="alt3" title="Rådgivende overlege">
        ROL
      </StyledTag>
    );
  }

  if (!isRol && rol.flowState === FlowState.SENT) {
    return (
      <StyledTag variant="alt3" title="Sendt til rådgivende overlege">
        Sendt til ROL
      </StyledTag>
    );
  }

  if (!isRol && rol.flowState === FlowState.RETURNED) {
    return (
      <StyledTag variant="info" title="Tilbake fra rådgivende overlege">
        Tilbake fra ROL
      </StyledTag>
    );
  }

  return null;
};

const StyledTag = styled(Tag)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
