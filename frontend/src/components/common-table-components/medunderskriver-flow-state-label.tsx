import { StaticDataContext } from '@app/components/app/static-data-context';
import {
  getTitleCapitalized,
  getTitleLowercase,
} from '@app/components/behandling/behandlingsdialog/medunderskriver/get-title';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import type { IOppgave } from '@app/types/oppgaver';
import { Tag } from '@navikt/ds-react';
import { useContext } from 'react';

type Props = Pick<IOppgave, 'medunderskriver' | 'typeId'>;

export const MUFlowStateLabelWithSelf = ({ medunderskriver, typeId }: Props) => {
  const { user } = useContext(StaticDataContext);

  const isMu = medunderskriver.employee?.navIdent === user.navIdent;

  if (isMu && medunderskriver.flowState === FlowState.SENT) {
    return (
      <Tag className="truncate" variant="alt1" title={getTitleCapitalized(typeId)}>
        {typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ? 'Fagansvarlig' : 'MU'}
      </Tag>
    );
  }

  if (!isMu && medunderskriver.flowState === FlowState.SENT) {
    return <Sendt typeId={typeId} />;
  }

  if (!isMu && medunderskriver.flowState === FlowState.RETURNED) {
    return <Tilbake typeId={typeId} />;
  }

  return null;
};

export const MUFlowStateLabelWithoutSelf = ({ medunderskriver, typeId }: Props) => {
  if (medunderskriver.flowState === FlowState.SENT) {
    return <Sendt typeId={typeId} />;
  }

  if (medunderskriver.flowState === FlowState.RETURNED) {
    return <Tilbake typeId={typeId} />;
  }

  return null;
};

const Sendt = ({ typeId }: { typeId: SaksTypeEnum }) => (
  <Tag className="truncate" variant="success" title={`Sendt til ${getTitleLowercase(typeId)}`}>
    Sendt til {typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ? 'fagansvarlig' : 'MU'}
  </Tag>
);

const Tilbake = ({ typeId }: { typeId: SaksTypeEnum }) => (
  <Tag className="truncate" variant="error" title={`Tilbake fra ${getTitleLowercase(typeId)}`}>
    Tilbake fra {typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ? 'fagansvarlig' : 'MU'}
  </Tag>
);
