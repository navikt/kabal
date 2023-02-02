import { Radio } from '@navikt/ds-react';
import React from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { Radiovalg } from '../../../types/kaka-kvalitetsvurdering/radio';
import { Checkboxes } from './common/checkboxes';
import { HeadingWithHelpText } from './common/heading-with-helptext';
import { RadioButtonsRow, StyledRadioGroup } from './common/styled-components';
import { ICheckboxParams } from './common/types';
import { useKvalitetsvurderingV2FieldName } from './common/use-field-name';
import { useKvalitetsvurderingV2 } from './common/use-kvalitetsvurdering-v2';
import { useValidationError } from './common/use-validation-error';

export const Utredningen = () => {
  const { isLoading, kvalitetsvurdering, update } = useKvalitetsvurderingV2();

  const canEdit = useCanEdit();
  const validationError = useValidationError('utredningen');
  const header = useKvalitetsvurderingV2FieldName('utredningen');

  if (isLoading) {
    return null;
  }

  const { utredningen } = kvalitetsvurdering;

  const onChange = (value: Radiovalg) => update({ utredningen: value });

  return (
    <section>
      <HeadingWithHelpText helpText="Gjelder kvaliteten på utredningen av opplysninger som NAV ikke har tilgang til. Gjelder utredningen av saken i perioden frem til og med oversendelse til klageinstansen. Er det kommet nye opplysninger etter at saken er oversendt klageinstansen, men som vedtaksinstansen burde innhentet, skal dette også registreres her.">
        {header}
      </HeadingWithHelpText>
      <StyledRadioGroup
        legend={header}
        hideLegend
        value={utredningen}
        error={validationError}
        onChange={onChange}
        id="utredningen"
        size="small"
      >
        <RadioButtonsRow>
          <Radio value={Radiovalg.BRA} disabled={!canEdit}>
            Bra/godt nok
          </Radio>
          <Radio value={Radiovalg.MANGELFULLT} disabled={!canEdit}>
            Mangelfullt
          </Radio>
        </RadioButtonsRow>
      </StyledRadioGroup>

      <Checkboxes
        kvalitetsvurdering={kvalitetsvurdering}
        checkboxes={CHECKBOXES}
        update={update}
        show={utredningen === Radiovalg.MANGELFULLT}
        groupErrorField="utredningenGroup"
        label="Hva er mangelfullt?"
      />
    </section>
  );
};

const CHECKBOXES: ICheckboxParams[] = [
  {
    field: 'utredningenAvMedisinskeForhold',
    helpText:
      'F.eks. er det ikke innhentet uttalelse fra en behandler eller rapport fra rehabiliteringsopphold. Dersom opplysninger som er innhentet ikke er gode nok, og NAV burde bedt om presiseringer eller mer utdypede opplysninger, registreres det her.',
    label: 'Utredningen av medisinske forhold.',
  },
  {
    field: 'utredningenAvInntektsforhold',
    helpText: 'F.eks. er det ikke innhentet lønnslipper eller kontoopplysninger.',
    label: 'Utredningen av inntektsforhold.',
  },
  {
    field: 'utredningenAvArbeidsaktivitet',
    helpText: 'F.eks. er det ikke innhentet arbeidskontrakt, timelister, eller rapporter fra tiltak.',
    label: 'Utredningen av arbeidsaktivitet.',
  },
  {
    field: 'utredningenAvEoesUtenlandsproblematikk',
    helpText:
      'F.eks. er det ikke er innhentet opplysninger om trygdetid i andre land. Er EØS-/utenlandsproblematikk ikke fanget opp i det hele tatt, registreres også det her.',
    label: 'Utredningen av EØS-/utenlandsproblematikk.',
  },
  {
    field: 'utredningenAvAndreAktuelleForholdISaken',
    label: 'Utredningen av andre aktuelle forhold i saken.',
    helpText:
      'Du kan skrive konkret hvilke feil ved utredningen av andre aktuelle forhold det gjelder i fritekstfeltet nederst.',
  },
];
