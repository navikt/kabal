import { Tag, Tooltip } from '@navikt/ds-react';
import { useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { FlowState, ReviewFlowState } from '@/types/oppgave-common';
import type { IOppgave } from '@/types/oppgaver';

type Props = Pick<IOppgave, 'medunderskriver'>;

export const MUFlowStateLabelWithSelf = (props: Props) => {
  const { medunderskriver } = props;
  const { user } = useContext(StaticDataContext);

  const isMu = medunderskriver.employee?.navIdent === user.navIdent;

  if (isMu) {
    return medunderskriver.flowState === FlowState.SENT ? (
      <Tooltip content="Medunderskriver" delay={500}>
        <Tag data-color="meta-purple" variant="outline" size="small" className="whitespace-nowrap">
          MU
        </Tag>
      </Tooltip>
    ) : null;
  }

  return <MUFlowStateLabelWithoutSelf {...props} />;
};

export const MUFlowStateLabelWithoutSelf = ({ medunderskriver }: Props) => {
  if (medunderskriver.flowState === FlowState.SENT) {
    return <Sendt />;
  }

  if (medunderskriver.flowState === FlowState.RETURNED) {
    return <Tilbake />;
  }

  if (medunderskriver.flowState === ReviewFlowState.APPROVED) {
    return <Approved />;
  }

  if (medunderskriver.flowState === ReviewFlowState.REJECTED) {
    return <Rejected />;
  }

  return null;
};

const Sendt = () => (
  <Tooltip content="Sendt til medunderskriver" delay={500}>
    <Tag data-color="info" variant="outline" size="small" className="whitespace-nowrap">
      Sendt til MU
    </Tag>
  </Tooltip>
);

const Tilbake = () => (
  <Tooltip content="Tilbake fra medunderskriver" delay={500}>
    <Tag data-color="success" variant="outline" size="small" className="whitespace-nowrap">
      Tilbake fra MU
    </Tag>
  </Tooltip>
);

const Approved = () => (
  <Tooltip content="Returnert og godkjent av medunderskriver" delay={500}>
    <Tag data-color="success" variant="outline" size="small" className="whitespace-nowrap">
      Tilbake fra MU
    </Tag>
  </Tooltip>
);

const Rejected = () => (
  <Tooltip content="Returnert uten godkjenning av medunderskriver" delay={500}>
    <Tag data-color="danger" variant="outline" size="small" className="whitespace-nowrap">
      Tilbake fra MU
    </Tag>
  </Tooltip>
);
