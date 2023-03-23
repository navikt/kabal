import React from 'react';
import {
  getTitleCapitalized,
  getTitleLowercase,
} from '@app/components/behandling/behandlingsdialog/medunderskriver/getTitle';
import { LabelMedunderskriver, LabelReturnertTilSaksbehandler } from '@app/styled-components/labels';
import { MedunderskriverFlyt } from '@app/types/kodeverk';
import { IOppgave } from '@app/types/oppgaver';

type MedudunderskriverflytLabelProps = Pick<
  IOppgave,
  'medunderskriverFlyt' | 'erMedunderskriver' | 'harMedunderskriver' | 'type'
>;

export const MedudunderskriverflytLabel = ({
  medunderskriverFlyt,
  erMedunderskriver,
  harMedunderskriver,
  type,
}: MedudunderskriverflytLabelProps) => {
  if (!harMedunderskriver) {
    return null;
  }

  if (erMedunderskriver && medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return <LabelMedunderskriver>{getTitleCapitalized(type)}</LabelMedunderskriver>;
  }

  if (!erMedunderskriver && medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return <LabelMedunderskriver>Sendt til {getTitleLowercase(type)}</LabelMedunderskriver>;
  }

  if (!erMedunderskriver && medunderskriverFlyt === MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER) {
    return <LabelReturnertTilSaksbehandler>Sendt tilbake av {getTitleLowercase(type)}</LabelReturnertTilSaksbehandler>;
  }

  return null;
};
