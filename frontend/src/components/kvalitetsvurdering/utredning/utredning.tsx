import { Radio } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetKvalitetsvurderingQuery,
  useUpdateKvalitetsvurderingMutation,
} from '../../../redux-api/kvalitetsvurdering';
import { FormSection, RadioButtonsRow, SubHeader } from '../styled-components';
import { UtredningKvalitetsavvikReasons } from './utredningAvvikReasons';
import { UtredningComments } from './utredningComments';

export const Utredning = () => {
  const { id } = useParams<{ id: string }>();
  const { data: kvalitetsvurdering, isLoading } = useGetKvalitetsvurderingQuery(id);
  const [updateKvalitetsskjema] = useUpdateKvalitetsvurderingMutation();

  if (isLoading || typeof kvalitetsvurdering === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const { kvalitetUtredningBra } = kvalitetsvurdering;
  return (
    <FormSection>
      <SubHeader>Utredning</SubHeader>
      <RadioButtonsRow>
        <Radio
          name={'UtredningBra'}
          label={'Bra/godt nok'}
          onChange={() => updateKvalitetsskjema({ ...kvalitetsvurdering, kvalitetUtredningBra: true })}
          checked={kvalitetUtredningBra === true}
        />
        <Radio
          name={'UtredningMangelfullt'}
          label={'Mangelfullt'}
          onChange={() => updateKvalitetsskjema({ ...kvalitetsvurdering, kvalitetUtredningBra: false })}
          checked={kvalitetUtredningBra === false}
        />
      </RadioButtonsRow>
      <UtredningKvalitetsavvikReasons
        show={kvalitetUtredningBra === false}
        kvalitetsvurdering={kvalitetsvurdering}
        updateKvalitetsskjema={updateKvalitetsskjema}
      />
      <UtredningComments
        show={kvalitetUtredningBra === false}
        kvalitetsvurdering={kvalitetsvurdering}
        updateKvalitetsskjema={updateKvalitetsskjema}
      />
    </FormSection>
  );
};
