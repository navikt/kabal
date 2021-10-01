import { Checkbox } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetKvalitetsvurderingQuery, useUpdateKvalitetsvurderingMutation } from '../../redux-api/kvalitetsvurdering';
import { FormSection, SubHeader } from './styled-components';

export const Avvik = () => {
  const { id } = useParams<{ id: string }>();
  const { data: kvalitetsvurdering, isLoading } = useGetKvalitetsvurderingQuery(id);
  const [updateKvalitetsskjema] = useUpdateKvalitetsvurderingMutation();

  if (isLoading || typeof kvalitetsvurdering === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const { avvikStorKonsekvens } = kvalitetsvurdering;

  return (
    <FormSection>
      <SubHeader>Avvik</SubHeader>
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
    </FormSection>
  );
};
