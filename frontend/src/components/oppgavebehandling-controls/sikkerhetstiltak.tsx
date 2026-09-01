import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Tag, type TagProps, Tooltip } from '@navikt/ds-react';
import type { ISikkerhetstiltak } from '@/types/oppgavebehandling/oppgavebehandling';

interface Props {
  sikkerhetstiltak: Pick<ISikkerhetstiltak, 'beskrivelse'> | null;
  size?: TagProps['size'];
}

export const Sikkerhetstiltak = ({ sikkerhetstiltak, size }: Props) => {
  if (sikkerhetstiltak === null) {
    return null;
  }

  return (
    <Tooltip content={sikkerhetstiltak.beskrivelse}>
      <Tag variant="warning" size={size} className="flex max-w-75 items-center gap-1 truncate">
        <ExclamationmarkTriangleFillIcon aria-hidden className="shrink-0" />
        <span className="truncate">{sikkerhetstiltak.beskrivelse}</span>
      </Tag>
    </Tooltip>
  );
};
