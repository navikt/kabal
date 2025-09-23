import { FlowState } from '@app/types/oppgave-common';
import type { IOppgave } from '@app/types/oppgaver';
import { Tag } from '@navikt/ds-react';

type Props = Pick<IOppgave, 'rol'>;

const TAG_CLASSES = 'truncate';

export const RolFlowStateLabel = ({ rol }: Props) => {
  if (rol.employee === null && rol.flowState === FlowState.SENT) {
    return (
      <Tag className={TAG_CLASSES} variant="neutral" title="I felles kø for rådgivende overlege">
        I felles kø for ROL
      </Tag>
    );
  }

  if (rol.employee !== null && rol.flowState === FlowState.SENT) {
    return (
      <Tag className={TAG_CLASSES} variant="info" title="Sendt til rådgivende overlege">
        Sendt til ROL
      </Tag>
    );
  }

  if (rol.flowState === FlowState.RETURNED) {
    return (
      <Tag className={TAG_CLASSES} variant="warning" title="Tilbake fra rådgivende overlege">
        Tilbake fra ROL
      </Tag>
    );
  }

  return null;
};
