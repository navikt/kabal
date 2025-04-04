import { Type } from '@app/components/type/type';
import { isoDateTimeToPretty } from '@app/domain/date';
import { ENVIRONMENT } from '@app/environment';
import { type Task, useGetMerkantilTasksQuery } from '@app/redux-api/internal';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { ArrowsCirclepathIcon, ExternalLinkIcon } from '@navikt/aksel-icons';
import { Alert, Button, CopyButton, HStack, Heading, Skeleton, Table, Tooltip, VStack } from '@navikt/ds-react';
import { Link } from 'react-router-dom';

export const MerkantilTaskList = () => {
  const { isLoading, isFetching, refetch } = useGetMerkantilTasksQuery();

  return (
    <section>
      <Heading level="1" size="medium" spacing>
        <HStack>
          <span>Merkantile oppgaver</span>
          <Tooltip content="Oppdater">
            <Button
              onClick={refetch}
              loading={isLoading || isFetching}
              size="small"
              variant="tertiary-neutral"
              icon={<ArrowsCirclepathIcon aria-hidden />}
            />
          </Tooltip>
        </HStack>
      </Heading>

      <TaskList />
    </section>
  );
};

const TaskList = () => {
  const { data: tasks = [], isLoading, isError, error } = useGetMerkantilTasksQuery();

  if (isError) {
    return (
      <VStack gap="4">
        <HStack gap="4">
          <Alert variant="error" size="small">
            <Heading level="2" size="small" spacing>
              Noe gikk galt
            </Heading>
            <code className="block whitespace-pre-wrap rounded-lg bg-surface-neutral-subtle p-4">
              {JSON.stringify(error, null, 2)}
            </code>
          </Alert>
        </HStack>
      </VStack>
    );
  }

  if (isLoading) {
    return (
      <VStack gap="4">
        <HStack gap="4">
          <Skeleton variant="rounded" height={32} width={120} />
          <Skeleton variant="rounded" height={32} width={200} />
        </HStack>

        <VStack>
          <SkeletonRow height={32} />
          <SkeletonRow height={48} />
          <SkeletonRow height={48} />
          <SkeletonRow height={48} />
          <SkeletonRow height={48} />
          <SkeletonRow height={48} />
          <SkeletonRow height={48} />
          <SkeletonRow height={48} />
          <SkeletonRow height={48} />
          <SkeletonRow height={48} />
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack gap="4">
      <HStack gap="4">
        <CopyButton size="small" copyText={tasks.map(toCopyLine).join('\n')} text="Kopier alle" variant="action" />
        <CopyButton
          size="small"
          copyText={tasks
            .filter(({ dateHandled }) => dateHandled === null)
            .map(toCopyLine)
            .join('\n')}
          text="Kopier alle uhåndterte"
          variant="action"
        />
      </HStack>
      <Table zebraStripes size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="whitespace-nowrap">Opprettet</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap">Type</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap">Behandling ID</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap">Årsak</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap">Behandlet dato</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap">Behandlet av</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap">Behandlet av navn</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap">Kommentar</Table.HeaderCell>
            <Table.HeaderCell className="whitespace-nowrap" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tasks.map(
            ({ id, created, typeId, behandlingId, reason, dateHandled, handledBy, handledByName, comment }) => (
              <Table.Row key={id}>
                <Table.DataCell>{isoDateTimeToPretty(created)}</Table.DataCell>
                <Table.DataCell>
                  <Type type={typeId} />
                </Table.DataCell>
                <Table.DataCell>
                  <CopyButton size="small" copyText={behandlingId} text={behandlingId} />
                </Table.DataCell>
                <Table.DataCell>{reason}</Table.DataCell>
                <Table.DataCell>{isoDateTimeToPretty(dateHandled)}</Table.DataCell>
                <Table.DataCell>{handledBy}</Table.DataCell>
                <Table.DataCell>{handledByName}</Table.DataCell>
                <Table.DataCell>{comment}</Table.DataCell>
                <Table.DataCell>
                  <Button
                    as={Link}
                    to={getPath(behandlingId, typeId)}
                    variant="primary"
                    size="small"
                    target="_blank"
                    icon={<ExternalLinkIcon aria-hidden />}
                  >
                    Åpne
                  </Button>
                </Table.DataCell>
              </Table.Row>
            ),
          )}
        </Table.Body>
        <tfoot className="italic">
          <Table.Row>
            <Table.DataCell colSpan={999}>Totalt {tasks.length} oppgaver</Table.DataCell>
          </Table.Row>
        </tfoot>
      </Table>
    </VStack>
  );
};

const SkeletonRow = ({ height }: { height: number }) => (
  <HStack gap="2" wrap={false}>
    <Skeleton variant="text" height={height} width={162} />
    <Skeleton variant="text" height={height} width={62} />
    <Skeleton variant="text" height={height} width={352} />
    <Skeleton variant="text" height={height} width={620} />
    <Skeleton variant="text" height={height} width={132} />
    <Skeleton variant="text" height={height} width={116} />
    <Skeleton variant="text" height={height} width={158} />
    <Skeleton variant="text" height={height} width={104} />
    <Skeleton variant="text" height={height} width={105} />
  </HStack>
);
const DOMAIN = ENVIRONMENT.isProduction ? 'https://kabal.intern.nav.no' : 'https://kabal.intern.dev.nav.no';

const TYPE_TO_PATH: Record<SaksTypeEnum, string> = {
  [SaksTypeEnum.KLAGE]: 'klagebehandling',
  [SaksTypeEnum.ANKE]: 'ankebehandling',
  [SaksTypeEnum.ANKE_I_TRYGDERETTEN]: 'trygderettsankebehandling',
  [SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET]: 'behandling-etter-tr-opphevet',
  [SaksTypeEnum.OMGJØRINGSKRAV]: 'omgjøringskravbehandling',
};

const toCopyLine = ({ typeId, behandlingId, reason }: Task) => `${getUrl(behandlingId, typeId)} - ${reason}`;

type UrlFn = (id: string, typeId: SaksTypeEnum) => string;

const getUrl: UrlFn = (...args) => `${DOMAIN}${getPath(...args)}`;
const getPath: UrlFn = (id, typeId) => `/${TYPE_TO_PATH[typeId]}/${id}`;
