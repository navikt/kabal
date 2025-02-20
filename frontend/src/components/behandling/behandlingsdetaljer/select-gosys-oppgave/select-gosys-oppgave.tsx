import { LoadingTable } from '@app/components/behandling/behandlingsdetaljer/select-gosys-oppgave/loading-table';
import { Row } from '@app/components/behandling/behandlingsdetaljer/select-gosys-oppgave/row';
import { SelectedGosysOppgave } from '@app/components/behandling/behandlingsdetaljer/select-gosys-oppgave/selected-gosys-oppgave';
import { TableHeader } from '@app/components/behandling/behandlingsdetaljer/select-gosys-oppgave/table-header';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { usePushEvent } from '@app/observability';
import { useGetGosysOppgaveListQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { useSearchEnheterQuery } from '@app/redux-api/search';
import type { INavEmployee } from '@app/types/bruker';
import type { Enhet, ListGosysOppgave } from '@app/types/oppgavebehandling/oppgavebehandling';
import { ArrowsCirclepathIcon, ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading, Modal, Table } from '@navikt/ds-react';
import type { SortState } from '@navikt/ds-react/Table';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useMemo, useState } from 'react';

interface ScopedSortState extends SortState {
  orderBy: keyof ListGosysOppgave;
}

const getDirection = (sortState: ScopedSortState, sortKey: keyof ListGosysOppgave): SortState['direction'] => {
  if (sortState.orderBy !== sortKey) {
    return 'ascending';
  }

  return sortState.direction === 'ascending' ? 'descending' : 'ascending';
};

const isINavEmployee = (_: unknown, key: string): _ is INavEmployee => key === 'opprettetAv' || key === 'endretAv';

const sortData = (
  data: ListGosysOppgave[],
  { direction, orderBy }: ScopedSortState,
  enheter: Enhet[],
): ListGosysOppgave[] =>
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  data.sort((a, b) => {
    const aVal = a[orderBy];
    const bVal = b[orderBy];

    if (aVal === null) {
      return bVal === null ? 0 : 1;
    }

    if (bVal === null) {
      return -1;
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'ascending' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'ascending' ? aVal - bVal : bVal - aVal;
    }

    if (orderBy === 'opprettetAvEnhet') {
      const aEnhet = `${a.opprettetAvEnhet?.navn ?? ''} (${a.opprettetAvEnhet?.enhetsnr ?? ''})`;
      const bEnhet = `${b.opprettetAvEnhet?.navn ?? ''} (${b.opprettetAvEnhet?.enhetsnr ?? ''})`;

      return direction === 'ascending' ? aEnhet.localeCompare(bEnhet) : bEnhet.localeCompare(aEnhet);
    }

    if (orderBy === 'tildeltEnhetsnr') {
      const aEnhetName = enheter.find((e) => e.enhetsnr === aVal)?.navn ?? '';
      const bEnhetName = enheter.find((e) => e.enhetsnr === bVal)?.navn ?? '';

      const aEnhet = `${aEnhetName} (${aVal})`;
      const bEnhet = `${bEnhetName} (${bVal})`;

      return direction === 'ascending' ? aEnhet.localeCompare(bEnhet) : bEnhet.localeCompare(aEnhet);
    }

    if (orderBy === 'opprettetAv' || orderBy === 'endretAv') {
      const aName = isINavEmployee(aVal, orderBy) ? aVal.navn : '';
      const bName = isINavEmployee(bVal, orderBy) ? bVal.navn : '';

      return direction === 'ascending' ? aName.localeCompare(bName) : bName.localeCompare(aName);
    }

    return 0;
  });

interface SelectGosysOppgaveModalProps {
  hasGosysOppgave: boolean;
}

export const SelectGosysOppgaveModal = ({ hasGosysOppgave }: SelectGosysOppgaveModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pushEvent = usePushEvent();
  const canEdit = useCanEdit();

  if (!(canEdit || hasGosysOppgave)) {
    return null;
  }

  const onClick = () => {
    setIsOpen(true);
    pushEvent('open-gosys-oppgave-modal', { hasGosysOppgave: hasGosysOppgave.toString() });
  };

  const text = getText(canEdit, hasGosysOppgave);

  return (
    <>
      <Button variant="secondary" size="small" onClick={onClick}>
        {text}
      </Button>

      <Modal
        aria-label={text}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        header={{ heading: text, closeButton: true }}
        closeOnBackdropClick
        width="90%"
      >
        <Modal.Body className="flex flex-col gap-4 p-6">
          {canEdit ? <SelectGosysOppgave /> : <SelectedGosysOppgave />}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" size="small" onClick={() => setIsOpen(false)} className="self-start">
            Lukk
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const getText = (canEdit: boolean, hasGosysOppgave: boolean) => {
  if (!canEdit) {
    return 'Se oppgave fra Gosys';
  }

  if (hasGosysOppgave) {
    return 'Se/bytt oppgave fra Gosys';
  }

  return 'Velg oppgave fra Gosys';
};

interface Lists {
  openOppgaveList: ListGosysOppgave[];
  otherOppgaveList: ListGosysOppgave[];
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
const SelectGosysOppgave = () => {
  const { data: oppgave } = useOppgave();
  const { data, isLoading, isSuccess, refetch, isFetching } = useGetGosysOppgaveListQuery(oppgave?.id ?? skipToken);
  const selected = oppgave?.gosysOppgaveId ?? null;
  const hasGosysOppgaveId = selected !== null;
  const [showOpen, setShowOpen] = useState(!hasGosysOppgaveId);
  const [showOther, setShowOther] = useState(false);
  const pushEvent = usePushEvent();

  useEffect(() => {
    if (!hasGosysOppgaveId) {
      setShowOpen(true);
    }
  }, [hasGosysOppgaveId]);

  const selectedGosysOppgave = useMemo(() => data?.find(({ id }) => id === selected), [data, selected]);

  const { openOppgaveList, otherOppgaveList } = useMemo<Lists>(() => {
    const openOppgaveList: ListGosysOppgave[] = [];
    const otherOppgaveList: ListGosysOppgave[] = [];

    if (!isSuccess) {
      return { openOppgaveList, otherOppgaveList };
    }

    for (const oppgave of data) {
      if (oppgave.editable) {
        openOppgaveList.push(oppgave);
      } else {
        otherOppgaveList.push(oppgave);
      }
    }

    return { openOppgaveList, otherOppgaveList };
  }, [data, isSuccess]);

  if (isLoading) {
    return <LoadingTable />;
  }

  if (!isSuccess || oppgave === undefined) {
    return null;
  }

  const onShowOpenClick = () => {
    const eventName = showOpen ? 'hide-open-gosys-oppgaver' : 'show-open-gosys-oppgaver';

    pushEvent(eventName, {
      hasGosysOppgave: hasGosysOppgaveId.toString(),
      selectedGosysOppgaveStatus: selectedGosysOppgave?.status ?? 'NONE',
      showOpen: (!showOpen).toString(),
    });

    if (showOpen) {
      setShowOpen(false);
      setShowOther(false);
    } else {
      setShowOpen(true);
    }
  };

  const onShowOtherClick = () => {
    const eventName = showOther ? 'hide-other-gosys-oppgaver' : 'show-other-gosys-oppgaver';

    pushEvent(eventName, {
      hasGosysOppgave: hasGosysOppgaveId.toString(),
      selectedGosysOppgaveStatus: selectedGosysOppgave?.status ?? 'NONE',
      showOther: (!showOther).toString(),
    });

    setShowOther(!showOther);
  };

  return (
    <>
      <HStack gap="4">
        <Button
          variant="secondary"
          size="small"
          onClick={onShowOpenClick}
          className="self-start"
          disabled={showOpen && !hasGosysOppgaveId}
        >
          {showOpen ? 'Vis bare valgt' : 'Bytt oppgave'}
        </Button>

        {showOpen ? (
          <Button
            variant="secondary"
            size="small"
            onClick={onShowOtherClick}
            className="self-start"
            icon={showOther ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
          >
            {showOther
              ? 'Skjul ferdigstilte og feilregistrerte oppgaver'
              : 'Vis ferdigstilte og feilregistrerte oppgaver'}
          </Button>
        ) : null}
      </HStack>

      <SortableTable
        heading={
          showOpen || selectedGosysOppgave === undefined ? `Åpne oppgaver (${openOppgaveList.length})` : 'Valgt oppgave'
        }
        fallback="Ingen åpne oppgaver."
        oppgaver={showOpen || selectedGosysOppgave === undefined ? openOppgaveList : [selectedGosysOppgave]}
        selectedGosysOppgave={selectedGosysOppgave}
        oppgaveId={oppgave.id}
        refetch={showOpen || selectedGosysOppgave === undefined ? refetch : undefined}
        isFetching={isFetching}
      />

      {showOther ? (
        <SortableTable
          heading={`Ferdigstilte og feilregistrerte oppgaver (${otherOppgaveList.length})`}
          fallback="Ingen ferdigstilte eller feilregistrerte oppgaver."
          oppgaver={otherOppgaveList}
          selectedGosysOppgave={selectedGosysOppgave}
          oppgaveId={oppgave.id}
          showFerdigstilt
          refetch={refetch}
          isFetching={isFetching}
        />
      ) : null}
    </>
  );
};

interface SortableTableProps {
  heading: string;
  fallback?: string;
  oppgaver: ListGosysOppgave[];
  selectedGosysOppgave: ListGosysOppgave | undefined;
  oppgaveId: string;
  showFerdigstilt?: boolean;
  refetch?: () => void;
  isFetching?: boolean;
}

const SortableTable = ({
  oppgaver,
  selectedGosysOppgave,
  oppgaveId,
  heading,
  showFerdigstilt = false,
  fallback,
  refetch,
  isFetching,
}: SortableTableProps) => {
  const { data: enheter = [] } = useSearchEnheterQuery({});
  const [sort, setSort] = useState<ScopedSortState>({ direction: 'ascending', orderBy: 'opprettetTidspunkt' });

  const handleSort = (sortKey: string) => {
    if (!isKeyofGosysOppgave(sortKey)) {
      return;
    }

    setSort({ orderBy: sortKey, direction: getDirection(sort, sortKey) });
  };

  const sortedOppgaver: ListGosysOppgave[] = useMemo(
    () => sortData(oppgaver, sort, enheter),
    [oppgaver, sort, enheter],
  );

  if (oppgaver.length === 0 && fallback !== undefined) {
    return (
      <section>
        <Header refetch={refetch} isFetching={isFetching}>
          {heading}
        </Header>

        <span className="italic">{fallback}</span>
      </section>
    );
  }

  return (
    <section>
      <Header refetch={refetch} isFetching={isFetching}>
        {heading}
      </Header>

      <Table size="small" zebraStripes onSortChange={handleSort} sort={sort}>
        <TableHeader showFerdigstilt={showFerdigstilt} />

        <Table.Body>
          {sortedOppgaver.map((d) => (
            <Row
              key={d.id}
              gosysOppgave={d}
              selectedGosysOppgave={selectedGosysOppgave}
              oppgaveId={oppgaveId}
              showFerdigstilt={showFerdigstilt}
            />
          ))}
        </Table.Body>
      </Table>
    </section>
  );
};

interface HeaderProps {
  children: string;
  refetch?: () => void;
  isFetching?: boolean;
}

const Header = ({ children, refetch, isFetching = false }: HeaderProps) => (
  <Heading level="1" size="xsmall" spacing>
    <HStack align="center" justify="start" gap="2">
      <span>{children}</span>
      {refetch === undefined ? null : (
        <Button
          variant="tertiary-neutral"
          size="xsmall"
          onClick={refetch}
          loading={isFetching}
          icon={<ArrowsCirclepathIcon aria-hidden />}
        />
      )}
    </HStack>
  </Heading>
);

const GOSYS_OPPGAVE_KEYS: (keyof ListGosysOppgave)[] = [
  'id',
  'tildeltEnhetsnr',
  'endretAvEnhetsnr',
  'endretAv',
  'endretTidspunkt',
  'opprettetAv',
  'opprettetTidspunkt',
  'beskrivelse',
  'temaId',
  'gjelder',
  'oppgavetype',
  'fristFerdigstillelse',
  'ferdigstiltTidspunkt',
  'status',
  'editable',
  'opprettetAvEnhet',
  'alreadyUsedBy',
];

const GOSYS_STATUS_KEY_STRINGS: string[] = GOSYS_OPPGAVE_KEYS.map((key) => key);

const isKeyofGosysOppgave = (key: string): key is keyof ListGosysOppgave => GOSYS_STATUS_KEY_STRINGS.includes(key);
