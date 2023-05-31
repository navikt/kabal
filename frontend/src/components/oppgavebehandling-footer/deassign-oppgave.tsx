import { ChevronUpIcon, FolderFileIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useKodeverkYtelse } from '@app/hooks/use-kodeverk-value';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useUpdateInnsendingshjemlerMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { useTildelSaksbehandlerMutation } from '@app/redux-api/oppgaver/mutations/tildeling';
import { useUser } from '@app/simple-api-state/use-user';
import { FilterList } from '../filter-dropdown/filter-list';

export const DeassignOppgave = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [, { isLoading }] = useTildelSaksbehandlerMutation();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false), true);

  const Icon = isOpen ? ChevronUpIcon : FolderFileIcon;

  return (
    <Container ref={ref}>
      <Popup isOpen={isOpen} close={() => setIsOpen(false)} />
      <Button
        variant="secondary"
        size="small"
        onClick={() => setIsOpen(!isOpen)}
        loading={isLoading}
        icon={<Icon aria-hidden />}
      >
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
  const { data: bruker, isLoading: userIsLoading } = useUser();
  const [tildel, { isLoading }] = useTildelSaksbehandlerMutation();
  const ytelse = useKodeverkYtelse(oppgave?.ytelseId ?? skipToken);

  const options = useMemo(
    () => ytelse?.innsendingshjemler.map(({ id, navn }) => ({ value: id, label: navn })) ?? [],
    [ytelse?.innsendingshjemler]
  );

  if (!isOpen || oppgaveIsLoading || userIsLoading || typeof oppgave === 'undefined' || typeof bruker === 'undefined') {
    return null;
  }

  const setSelected = (hjemler: string[]) => setHjemler({ hjemler, oppgaveId: oppgave.id });

  const onClick = async () => {
    await tildel({ oppgaveId: oppgave.id, navIdent: null });

    navigate('/mineoppgaver');
  };

  return (
    <StyledPopup>
      <StyledTitle>Endre hjemmel?</StyledTitle>
      <FilterList options={options} selected={oppgave.hjemmelIdList} onChange={setSelected} />
      <ButtonContainer>
        <Button variant="secondary" size="small" disabled={isLoading} onClick={close} icon={<XMarkIcon aria-hidden />}>
          Avbryt
        </Button>
        <Button
          variant="primary"
          size="small"
          loading={isLoading}
          onClick={onClick}
          icon={<FolderFileIcon aria-hidden />}
        >
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
