import { Close, Collapse, FileFolder } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { useKodeverkYtelse } from '../../hooks/use-kodeverk-value';
import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { useFradelSaksbehandlerMutation } from '../../redux-api/oppgaver/mutations/ansatte';
import { useUpdateInnsendingshjemlerMutation } from '../../redux-api/oppgaver/mutations/behandling';
import { FilterList } from '../filter-dropdown/filter-list';

export const DeassignOppgave = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [, { isLoading }] = useFradelSaksbehandlerMutation();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(() => setIsOpen(false), ref, true);

  const Icon = isOpen ? Collapse : FileFolder;

  return (
    <Container ref={ref}>
      <Popup isOpen={isOpen} close={() => setIsOpen(false)} />
      <Button variant="secondary" size="small" onClick={() => setIsOpen(!isOpen)} loading={isLoading}>
        <Icon />
        Legg tilbake med ny hjemmel
      </Button>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: row;
  position: relative;
  gap: 16px;
  min-width: 275px;
`;

interface PopupProps {
  isOpen: boolean;
  close: () => void;
}

const Popup = ({ isOpen, close }: PopupProps) => {
  const navigate = useNavigate();
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const [setHjemler] = useUpdateInnsendingshjemlerMutation();
  const [fradel, { isLoading }] = useFradelSaksbehandlerMutation();
  const { data: bruker, isLoading: userIsLoading } = useGetBrukerQuery();
  const ytelse = useKodeverkYtelse(oppgave?.ytelse);

  const options = useMemo(
    () => ytelse?.innsendingshjemler.map(({ id, navn }) => ({ value: id, label: navn })) ?? [],
    [ytelse?.innsendingshjemler]
  );

  if (!isOpen || oppgaveIsLoading || userIsLoading || typeof oppgave === 'undefined' || typeof bruker === 'undefined') {
    return null;
  }

  const setSelected = (hjemler: string[]) => setHjemler({ hjemler, oppgaveId: oppgave.id });

  const onClick = async () => {
    await fradel({
      oppgaveId: oppgave.id,
      navIdent: bruker.navIdent,
    });

    navigate('/mineoppgaver');
  };

  return (
    <StyledPopup>
      <StyledTitle>Endre hjemmel?</StyledTitle>
      <FilterList options={options} selected={oppgave.hjemler} onChange={setSelected} />
      <ButtonContainer>
        <Button variant="secondary" size="small" disabled={isLoading} onClick={close}>
          <Close />
          Avbryt
        </Button>
        <Button variant="primary" size="small" loading={isLoading} onClick={onClick}>
          <FileFolder />
          Legg tilbake
        </Button>
      </ButtonContainer>
    </StyledPopup>
  );
};

const StyledPopup = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  gap: 8px;
  bottom: 100%;
  width: 100%;

  background-color: white;
  border-radius: 4px;
  border: 1px solid #c6c2bf;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  column-gap: 8px;
  padding-bottom: 8px;
  padding-left: 8px;
  padding-right: 8px;
`;

const StyledTitle = styled.h1`
  margin: 0;
  padding: 8px;
  padding-bottom: 0;
  font-size: 20px;
  white-space: nowrap;
`;
