import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetKvalitetsvurderingQuery, useUpdateKvalitetsvurderingMutation } from '../../redux-api/kvalitetsvurdering';
import { AnnetComments } from './annetComments';
import { CheckboxWithHelpIcon, FormSection, SubHeader } from './styled-components';

interface AnnetProps {
  show: boolean;
}

export const Annet = ({ show }: AnnetProps) => {
  const { id } = useParams<{ id: string }>();
  const { data: kvalitetsvurdering } = useGetKvalitetsvurderingQuery(id);
  const [updateKvalitetsskjema] = useUpdateKvalitetsvurderingMutation();

  if (!show || typeof kvalitetsvurdering === 'undefined') {
    return null;
  }

  const { brukSomEksempelIOpplaering } = kvalitetsvurdering;

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
      <AnnetComments kvalitetsvurdering={kvalitetsvurdering} updateKvalitetsskjema={updateKvalitetsskjema} />
    </FormSection>
  );
};
