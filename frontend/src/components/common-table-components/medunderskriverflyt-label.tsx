import React from 'react';
import { LabelMedunderskriver, LabelReturnertTilSaksbehandler } from '../../styled-components/labels';
import { MedunderskriverFlyt } from '../../types/kodeverk';
import { IOppgave } from '../../types/oppgaver';
import { getTitle } from '../behandling/behandlingsdialog/medunderskriver/getTitle';

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
    return <LabelMedunderskriver>{getTitle(type, true)}</LabelMedunderskriver>;
  }

  if (!erMedunderskriver && medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return <LabelMedunderskriver>Sendt til {getTitle(type)}</LabelMedunderskriver>;
  }

  if (!erMedunderskriver && medunderskriverFlyt === MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER) {
    return <LabelReturnertTilSaksbehandler>Sendt tilbake av {getTitle(type)}</LabelReturnertTilSaksbehandler>;
  }

  return null;
};
