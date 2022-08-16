import React from 'react';
import { LabelMedunderskriver, LabelReturnertTilSaksbehandler } from '../../styled-components/labels';
import { MedunderskriverFlyt } from '../../types/kodeverk';
import { IOppgave } from '../../types/oppgaver';
import { getTitleCapitalized, getTitleLowercase } from '../behandling/behandlingsdialog/medunderskriver/getTitle';

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
