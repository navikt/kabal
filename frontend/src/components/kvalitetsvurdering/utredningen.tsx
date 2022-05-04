import { Loader } from '@navikt/ds-react';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '../../hooks/use-can-edit';
import { useFieldName } from '../../hooks/use-field-name';
import { useKvalitetsvurdering } from '../../hooks/use-kvalitetsvurdering';
import { useValidationError } from '../../hooks/use-validation-error';
import { useUpdateKvalitetsvurderingMutation } from '../../redux-api/kaka-kvalitetsvurdering';
import { RadioValg } from '../../types/kaka-kvalitetsvurdering';
import { Reason, Reasons } from './reasons';
import { FormSection, RadioButtonsRow, StyledHelpText, SubHeader } from './styled-components';

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
      <StyledHeaderWrapper>
        <SubHeader>{header}</SubHeader>
        <StyledHelpText>
          Gjelder kvaliteten på utredningen i perioden frem til og med oversendelse til klageinstansen. Er det kommet
          nye opplysninger etter at saken er oversendt klageinstansen, som vedtaksinstansen burde innhentet, skal dette
          også registreres her.
        </StyledHelpText>
      </StyledHeaderWrapper>
      <RadioGruppe feil={utredningenRadioValg === null ? validationError : undefined}>
        <RadioButtonsRow>
          <Radio
            name="UtredningenBra"
            label="Bra/godt nok"
            onChange={() => updateKvalitetsvurdering({ id, utredningenRadioValg: RadioValg.BRA })}
            checked={utredningenRadioValg === RadioValg.BRA}
            disabled={!canEdit}
          />
          <Radio
            name="UtredningenMangelfullt"
            label="Mangelfullt"
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

const StyledHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
