import React from 'react';
import {
  getTitleCapitalized,
  getTitleLowercase,
} from '@app/components/behandling/behandlingsdialog/medunderskriver/getTitle';
import { useUser } from '@app/simple-api-state/use-user';
import { LabelMedunderskriver, LabelReturnertTilSaksbehandler } from '@app/styled-components/labels';
import { MedunderskriverFlyt } from '@app/types/kodeverk';
import { IOppgave } from '@app/types/oppgaver';

type MedudunderskriverflytLabelProps = Pick<IOppgave, 'medunderskriverFlyt' | 'medunderskriverident' | 'typeId'>;

export const MedudunderskriverflytLabel = ({
  medunderskriverFlyt,
  medunderskriverident,
  typeId,
}: MedudunderskriverflytLabelProps) => {
  const { data, isLoading } = useUser();

  if (medunderskriverident === null || isLoading || data === undefined) {
    return null;
  }

  const erMedunderskriver = medunderskriverident === data.navIdent;

  if (erMedunderskriver && medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return <LabelMedunderskriver>{getTitleCapitalized(typeId)}</LabelMedunderskriver>;
  }

  if (!erMedunderskriver && medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return <LabelMedunderskriver>Sendt til {getTitleLowercase(typeId)}</LabelMedunderskriver>;
  }

  if (!erMedunderskriver && medunderskriverFlyt === MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER) {
    return (
      <LabelReturnertTilSaksbehandler>Sendt tilbake av {getTitleLowercase(typeId)}</LabelReturnertTilSaksbehandler>
    );
  }

  return null;
};
