import type { ListGosysOppgave } from '@app/types/oppgavebehandling/oppgavebehandling';
import { type ColumnHeaderProps, Table } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  sortable?: boolean;
  showFerdigstilt: boolean;
}

export const TableHeader = ({ sortable, showFerdigstilt }: Props) => {
  return (
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeader />

        <HeaderCell sortable={sortable} sortKey="gjelder">
          Gjelder
        </HeaderCell>
        <HeaderCell sortable={sortable} sortKey="temaId">
          Tema
        </HeaderCell>
        {showFerdigstilt ? (
          <HeaderCell sortable={sortable} sortKey="ferdigstiltTidspunkt">
            Ferdigstilt
          </HeaderCell>
        ) : null}
        <HeaderCell sortable={sortable} sortKey="fristFerdigstillelse">
          Frist
        </HeaderCell>
        <HeaderCell sortable={sortable} sortKey="oppgavetype">
          Oppgavetype
        </HeaderCell>
        <HeaderCell sortable={sortable} sortKey="opprettetAv">
          Opprettet av
        </HeaderCell>
        <HeaderCell sortable={sortable} sortKey="opprettetAvEnhet">
          Opprettet av enhet
        </HeaderCell>
        <HeaderCell sortable={sortable} sortKey="tildeltEnhetsnr">
          Tildelt enhet
        </HeaderCell>

        <Table.ColumnHeader />
      </Table.Row>
    </Table.Header>
  );
};

interface HeaderCellProps extends Omit<ColumnHeaderProps, 'sortKey'> {
  sortKey: keyof ListGosysOppgave;
}

const HeaderCell = ({ sortKey, sortable, children }: HeaderCellProps) => (
  <StyledColumnHeader sortable={sortable} sortKey={sortKey}>
    {children}
  </StyledColumnHeader>
);

const StyledColumnHeader = styled(Table.ColumnHeader)`
  white-space: nowrap;
`;
