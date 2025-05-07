import { isoDateTimeToPrettyDate } from '@app/domain/date';
import { CopyButton, HStack } from '@navikt/ds-react';
import type { HTMLAttributes } from 'react';

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  date: string | null;
}

export const DocumentDate = ({ date, ...attrs }: Props) =>
  date === null ? (
    'Ikke satt'
  ) : (
    <HStack {...attrs} gap="2" overflow="hidden" className="group select-none text-ellipsis">
      <time dateTime={date}>{isoDateTimeToPrettyDate(date)}</time>

      <CopyButton
        copyText={isoDateTimeToPrettyDate(date) ?? date}
        title="Kopier dato"
        size="xsmall"
        className="opacity-0 group-hover:opacity-100"
      />
    </HStack>
  );
