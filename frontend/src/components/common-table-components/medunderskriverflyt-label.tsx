import React from 'react';
import { LabelMedunderskriver, LabelReturnertTilSaksbehandler } from '../../styled-components/labels';
import { MedunderskriverFlyt } from '../../types/kodeverk';
import { IOppgave } from '../../types/oppgaver';

type MedudunderskriverflytLabelProps = Pick<
  IOppgave,
  'medunderskriverFlyt' | 'erMedunderskriver' | 'harMedunderskriver'
>;

export const MedudunderskriverflytLabel = ({
  medunderskriverFlyt,
  erMedunderskriver,
  harMedunderskriver,
}: MedudunderskriverflytLabelProps) => {
  if (!harMedunderskriver) {
    return null;
  }

  if (erMedunderskriver && medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return <LabelMedunderskriver>Medunderskriver</LabelMedunderskriver>;
  }

  if (!erMedunderskriver && medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return <LabelMedunderskriver>Sendt til medunderskriver</LabelMedunderskriver>;
  }

  if (!erMedunderskriver && medunderskriverFlyt === MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER) {
    return <LabelReturnertTilSaksbehandler>Sendt tilbake av medunderskriver</LabelReturnertTilSaksbehandler>;
  }

  return null;
};
