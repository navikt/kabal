import Alertstripe from 'nav-frontend-alertstriper';
import { Checkbox } from 'nav-frontend-skjema';
import React from 'react';
import styled from 'styled-components';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { useUpdateFinishedInGosysMutation } from '../../redux-api/behandlinger';
import { OppgaveType } from '../../types/kodeverk';
import { BackLink } from './back-link';
import { StyledButtons, StyledFinishedFooter, StyledUnfinishedNoErrorFooter } from './styled-components';

export const FinishedAnkeFooter = () => {
  const { data: oppgave } = useOppgave();
  const [update] = useUpdateFinishedInGosysMutation();

  if (typeof oppgave === 'undefined' || oppgave.type !== OppgaveType.ANKE) {
    return null;
  }

  const Wrapper = oppgave.fullfoertGosys ? StyledFinishedFooter : StyledUnfinishedNoErrorFooter;

  return (
    <Wrapper>
      <StyledButtons>
        <StyledCheckbox
          label="Fullført i Gosys"
          checked={oppgave.fullfoertGosys}
          disabled={oppgave.fullfoertGosys}
          onChange={() => update(oppgave.id)}
        />
        <BackLink />
      </StyledButtons>
      <Alertstripe type={oppgave.fullfoertGosys ? 'suksess' : 'info'} form="inline">
        {getSuccessMessage(oppgave.fullfoertGosys)}
      </Alertstripe>
    </Wrapper>
  );
};

const StyledCheckbox = styled(Checkbox)`
  margin-right: 16px;
`;

const getSuccessMessage = (fullfoertGosys: boolean) =>
  fullfoertGosys ? 'Fullført behandling' : 'Innstilling sendt til klager';
