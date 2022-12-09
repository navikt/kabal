import { Heading, Loader, Radio, RadioGroup } from '@navikt/ds-react';
import React from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useFieldName } from '../../../hooks/use-field-name';
import { useKvalitetsvurdering } from '../../../hooks/use-kvalitetsvurdering';
import { useValidationError } from '../../../hooks/use-validation-error';
import { useUpdateKvalitetsvurderingMutation } from '../../../redux-api/kaka-kvalitetsvurdering';
import { RadioValg } from '../../../types/kaka-kvalitetsvurdering';
import { Reason, Reasons } from './reasons';
import { FormSection, RadioButtonsRow, StyledHeaderHelpTextWrapper, StyledHelpText } from './styled-components';

export const Utredningen = () => {
  const [kvalitetsvurdering, isLoading] = useKvalitetsvurdering();
  const [updateKvalitetsvurdering] = useUpdateKvalitetsvurderingMutation();
  const canEdit = useCanEdit();
  const validationError = useValidationError('utredningenRadioValg');
  const header = useFieldName('utredningenRadioValg');

  if (isLoading || typeof kvalitetsvurdering === 'undefined') {
    return <Loader size="xlarge" />;
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
      helpText:
        'Mangelfull veiledning i saken slik at bruker ikke får fremmet krav, krever feil ytelse eller ikke forstår hvilke opplysninger hen skal levere for at NAV skal kunne behandle saken.',
    },
  ];

  return (
    <FormSection>
      <StyledHeaderHelpTextWrapper>
        <Heading level="2" size="small">
          {header}
        </Heading>
        <StyledHelpText>
          Gjelder kvaliteten på utredningen i perioden frem til og med oversendelse til klageinstansen. Er det kommet
          nye opplysninger etter at saken er oversendt klageinstansen, som vedtaksinstansen burde innhentet, skal dette
          også registreres her.
        </StyledHelpText>
      </StyledHeaderHelpTextWrapper>
      <RadioGroup
        error={utredningenRadioValg === null ? validationError : undefined}
        legend=""
        hideLegend
        disabled={!canEdit}
        size="small"
        value={utredningenRadioValg}
      >
        <RadioButtonsRow>
          <Radio
            value={RadioValg.BRA}
            onChange={() => updateKvalitetsvurdering({ id, utredningenRadioValg: RadioValg.BRA })}
          >
            Bra/godt nok
          </Radio>
          <Radio
            value={RadioValg.MANGELFULLT}
            onChange={() => updateKvalitetsvurdering({ id, utredningenRadioValg: RadioValg.MANGELFULLT })}
          >
            Mangelfullt
          </Radio>
        </RadioButtonsRow>
      </RadioGroup>
      <Reasons
        error={validationError}
        show={utredningenRadioValg === RadioValg.MANGELFULLT}
        legendText="Hva er mangelfullt?"
        reasons={reasons}
      />
    </FormSection>
  );
};
