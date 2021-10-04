import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import React from 'react';
import { useKlagebehandlingId } from '../../hooks/use-klagebehandling-id';
import { useGetKvalitetsvurderingQuery, useUpdateKvalitetsvurderingMutation } from '../../redux-api/kvalitetsvurdering';
import { CheckboxWithHelpIcon, FormSection, SubHeader } from './styled-components';

interface AvvikProps {
  show: boolean;
}

export const Avvik = ({ show }: AvvikProps) => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data: kvalitetsvurdering } = useGetKvalitetsvurderingQuery(klagebehandlingId);
  const [updateKvalitetsskjema] = useUpdateKvalitetsvurderingMutation();

  if (!show || typeof kvalitetsvurdering === 'undefined') {
    return null;
  }

  const { avvikStorKonsekvens } = kvalitetsvurdering;

  return (
    <FormSection>
      <SubHeader>Avvik</SubHeader>
      <CheckboxGruppe>
        <CheckboxWithHelpIcon>
          <Checkbox
            label={'Betydelig avvik med stor konsekvens for søker'}
            checked={avvikStorKonsekvens}
            onChange={(e) => {
              updateKvalitetsskjema({
                ...kvalitetsvurdering,
                avvikStorKonsekvens: e.target.checked,
              });
            }}
          />
          <Hjelpetekst>Benyttes når det er et alvorlig avvik med en stor økonomisk konsekvens for bruker.</Hjelpetekst>
        </CheckboxWithHelpIcon>
      </CheckboxGruppe>
    </FormSection>
  );
};
