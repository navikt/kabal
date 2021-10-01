import { Radio } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetKvalitetsvurderingQuery,
  useUpdateKvalitetsvurderingMutation,
} from '../../../redux-api/kvalitetsvurdering';
import { FormSection, RadioButtonsRow, SubHeader } from '../styled-components';
import { OversendelsesbrevKvalitetsavvikReasons } from './oversendelsesbrevAvvikReasons';
import { OversendelsesbrevComments } from './oversendelsesbrevComments';

export const Oversendelsesbrev = () => {
  const { id } = useParams<{ id: string }>();
  const { data: kvalitetsvurdering, isLoading } = useGetKvalitetsvurderingQuery(id);
  const [updateKvalitetsskjema] = useUpdateKvalitetsvurderingMutation();

  if (isLoading || typeof kvalitetsvurdering === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const { kvalitetOversendelsesbrevBra } = kvalitetsvurdering;

  return (
    <FormSection>
      <SubHeader>Oversendelsesbrev</SubHeader>
      <RadioButtonsRow>
        <Radio
          name={'OversendelsesbrevBra'}
          label={'Bra/godt nok'}
          onChange={() => updateKvalitetsskjema({ ...kvalitetsvurdering, kvalitetOversendelsesbrevBra: true })}
          checked={kvalitetOversendelsesbrevBra === true}
        />
        <Radio
          name={'OversendelsesbrevMangelfullt'}
          label={'Mangelfullt'}
          onChange={() => updateKvalitetsskjema({ ...kvalitetsvurdering, kvalitetOversendelsesbrevBra: false })}
          checked={kvalitetOversendelsesbrevBra === false}
        />
      </RadioButtonsRow>
      <OversendelsesbrevKvalitetsavvikReasons
        show={kvalitetOversendelsesbrevBra === false}
        kvalitetsvurdering={kvalitetsvurdering}
        updateKvalitetsskjema={updateKvalitetsskjema}
      />
      <OversendelsesbrevComments
        show={kvalitetOversendelsesbrevBra === false}
        kvalitetsvurdering={kvalitetsvurdering}
        updateKvalitetsskjema={updateKvalitetsskjema}
      />
    </FormSection>
  );
};
