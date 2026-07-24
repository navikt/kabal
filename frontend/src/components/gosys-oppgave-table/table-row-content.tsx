import { Button, HStack, Table, Tag, Tooltip } from '@navikt/ds-react';
import {
  CheckmarkCircleFillIconColored,
  ExclamationmarkTriangleFillIconColored,
} from '@/components/colored-icons/colored-icons';
import { CopyIdButton } from '@/components/copy-button/copy-id-button';
import { GosysBeskrivelseTabs } from '@/components/gosys/beskrivelse/beskrivelse-tabs';
import { isoDateTimeToPretty, isoDateToPretty } from '@/domain/date';
import { useFullTemaNameFromIdOrLoading } from '@/hooks/use-kodeverk-ids';
import { useSearchEnheterQuery } from '@/redux-api/search';
import type { INavEmployee } from '@/types/bruker';
import { GosysStatus, type ListGosysOppgave } from '@/types/oppgavebehandling/oppgavebehandling';

interface TableRowContentProps {
  onSelect: (gosysOppgave: ListGosysOppgave) => void;
  gosysOppgave: ListGosysOppgave;
  selected: boolean;
  showFerdigstilt?: boolean;
  canEdit?: boolean;
  isLoading: boolean;
}

export const TableRowContent = ({
  onSelect,
  gosysOppgave,
  selected,
  showFerdigstilt,
  canEdit,
  isLoading,
}: TableRowContentProps) => {
  const temaName = useFullTemaNameFromIdOrLoading(gosysOppgave.temaId);

  return (
    <Table.ExpandableRow
      selected={selected}
      content={<GosysBeskrivelseTabs beskrivelse={gosysOppgave.beskrivelse} />}
      shadeOnHover
      expandOnRowClick
      className={
        !selected && gosysOppgave.status === GosysStatus.FEILREGISTRERT
          ? 'bg-ax-bg-danger-moderate hover:bg-ax-bg-danger-moderate-hover'
          : undefined
      }
    >
      <Table.DataCell>
        {gosysOppgave.gjelder === null ? null : (
          <Tag data-color="success" size="small" variant="outline">
            {gosysOppgave.gjelder}
          </Tag>
        )}
      </Table.DataCell>
      <Table.DataCell>
        <Tag data-color="meta-purple" size="small" variant="outline">
          {temaName}
        </Tag>
      </Table.DataCell>
      {showFerdigstilt ? <TimeCell time={gosysOppgave.ferdigstiltTidspunkt} /> : null}
      <DateCell date={gosysOppgave.fristFerdigstillelse} />
      <Table.DataCell>
        <Tag data-color="info" size="small" variant="outline">
          {gosysOppgave.oppgavetype}
        </Tag>
      </Table.DataCell>
      <Table.DataCell>
        <Employee employee={gosysOppgave.opprettetAv} />
      </Table.DataCell>
      <Table.DataCell>
        {gosysOppgave.opprettetAvEnhet === null ? null : (
          <Tag data-color="meta-purple" size="small" variant="outline">
            {gosysOppgave.opprettetAvEnhet.navn} ({gosysOppgave.opprettetAvEnhet.enhetsnr})
          </Tag>
        )}
      </Table.DataCell>
      <Table.DataCell>
        <Enhet enhet={gosysOppgave.tildeltEnhetsnr} />
      </Table.DataCell>
      <Table.DataCell>{gosysOppgave.mappe?.navn}</Table.DataCell>
      <Table.DataCell>
        <Selection
          gosysOppgave={gosysOppgave}
          selected={selected}
          onSelect={() => onSelect(gosysOppgave)}
          isSelecting={isLoading}
          canEdit={canEdit}
        />
      </Table.DataCell>
    </Table.ExpandableRow>
  );
};

interface SelectionProps {
  gosysOppgave: ListGosysOppgave;
  selected: boolean;
  onSelect: () => void;
  canEdit?: boolean;
  isSelecting: boolean;
}

const Selection = ({ gosysOppgave, selected, onSelect, canEdit, isSelecting }: SelectionProps) => {
  if (selected) {
    return (
      <Tooltip content="Valgt">
        <div className="flex items-center justify-center">
          <CheckmarkCircleFillIconColored aria-hidden />
        </div>
      </Tooltip>
    );
  }

  if (gosysOppgave.alreadyUsedBy !== null) {
    return (
      <Tooltip content="Tilknyttet annen behandling">
        <div className="flex justify-center">
          <ExclamationmarkTriangleFillIconColored aria-hidden />
        </div>
      </Tooltip>
    );
  }

  if (!canEdit) {
    return null;
  }

  return (
    <Button data-color="neutral" size="small" variant="tertiary" onClick={onSelect} loading={isSelecting}>
      Velg
    </Button>
  );
};

export const Enhet = ({ enhet }: { enhet: string }) => {
  const { data: enheter } = useSearchEnheterQuery({});

  if (enheter === undefined) {
    return (
      <Tag data-color="meta-purple" size="small" variant="outline">
        Laster...
      </Tag>
    );
  }

  const resolvedEnhet = enheter.find((e) => e.enhetsnr === enhet);

  if (resolvedEnhet !== undefined) {
    return (
      <Tag data-color="meta-purple" size="small" variant="outline">
        {resolvedEnhet.navn ?? 'Ukjent enhet'} ({enhet})
      </Tag>
    );
  }

  return (
    <Tag data-color="neutral" size="small" variant="outline">
      {enhet}
    </Tag>
  );
};

export const Employee = ({ employee }: { employee: INavEmployee | null }) => {
  if (employee === null) {
    return null;
  }

  return (
    <HStack gap="space-8">
      <span>{employee.navn}</span>
      <CopyIdButton id={employee.navIdent} size="xsmall" />
    </HStack>
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
