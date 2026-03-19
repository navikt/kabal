import { Box } from '@navikt/ds-react';
import { formatEmployeeNameAndIdFallback } from '@/domain/employee-name';
import { formatIdNumber } from '@/functions/format-id';
import type { INavEmployee } from '@/types/bruker';
import type { IHistory, IPart } from '@/types/oppgavebehandling/response';

type KeySource = Pick<IHistory, 'type' | 'timestamp'>;

export const toKey = (event: KeySource) => `${event.type}:${event.timestamp}`;

export const employeeName = (employee: INavEmployee | null, fallback = '[Ukjent bruker]') => (
  <b>{formatEmployeeNameAndIdFallback(employee, fallback)}</b>
);

export const QUEUE = <b>felles kø</b>;
export const SELF = <b>seg selv</b>;

export const partName = ({ name, identifikator }: IPart) => (
  <b>
    {name === null ? 'Navn mangler' : name}
    {identifikator === null ? null : ` (${formatIdNumber(identifikator)})`}
  </b>
);

interface ReasonProps {
  id: string;
  children: React.ReactNode;
}

export const Reason = ({ id, children }: ReasonProps) => (
  <Box
    as="p"
    id={id}
    className="italic"
    paddingInline="space-4 space-0"
    borderWidth="0 0 0 4"
    borderColor="neutral-subtle"
  >
    {children}
  </Box>
);
