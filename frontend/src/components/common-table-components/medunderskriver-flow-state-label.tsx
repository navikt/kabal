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
import { styled } from 'styled-components';

type Props = Pick<IOppgave, 'medunderskriver' | 'typeId'>;

export const MedudunderskriverFlowStateLabel = ({ medunderskriver, typeId }: Props) => {
  const { user } = useContext(StaticDataContext);

  if (medunderskriver.employee === null) {
    return null;
  }

  const isMedunderskriver = medunderskriver.employee.navIdent === user.navIdent;

  if (isMedunderskriver && medunderskriver.flowState === FlowState.SENT) {
    return (
      <StyledTag variant="alt3" title={getTitleCapitalized(typeId)}>
        {typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ? 'Fagansvarlig' : 'MU'}
      </StyledTag>
    );
  }

  if (!isMedunderskriver && medunderskriver.flowState === FlowState.SENT) {
    return (
      <StyledTag variant="alt3" title={`Sendt til ${getTitleLowercase(typeId)}`}>
        Sendt til {typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ? 'fagansvarlig' : 'MU'}
      </StyledTag>
    );
  }

  if (!isMedunderskriver && medunderskriver.flowState === FlowState.RETURNED) {
    return (
      <StyledTag variant="info" title={`Tilbake fra ${getTitleLowercase(typeId)}`}>
        Tilbake fra {typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ? 'fagansvarlig' : 'MU'}
      </StyledTag>
    );
  }

  return null;
};

const StyledTag = styled(Tag)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
