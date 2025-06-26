import { useCanEdit } from '@app/hooks/use-can-edit';
import { useKvalitetsvurdering } from '@app/hooks/use-kvalitetsvurdering';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useUpdateKvalitetsvurderingMutation } from '@app/redux-api/kaka-kvalitetsvurdering/v1';
import { Radiovalg } from '@app/types/kaka-kvalitetsvurdering/radio';
import { Heading, HStack, Loader, Radio, RadioGroup } from '@navikt/ds-react';
import { type Reason, Reasons } from './reasons';
import { FormSection, StyledHelpText } from './styled-components';
import { useKvalitetsvurderingV1FieldName } from './use-field-name';

export const Utredningen = () => {
  const [kvalitetsvurdering, isLoading] = useKvalitetsvurdering();
  const [updateKvalitetsvurdering] = useUpdateKvalitetsvurderingMutation();
  const canEdit = useCanEdit();
  const validationError = useValidationError('utredningenRadioValg');
  const header = useKvalitetsvurderingV1FieldName('utredningenRadioValg');

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
      label: 'Veiledning fra Nav',
      checked: kvalitetsvurdering.veiledningFraNav,
      textareaId: 'veiledningFraNavText',
      helpText:
        'Mangelfull veiledning i saken slik at bruker ikke får fremmet krav, krever feil ytelse eller ikke forstår hvilke opplysninger hen skal levere for at Nav skal kunne behandle saken.',
    },
  ];

  return (
    <FormSection>
      <HStack align="center" gap="2">
        <Heading level="2" size="small">
          {header}
        </Heading>
        <StyledHelpText>
          Gjelder kvaliteten på utredningen i perioden frem til og med oversendelse til klageinstansen. Er det kommet
          nye opplysninger etter at saken er oversendt klageinstansen, som vedtaksinstansen burde innhentet, skal dette
          også registreres her.
        </StyledHelpText>
      </HStack>
      <RadioGroup
        error={utredningenRadioValg === null ? validationError : undefined}
        legend=""
        hideLegend
        disabled={!canEdit}
        size="small"
        value={utredningenRadioValg}
      >
        <HStack justify="space-between" width="300px">
          <Radio
            value={Radiovalg.BRA}
            onChange={() => updateKvalitetsvurdering({ id, utredningenRadioValg: Radiovalg.BRA })}
          >
            Bra/godt nok
          </Radio>
          <Radio
            value={Radiovalg.MANGELFULLT}
            onChange={() => updateKvalitetsvurdering({ id, utredningenRadioValg: Radiovalg.MANGELFULLT })}
          >
            Mangelfullt
          </Radio>
        </HStack>
      </RadioGroup>
      <Reasons
        error={validationError}
        show={utredningenRadioValg === Radiovalg.MANGELFULLT}
        legendText="Hva er mangelfullt?"
        reasons={reasons}
      />
    </FormSection>
  );
};
