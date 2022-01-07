import Alertstripe from 'nav-frontend-alertstriper';
import { Checkbox } from 'nav-frontend-skjema';
import 'nav-frontend-knapper-style';
import React from 'react';
import styled from 'styled-components';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { useUpdateFinishedInGosysMutation } from '../../redux-api/oppgavebehandling';
import { OppgaveType } from '../../types/kodeverk';
import { BackLink } from './back-link';
import { StyledButtons, StyledFinishedFooter, StyledUnfinishedNoErrorFooter } from './styled-components';

export const FinishedAnkeFooter = () => {
  const { data: oppgavebehandling } = useOppgave();
  const [update] = useUpdateFinishedInGosysMutation();

  if (typeof oppgavebehandling === 'undefined' || oppgavebehandling.type !== OppgaveType.ANKEBEHANDLING) {
    return null;
  }

  const Wrapper = oppgavebehandling.fullfoertGosys ? StyledFinishedFooter : StyledUnfinishedNoErrorFooter;

  return (
    <Wrapper>
      <StyledButtons>
        <StyledCheckbox
          label="Fullført i Gosys"
          checked={oppgavebehandling.fullfoertGosys}
          disabled={oppgavebehandling.fullfoertGosys}
          onChange={() => update({ type: oppgavebehandling.type, oppgaveId: oppgavebehandling.id })}
        />
        <BackLink />
      </StyledButtons>
      <Alertstripe type={oppgavebehandling.fullfoertGosys ? 'suksess' : 'info'} form="inline">
        {getSuccessMessage(oppgavebehandling.fullfoertGosys)}
      </Alertstripe>
    </Wrapper>
  );
};

const StyledCheckbox = styled(Checkbox)`
  margin-right: 16px;
`;

const getSuccessMessage = (fullfoertGosys: boolean) =>
  fullfoertGosys ? 'Fullført behandling' : 'Innstilling sendt til klager';
