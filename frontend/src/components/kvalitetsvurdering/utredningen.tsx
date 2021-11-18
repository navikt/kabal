import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React from 'react';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useFieldName } from '../../hooks/use-field-name';
import { useKvalitetsvurdering } from '../../hooks/use-kvalitetsvurdering';
import { useValidationError } from '../../hooks/use-validation-error';
import { useUpdateKvalitetsvurderingMutation } from '../../redux-api/kaka-kvalitetsvurdering';
import { RadioValg } from '../../redux-api/kaka-kvalitetsvurdering-types';
import { Reason, Reasons } from './reasons';
import { FormSection, RadioButtonsRow, SubHeader } from './styled-components';

export const Utredningen = () => {
  const [kvalitetsvurdering, isLoading] = useKvalitetsvurdering();
  const [updateKvalitetsvurdering] = useUpdateKvalitetsvurderingMutation();
  const canEdit = useCanEdit();
  const validationError = useValidationError('utredningenRadioValg');
  const header = useFieldName('utredningenRadioValg');

  if (isLoading || typeof kvalitetsvurdering === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const { id, utredningenRadioValg } = kvalitetsvurdering;

  const reasons: Reason[] = [
    {
      id: 'utredningenAvMedisinskeForhold',
      label: 'Utredningen av medisinske forhold',
      checked: kvalitetsvurdering.utredningenAvMedisinskeForhold,
      textareaId: 'utredningenAvMedisinskeForholdText',
    },
    {
      id: 'utredningenAvInntektsforhold',
      label: 'Utredningen av inntektsforhold',
      checked: kvalitetsvurdering.utredningenAvInntektsforhold,
      textareaId: 'utredningenAvInntektsforholdText',
    },
    {
      id: 'utredningenAvArbeid',
      label: 'Utredningen av arbeid',
      checked: kvalitetsvurdering.utredningenAvArbeid,
      textareaId: 'utredningenAvArbeidText',
    },
    {
      id: 'arbeidsrettetBrukeroppfoelging',
      label: 'Arbeidsrettet brukeroppfølging',
      checked: kvalitetsvurdering.arbeidsrettetBrukeroppfoelging,
      textareaId: 'arbeidsrettetBrukeroppfoelgingText',
    },
    {
      id: 'utredningenAvAndreAktuelleForholdISaken',
      label: 'Utredningen av andre aktuelle forhold i saken',
      checked: kvalitetsvurdering.utredningenAvAndreAktuelleForholdISaken,
      textareaId: 'utredningenAvAndreAktuelleForholdISakenText',
    },
    {
      id: 'utredningenAvEoesProblematikk',
      label: 'Utredningen av EØS / utenlandsproblematikk',
      checked: kvalitetsvurdering.utredningenAvEoesProblematikk,
      textareaId: 'utredningenAvEoesProblematikkText',
    },
    {
      id: 'veiledningFraNav',
      label: 'Veiledning fra NAV',
      checked: kvalitetsvurdering.veiledningFraNav,
      textareaId: 'veiledningFraNavText',
    },
  ];

  return (
    <FormSection>
      <SubHeader>{header}</SubHeader>
      <RadioGruppe feil={utredningenRadioValg === null ? validationError : undefined}>
        <RadioButtonsRow>
          <Radio
            name={'UtredningenBra'}
            label={'Bra/godt nok'}
            onChange={() => updateKvalitetsvurdering({ id, utredningenRadioValg: RadioValg.BRA })}
            checked={utredningenRadioValg === RadioValg.BRA}
            disabled={!canEdit}
          />
          <Radio
            name={'UtredningenMangelfullt'}
            label={'Mangelfullt'}
            onChange={() => updateKvalitetsvurdering({ id, utredningenRadioValg: RadioValg.MANGELFULLT })}
            checked={utredningenRadioValg === RadioValg.MANGELFULLT}
            disabled={!canEdit}
          />
        </RadioButtonsRow>
      </RadioGruppe>
      <Reasons
        error={validationError}
        show={utredningenRadioValg === RadioValg.MANGELFULLT}
        legendText="Hva er mangelfullt?"
        reasons={reasons}
      />
    </FormSection>
  );
};
