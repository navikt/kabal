import { ArrowsCirclepathIcon, ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Heading, HStack, Modal, Table } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useMemo, useState } from 'react';
import { LoadingTable } from '@/components/behandling/behandlingsdetaljer/select-gosys-oppgave/loading-table';
import { Row } from '@/components/behandling/behandlingsdetaljer/select-gosys-oppgave/row';
import { SelectedGosysOppgave } from '@/components/behandling/behandlingsdetaljer/select-gosys-oppgave/selected-gosys-oppgave';
import { TableHeader } from '@/components/gosys-oppgave-table/table-header';
import { getDirection, isKeyofGosysOppgave, type ScopedSortState, sortGosysOppgaver } from '@/domain/gosys-oppgaver';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { usePushEvent } from '@/observability';
import { useGetGosysOppgaveListQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { useSearchEnheterQuery } from '@/redux-api/search';
import type { ListGosysOppgave } from '@/types/oppgavebehandling/oppgavebehandling';

interface SelectGosysOppgaveModalProps {
  hasGosysOppgave: boolean;
}

export const SelectGosysOppgaveModal = ({ hasGosysOppgave }: SelectGosysOppgaveModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pushEvent = usePushEvent();
  const canEdit = useIsTildeltSaksbehandler();

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
      <Button data-color="neutral" variant="secondary" size="small" onClick={onClick}>
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
          <Button
            data-color="neutral"
            variant="secondary"
            size="small"
            onClick={() => setIsOpen(false)}
            className="self-start"
          >
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
      <HStack gap="space-16">
        <Button
          data-color="neutral"
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
            data-color="neutral"
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
  const canEdit = useIsTildeltSaksbehandler();

  const handleSort = (sortKey: string) => {
    if (!isKeyofGosysOppgave(sortKey)) {
      return;
    }

    setSort({ orderBy: sortKey, direction: getDirection(sort, sortKey) });
  };

  const sortedOppgaver: ListGosysOppgave[] = useMemo(
    () => sortGosysOppgaver(oppgaver, sort, enheter),
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
        <TableHeader sortable showFerdigstilt={showFerdigstilt} />

        <Table.Body>
          {sortedOppgaver.map((d) => (
            <Row
              key={d.id}
              gosysOppgave={d}
              selectedGosysOppgave={selectedGosysOppgave}
              oppgaveId={oppgaveId}
              showFerdigstilt={showFerdigstilt}
              canEdit={canEdit}
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

export const Header = ({ children, refetch, isFetching = false }: HeaderProps) => (
  <Heading level="1" size="xsmall" spacing>
    <HStack align="center" justify="start" gap="space-8">
      <span>{children}</span>
      {refetch === undefined ? null : (
        <Button
          data-color="neutral"
          variant="tertiary"
          size="xsmall"
          onClick={refetch}
          loading={isFetching}
          icon={<ArrowsCirclepathIcon aria-hidden />}
        />
      )}
    </HStack>
  </Heading>
);
