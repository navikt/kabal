import { ChevronUpIcon, FolderFileIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button, Search } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { PaaVentWarning } from '@app/components/oppgavebehandling-footer/paa-vent-warning';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useKodeverkYtelse } from '@app/hooks/use-kodeverk-value';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useUpdateInnsendingshjemlerMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { useTildelSaksbehandlerMutation } from '@app/redux-api/oppgaver/mutations/tildeling';
import { useUser } from '@app/simple-api-state/use-user';
import { FilterList } from '../filter-dropdown/filter-list';

export const DeassignOppgave = () => {
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const [isOpen, setIsOpen] = useState(false);
  const [warningIsOpen, setWarningIsOpen] = useState(false);
  const [, { isLoading }] = useTildelSaksbehandlerMutation();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false), true);

  if (oppgaveIsLoading || typeof oppgave === 'undefined') {
    return (
      <Container>
        <StyledButton variant="secondary" size="small" disabled loading icon={<FolderFileIcon aria-hidden />}>
          Legg tilbake med ny hjemmel
        </StyledButton>
      </Container>
    );
  }

  const Icon = isOpen ? ChevronUpIcon : FolderFileIcon;

  const onClick = () => {
    if (oppgave.sattPaaVent !== null) {
      setWarningIsOpen(!warningIsOpen);
      setIsOpen(false);
    } else {
      setIsOpen(!isOpen);
      setWarningIsOpen(false);
    }
  };

  const onConfirm = () => {
    setWarningIsOpen(false);
    setIsOpen(true);
  };

  return (
    <Container ref={ref}>
      <Popup isOpen={isOpen} close={() => setIsOpen(false)} />
      <PaaVentWarning isOpen={warningIsOpen} close={() => setWarningIsOpen(false)} onConfirm={onConfirm} />
      <StyledButton variant="secondary" size="small" onClick={onClick} loading={isLoading} icon={<Icon aria-hidden />}>
        Legg tilbake med ny hjemmel
      </StyledButton>
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const StyledButton = styled(Button)`
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
  const [search, setSearch] = useState('');
  const filterRegex = useMemo(() => stringToRegExp(search), [search]);

  const options = useMemo(
    () => ytelse?.innsendingshjemler.map(({ id, navn }) => ({ value: id, label: navn })) ?? [],
    [ytelse?.innsendingshjemler]
  );

  const filteredOptions = useMemo(
    () => options.filter((option) => filterRegex.test(option.label)),
    [options, filterRegex]
  );

  if (!isOpen || oppgaveIsLoading || userIsLoading || typeof oppgave === 'undefined' || typeof bruker === 'undefined') {
    return null;
  }

  const setSelected = (hjemler: string[]) => setHjemler({ hjemler, oppgaveId: oppgave.id });

  const onClick = async () => {
    await tildel({ oppgaveId: oppgave.id, navIdent: null });

    navigate('/mineoppgaver');
  };

  const hasFilter = options.length > 10;

  return (
    <StyledPopup>
      <StyledTitle>Endre hjemmel?</StyledTitle>
      {hasFilter ? (
        <>
          <StyledSearch
            label="Filtrer hjemlene"
            placeholder="Filtrer hjemlene"
            onChange={setSearch}
            value={search}
            size="small"
            variant="simple"
          />
          <StyledHr />
        </>
      ) : null}
      <FilterContainer $count={options.length}>
        <FilterList options={filteredOptions} selected={oppgave.hjemmelIdList} onChange={setSelected} />
      </FilterContainer>
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

const StyledHr = styled.hr`
  margin: 0;
  border: none;
  border-bottom: 1px solid var(--a-border-divider);
`;

const StyledSearch = styled(Search)`
  padding-left: 8px;
  padding-right: 8px;
  padding-bottom: 6px;
`;

const FilterContainer = styled.div<{ $count: number }>`
  height: ${({ $count }) => `min(50vh, ${$count * 32}px)`};
  overflow-y: auto;
`;

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
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
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
