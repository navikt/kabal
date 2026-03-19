import { Tag, Tooltip } from '@navikt/ds-react';
import { FlowState } from '@/types/oppgave-common';
import type { IOppgave } from '@/types/oppgaver';

type Props = Pick<IOppgave, 'rol'>;

const TAG_CLASSES = 'truncate';

export const RolFlowStateLabel = ({ rol }: Props) => {
  if (rol.employee === null && rol.flowState === FlowState.SENT) {
    return (
      <Tooltip content="I felles kø for rådgivende overlege" delay={500}>
        <Tag data-color="neutral" className={TAG_CLASSES} variant="outline" size="small">
          I felles kø for ROL
        </Tag>
      </Tooltip>
    );
  }

  if (rol.employee !== null && rol.flowState === FlowState.SENT) {
    return (
      <Tooltip content="Sendt til rådgivende overlege" delay={500}>
        <Tag data-color="info" className={TAG_CLASSES} variant="outline" size="small">
          Sendt til ROL
        </Tag>
      </Tooltip>
    );
  }

  if (rol.flowState === FlowState.RETURNED) {
    return (
      <Tooltip content="Tilbake fra rådgivende overlege" delay={500}>
        <Tag data-color="warning" className={TAG_CLASSES} variant="outline" size="small">
          Tilbake fra ROL
        </Tag>
      </Tooltip>
    );
  }

  return null;
};
