import { Radio } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetKvalitetsvurderingQuery,
  useUpdateKvalitetsvurderingMutation,
} from '../../../redux-api/kvalitetsvurdering';
import { FormSection, RadioButtonsRow, SubHeader } from '../styled-components';
import { VedtakKvalitetsavvikReasons } from './vedtakAvvikReasons';
import { VedtakComments } from './vedtakComments';

export const Vedtak = () => {
  const { id } = useParams<{ id: string }>();
  const { data: kvalitetsvurdering, isLoading } = useGetKvalitetsvurderingQuery(id);
  const [updateKvalitetsskjema] = useUpdateKvalitetsvurderingMutation();

  if (isLoading || typeof kvalitetsvurdering === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const { kvalitetVedtakBra } = kvalitetsvurdering;
  return (
    <FormSection>
      <SubHeader>Vedtak</SubHeader>
      <RadioButtonsRow>
        <Radio
          name={'VedtakBra'}
          label={'Bra/godt nok'}
          onChange={() => updateKvalitetsskjema({ ...kvalitetsvurdering, kvalitetVedtakBra: true })}
          checked={kvalitetVedtakBra === true}
        />
        <Radio
          name={'VedtakMangelfullt'}
          label={'Mangelfullt'}
          onChange={() => updateKvalitetsskjema({ ...kvalitetsvurdering, kvalitetVedtakBra: false })}
          checked={kvalitetVedtakBra === false}
        />
      </RadioButtonsRow>
      <VedtakKvalitetsavvikReasons
        show={kvalitetVedtakBra === false}
        kvalitetsvurdering={kvalitetsvurdering}
        updateKvalitetsskjema={updateKvalitetsskjema}
      />
      <VedtakComments
        show={kvalitetVedtakBra === false}
        kvalitetsvurdering={kvalitetsvurdering}
        updateKvalitetsskjema={updateKvalitetsskjema}
      />
    </FormSection>
  );
};
