import { OppgaveRow } from '@app/components/common-table-components/oppgave-rows/oppgave-row';
import { OppgaveTable } from '@app/components/common-table-components/oppgave-table/oppgave-table';
import { TablePlainHeaders } from '@app/components/common-table-components/oppgave-table/oppgave-table-headers';
import { ColumnKeyEnum } from '@app/components/common-table-components/types';
/*
 * We have the following dependency cycle:
 * Relevant oppgaver -> Oppgaver table -> Oppgave table -> Rows -> Row -> Relevant oppgaver
 * In short: A table row that has its own table, and a table that has rows.
 * This is a recursive structure by nature, and resolving the import cycle does not seem possible without combining everything in one file.
 * Leaving the cycle should be safe however, as the cycle is only between (top-level) React components.
 */
import { formatFoedselsnummer } from '@app/functions/format-id';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { pushEvent } from '@app/observability';
import { useGetSakenGjelderQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { useGetRelevantOppgaverQuery } from '@app/redux-api/oppgaver/queries/oppgaver';
import { FolderFileIcon } from '@navikt/aksel-icons';
import { Button, type ButtonProps, Heading, Loader, Modal, Table, Tooltip } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

interface Props {
  oppgaveId: string;
  size?: ButtonProps['size'];
}

const EMPTY_LIST: string[] = [];
const CURRENT_TEST_ID = 'relevant-current-oppgave-table';

export const RelevantOppgaver = ({ oppgaveId, size = 'small' }: Props) => {
  const location = useLocation();
  const modalRef = useRef<HTMLDialogElement>(null);
  const { data: sakenGjelder, isLoading: isOppgaveLoading } = useGetSakenGjelderQuery(oppgaveId);
  const { data, isLoading, refetch, isFetching, isError } = useGetRelevantOppgaverQuery(oppgaveId);

  const uferdigeOppgaverIdList = data?.aapneBehandlinger ?? EMPTY_LIST;
  const ventendeOppgaverIdList = data?.paaVentBehandlinger ?? EMPTY_LIST;
  const totalCount = uferdigeOppgaverIdList.length + ventendeOppgaverIdList.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: React to changes in location.
  useEffect(() => {
    modalRef.current?.close();
  }, [location.pathname]);

  if (!isLoading && totalCount === 0) {
    return null;
  }

  const fnr = formatFoedselsnummer(sakenGjelder?.id);
  const name = sakenGjelder?.name ?? '';
  const heading = `${totalCount} andre pågående oppgaver for ${name} (${fnr})`;
  const tooltip = totalCount === 1 ? '1 annen pågående oppgave' : `${totalCount} andre pågående oppgaver`;

  return (
    <>
      <Tooltip content={tooltip}>
        <Button
          size={size}
          variant="secondary-neutral"
          loading={isLoading}
          onClick={() => {
            pushEvent('open-relevant-oppgaver', 'oppgave-lists', { enabled: 'true' });
            modalRef.current?.showModal();
          }}
          icon={<FolderFileIcon aria-hidden />}
        >
          {totalCount.toString(10)}
        </Button>
      </Tooltip>

      <Modal header={{ heading }} width="2000px" closeOnBackdropClick ref={modalRef}>
        <Modal.Body className="flex flex-col gap-y-4">
          {isOppgaveLoading || sakenGjelder === undefined ? (
            <Loader />
          ) : (
            <section>
              <Heading size="small">Denne oppgaven</Heading>
              <Table>
                <Table.Header data-testid={`${CURRENT_TEST_ID}-header`}>
                  <Table.Row>
                    <TablePlainHeaders columnKeys={UFERDIGE_COLUMNS} />
                  </Table.Row>
                </Table.Header>
                <Table.Body data-testid={`${CURRENT_TEST_ID}-rows`} data-state="ready" data-empty="false">
                  <OppgaveRow columns={UFERDIGE_COLUMNS} oppgaveId={oppgaveId} testId={`${CURRENT_TEST_ID}-row`} />
                </Table.Body>
              </Table>
            </section>
          )}

          <section>
            <Heading size="small">Andre oppgaver</Heading>
            <OppgaveTable
              behandlinger={uferdigeOppgaverIdList}
              settingsKey={OppgaveTableRowsPerPage.RELEVANT_ACTIVE}
              data-testid="relevant-uferdige-oppgaver-table"
              columns={UFERDIGE_COLUMNS}
              refetch={refetch}
              isLoading={isLoading}
              isFetching={isFetching}
              isError={isError}
            />
          </section>

          <section>
            <Heading size="small">Oppgaver på vent</Heading>
            <OppgaveTable
              behandlinger={ventendeOppgaverIdList}
              settingsKey={OppgaveTableRowsPerPage.RELEVANT_ACTIVE}
              data-testid="relevant-ventende-oppgaver-table"
              columns={VENTENDE_COLUMNS}
              refetch={refetch}
              isLoading={isLoading}
              isFetching={isFetching}
              isError={isError}
            />
          </section>
        </Modal.Body>
      </Modal>
    </>
  );
};

const UFERDIGE_COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeWithAnkeITrygderetten,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Innsendingshjemler,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.VarsletFrist,
  ColumnKeyEnum.OpenWithYtelseAccess,
  ColumnKeyEnum.OppgavestyringNonFilterable,
];

const VENTENDE_COLUMNS: ColumnKeyEnum[] = [
  ColumnKeyEnum.TypeWithAnkeITrygderetten,
  ColumnKeyEnum.Ytelse,
  ColumnKeyEnum.Innsendingshjemler,
  ColumnKeyEnum.Saksnummer,
  ColumnKeyEnum.Age,
  ColumnKeyEnum.Deadline,
  ColumnKeyEnum.VarsletFrist,
  ColumnKeyEnum.PaaVentTil,
  ColumnKeyEnum.PaaVentReason,
  ColumnKeyEnum.Utfall,
  ColumnKeyEnum.OpenWithYtelseAccess,
  ColumnKeyEnum.OppgavestyringNonFilterable,
];
