import { Tag } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import {
  getTitleCapitalized,
  getTitleLowercase,
} from '@app/components/behandling/behandlingsdialog/medunderskriver/get-title';
import { useUser } from '@app/simple-api-state/use-user';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { IOppgave } from '@app/types/oppgaver';

type Props = Pick<IOppgave, 'medunderskriver' | 'typeId'>;

export const MedudunderskriverFlowStateLabel = ({ medunderskriver, typeId }: Props) => {
  const { data, isLoading } = useUser();

  if (medunderskriver.navIdent === null || isLoading || data === undefined) {
    return null;
  }

  const isMedunderskriver = medunderskriver.navIdent === data.navIdent;

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
