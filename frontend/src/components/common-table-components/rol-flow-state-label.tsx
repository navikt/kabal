import { StaticDataContext } from '@app/components/app/static-data-context';
import { FlowState } from '@app/types/oppgave-common';
import type { IOppgave } from '@app/types/oppgaver';
import { Tag } from '@navikt/ds-react';
import { useContext } from 'react';

type Props = Pick<IOppgave, 'rol'>;

const TAG_CLASSES = 'truncate';

export const RolFlowStateLabel = ({ rol }: Props) => {
  const { user } = useContext(StaticDataContext);

  if (rol.employee === null && rol.flowState === FlowState.SENT) {
    return (
      <Tag className={TAG_CLASSES} variant="alt3" title="I felles kø for rådgivende overlege">
        I felles kø for ROL
      </Tag>
    );
  }

  const isRol = rol.employee?.navIdent === user.navIdent;

  if (isRol && rol.flowState === FlowState.SENT) {
    return (
      <Tag className={TAG_CLASSES} variant="alt3" title="Rådgivende overlege">
        ROL
      </Tag>
    );
  }

  if (!isRol && rol.flowState === FlowState.SENT) {
    return (
      <Tag className={TAG_CLASSES} variant="alt3" title="Sendt til rådgivende overlege">
        Sendt til ROL
      </Tag>
    );
  }

  if (!isRol && rol.flowState === FlowState.RETURNED) {
    return (
      <Tag className={TAG_CLASSES} variant="info" title="Tilbake fra rådgivende overlege">
        Tilbake fra ROL
      </Tag>
    );
  }

  return null;
};
