import React from 'react';
import { LabelMedunderskriver, LabelReturnertTilSaksbehandler } from '../../styled-components/labels';
import { MedunderskriverFlyt } from '../../types/kodeverk';

interface MedudunderskriverflytLabelProps {
  medunderskriverflyt: MedunderskriverFlyt;
  erMedunderskriver: boolean;
  harMedunderskriver: boolean;
}

export const MedudunderskriverflytLabel = ({
  medunderskriverflyt,
  erMedunderskriver,
  harMedunderskriver,
}: MedudunderskriverflytLabelProps) => {
  if (!harMedunderskriver) {
    return null;
  }

  if (erMedunderskriver && medunderskriverflyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return <LabelMedunderskriver>Medunderskriver</LabelMedunderskriver>;
  }

  if (!erMedunderskriver && medunderskriverflyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
    return <LabelMedunderskriver>Sendt til medunderskriver</LabelMedunderskriver>;
  }

  if (!erMedunderskriver && medunderskriverflyt === MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER) {
    return <LabelReturnertTilSaksbehandler>Sendt tilbake av medunderskriver</LabelReturnertTilSaksbehandler>;
  }

  return null;
};
