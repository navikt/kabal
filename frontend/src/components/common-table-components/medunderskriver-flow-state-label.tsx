import { Tag, Tooltip } from '@navikt/ds-react';
import { useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import {
  getTitleCapitalized,
  getTitleLowercase,
} from '@/components/behandling/behandlingsdialog/medunderskriver/get-title';
import { SaksTypeEnum } from '@/types/kodeverk';
import { FlowState } from '@/types/oppgave-common';
import type { IOppgave } from '@/types/oppgaver';

type Props = Pick<IOppgave, 'medunderskriver' | 'typeId'>;

export const MUFlowStateLabelWithSelf = ({ medunderskriver, typeId }: Props) => {
  const { user } = useContext(StaticDataContext);

  const isMu = medunderskriver.employee?.navIdent === user.navIdent;

  if (isMu && medunderskriver.flowState === FlowState.SENT) {
    return (
      <Tooltip content={getTitleCapitalized(typeId)} delay={500}>
        <Tag data-color="meta-purple" variant="outline" size="small" className="whitespace-nowrap">
          {typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ? 'Fagansvarlig' : 'MU'}
        </Tag>
      </Tooltip>
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
  <Tooltip content={`Sendt til ${getTitleLowercase(typeId)}`} delay={500}>
    <Tag data-color="success" variant="outline" size="small" className="whitespace-nowrap">
      Sendt til {typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ? 'fagansvarlig' : 'MU'}
    </Tag>
  </Tooltip>
);

const Tilbake = ({ typeId }: { typeId: SaksTypeEnum }) => (
  <Tooltip content={`Tilbake fra ${getTitleLowercase(typeId)}`} delay={500}>
    <Tag data-color="danger" variant="outline" size="small" className="whitespace-nowrap">
      Tilbake fra {typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ? 'fagansvarlig' : 'MU'}
    </Tag>
  </Tooltip>
);
