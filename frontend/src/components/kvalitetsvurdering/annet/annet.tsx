import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import React from 'react';
import { useKlagebehandlingId } from '../../../hooks/use-klagebehandling-id';
import {
  useGetKvalitetsvurderingQuery,
  useUpdateKvalitetsvurderingMutation,
} from '../../../redux-api/kvalitetsvurdering';
import { CheckboxWithHelpIcon, FormSection, SubHeader } from '../styled-components';
import { AnnetComments } from './annetComments';

interface AnnetProps {
  show: boolean;
}

export const Annet = ({ show }: AnnetProps) => {
  const klagebehandlingId = useKlagebehandlingId();
  const { data: kvalitetsvurdering } = useGetKvalitetsvurderingQuery(klagebehandlingId);
  const [updateKvalitetsskjema] = useUpdateKvalitetsvurderingMutation();

  if (!show || typeof kvalitetsvurdering === 'undefined') {
    return null;
  }

  const { brukSomEksempelIOpplaering } = kvalitetsvurdering;

  const showComments = brukSomEksempelIOpplaering === true;

  return (
    <FormSection>
      <SubHeader>Annet</SubHeader>
      <CheckboxGruppe>
        <CheckboxWithHelpIcon>
          <Checkbox
            label={'Bruk gjerne dette som eksempel i opplæring'}
            checked={brukSomEksempelIOpplaering}
            onChange={(e) => {
              updateKvalitetsskjema({
                ...kvalitetsvurdering,
                brukSomEksempelIOpplaering: e.target.checked,
              });
            }}
          />
          <Hjelpetekst>Benyttes på spesielt gode vedtak, til opplæring i førsteinstans.</Hjelpetekst>
        </CheckboxWithHelpIcon>
      </CheckboxGruppe>
      <AnnetComments
        show={showComments}
        kvalitetsvurdering={kvalitetsvurdering}
        updateKvalitetsskjema={updateKvalitetsskjema}
      />
    </FormSection>
  );
};
