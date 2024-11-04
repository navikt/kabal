import {
  CheckmarkCircleFillIconColored,
  ExclamationmarkTriangleFillIconColored,
} from '@app/components/colored-icons/colored-icons';
import { CopyIdButton } from '@app/components/copy-button/copy-id-button';
import { GosysBeskrivelseTabs } from '@app/components/gosys/beskrivelse/beskrivelse-tabs';
import { isoDateTimeToPretty, isoDateToPretty } from '@app/domain/date';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useFullTemaNameFromIdOrLoading } from '@app/hooks/use-kodeverk-ids';
import { usePushEvent } from '@app/observability';
import { useSetGosysOppgaveMutation } from '@app/redux-api/oppgaver/mutations/set-gosys-oppgave';
import { useSearchEnheterQuery } from '@app/redux-api/search';
import type { INavEmployee } from '@app/types/bruker';
import { GosysStatus, type ListGosysOppgave } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Button, Table, Tag, Tooltip } from '@navikt/ds-react';
import { styled } from 'styled-components';

export interface Props {
  oppgaveId: string;
  selectedGosysOppgave: ListGosysOppgave | undefined;
  gosysOppgave: ListGosysOppgave;
  showFerdigstilt: boolean;
}

export const Row = ({ gosysOppgave, selectedGosysOppgave, oppgaveId, showFerdigstilt }: Props) => {
  const [setGosysOppgave, { isLoading }] = useSetGosysOppgaveMutation({ fixedCacheKey: oppgaveId });
  const temaName = useFullTemaNameFromIdOrLoading(gosysOppgave.temaId);
  const pushEvent = usePushEvent();

  const onSelect = () => {
    pushEvent('select-gosys-oppgave', {
      oppgaveId,
      nextGosysOppgaveStatus: gosysOppgave.status,
      previousGosysOppgaveStatus: selectedGosysOppgave?.status ?? 'NONE',
    });

    setGosysOppgave({ oppgaveId, gosysOppgaveId: gosysOppgave.id });
  };

  const selected = selectedGosysOppgave !== undefined && selectedGosysOppgave.id === gosysOppgave.id;

  return (
    <StatusRow
      $status={gosysOppgave.status}
      selected={selected}
      content={<GosysBeskrivelseTabs id={gosysOppgave.id} beskrivelse={gosysOppgave.beskrivelse} />}
      shadeOnHover
      expandOnRowClick
    >
      <Table.DataCell>
        {gosysOppgave.gjelder === null ? null : (
          <Tag size="small" variant="success">
            {gosysOppgave.gjelder}
          </Tag>
        )}
      </Table.DataCell>
      <Table.DataCell>
        <Tag size="small" variant="alt1">
          {temaName}
        </Tag>
      </Table.DataCell>

      {showFerdigstilt ? <TimeCell time={gosysOppgave.ferdigstiltTidspunkt} /> : null}
      <DateCell date={gosysOppgave.fristFerdigstillelse} />

      <Table.DataCell>
        <Tag size="small" variant="info">
          {gosysOppgave.oppgavetype}
        </Tag>
      </Table.DataCell>

      <Table.DataCell>
        <Employee employee={gosysOppgave.opprettetAv} />
      </Table.DataCell>
      <Table.DataCell>
        {gosysOppgave.opprettetAvEnhet === null ? null : (
          <Tag size="small" variant="alt1">
            {gosysOppgave.opprettetAvEnhet.navn} ({gosysOppgave.opprettetAvEnhet.enhetsnr})
          </Tag>
        )}
      </Table.DataCell>

      <Table.DataCell>
        <Enhet enhet={gosysOppgave.tildeltEnhetsnr} />
      </Table.DataCell>

      <Table.DataCell>
        <Selection selected={selected} gosysOppgave={gosysOppgave} onSelect={onSelect} isSelecting={isLoading} />
      </Table.DataCell>
    </StatusRow>
  );
};

interface SelectionProps {
  gosysOppgave: ListGosysOppgave;
  selected: boolean;
  onSelect: () => void;
  isSelecting: boolean;
}

const Selection = ({ gosysOppgave, selected, onSelect, isSelecting }: SelectionProps) => {
  const canEdit = useCanEdit();

  if (selected) {
    return (
      <Tooltip content="Valgt">
        <IconContainer aria-label="Valgt">
          <CheckmarkCircleFillIconColored aria-hidden />
        </IconContainer>
      </Tooltip>
    );
  }

  if (gosysOppgave.alreadyUsedBy !== null) {
    return (
      <Tooltip content="Tilknyttet annen behandling">
        <IconContainer>
          <ExclamationmarkTriangleFillIconColored aria-hidden />
        </IconContainer>
      </Tooltip>
    );
  }

  if (!canEdit) {
    return null;
  }

  return (
    <Button size="small" variant="tertiary" onClick={onSelect} loading={isSelecting}>
      Velg
    </Button>
  );
};

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Enhet = ({ enhet }: { enhet: string }) => {
  const { data: enheter } = useSearchEnheterQuery({});

  if (enheter === undefined) {
    return (
      <Tag size="small" variant="alt1">
        Laster...
      </Tag>
    );
  }

  const resolvedEnhet = enheter.find((e) => e.enhetsnr === enhet);

  if (resolvedEnhet !== undefined) {
    return (
      <Tag size="small" variant="alt1">
        {resolvedEnhet.navn ?? 'Ukjent enhet'} ({enhet})
      </Tag>
    );
  }

  return (
    <Tag size="small" variant="neutral">
      {enhet}
    </Tag>
  );
};

export const Employee = ({ employee }: { employee: INavEmployee | null }) => {
  if (employee === null) {
    return null;
  }

  return (
    <>
      <span>{employee.navn}</span>
      <CopyIdButton id={employee.navIdent} size="xsmall" />
    </>
  );
};

export const DateCell = ({ date }: { date: string | null }) => {
  if (date === null) {
    return <Table.DataCell />;
  }

  return (
    <Table.DataCell>
      <time dateTime={date}>{isoDateToPretty(date) ?? date}</time>
    </Table.DataCell>
  );
};

export const TimeCell = ({ time }: { time: string | null }) => {
  if (time === null) {
    return <Table.DataCell />;
  }

  return (
    <Table.DataCell>
      <time dateTime={time}>{isoDateTimeToPretty(time) ?? time}</time>
    </Table.DataCell>
  );
};

const StatusRow = styled(Table.ExpandableRow)<{ $status: GosysStatus }>`
  &&& {
    ${({ selected, $status }) => {
      if (selected) {
        return null;
      }

      if ($status === GosysStatus.FEILREGISTRERT) {
        return 'background-color: var(--a-surface-danger-subtle);';
      }
    }}}
`;
