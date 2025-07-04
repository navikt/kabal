import { useIsTildeltSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { Radiovalg } from '@app/types/kaka-kvalitetsvurdering/radio';
import { HStack, Radio } from '@navikt/ds-react';
import { Checkboxes } from './common/checkboxes';
import { HeadingWithHelpText } from './common/heading-with-helptext';
import { StyledRadioGroup } from './common/styled-components';
import { type InputParams, KvalitetsvurderingInput } from './common/types';
import { useKvalitetsvurderingV2FieldName } from './common/use-field-name';
import { useKvalitetsvurderingV2 } from './common/use-kvalitetsvurdering-v2';
import { useValidationError } from './common/use-validation-error';

const UTREDNINGEN_ID = 'utredningen';

export const Utredningen = () => {
  const { isLoading, kvalitetsvurdering, update } = useKvalitetsvurderingV2();

  const canEdit = useIsTildeltSaksbehandler();
  const validationError = useValidationError(UTREDNINGEN_ID);
  const header = useKvalitetsvurderingV2FieldName(UTREDNINGEN_ID);

  if (isLoading) {
    return null;
  }

  const { utredningen } = kvalitetsvurdering;

  const onChange = (value: Radiovalg) => update({ utredningen: value });

  return (
    <section>
      <HeadingWithHelpText helpText="Gjelder utredningen av saken i perioden frem til og med at vedtaket ble fattet. Gjelder kvaliteten på utredningen av opplysninger som Nav ikke har tilgang til.  Dersom opplysninger som er innhentet ikke er gode nok, og Nav burde bedt om presiseringer eller mer utdypede opplysninger, registreres det som mangelfullt. Dersom Nav har gjort et godt nok forsøk på å utrede saken, men opplysningene likevel er mangelfulle, er utredningen god nok. Er det kommet nye opplysninger etter at saken er oversendt klageinstansen, men som vedtaksinstansen burde innhentet før de fattet vedtak, skal dette også registreres som mangelfullt her.">
        {header}
      </HeadingWithHelpText>
      <StyledRadioGroup
        legend={header}
        hideLegend
        value={utredningen}
        error={validationError}
        onChange={onChange}
        id={UTREDNINGEN_ID}
      >
        <HStack gap="4" width="100%" wrap={false}>
          <Radio value={Radiovalg.BRA} disabled={!canEdit}>
            Bra/godt nok
          </Radio>
          <Radio value={Radiovalg.MANGELFULLT} disabled={!canEdit}>
            Mangelfullt
          </Radio>
        </HStack>
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

const CHECKBOXES: InputParams[] = [
  {
    field: 'utredningenAvMedisinskeForhold',
    label: 'Utredningen av medisinske forhold',
    helpText:
      'F.eks. er det ikke innhentet uttalelse fra en behandler eller rapport fra rehabiliteringsopphold. Dersom opplysninger som er innhentet ikke er gode nok, og Nav burde bedt om presiseringer eller mer utdypede opplysninger, registreres det her.',
    type: KvalitetsvurderingInput.CHECKBOX,
  },
  {
    field: 'utredningenAvInntektsforhold',
    label: 'Utredningen av inntektsforhold',
    helpText: 'F.eks. er det ikke innhentet lønnslipper eller kontoopplysninger.',
    type: KvalitetsvurderingInput.CHECKBOX,
  },
  {
    field: 'utredningenAvArbeidsaktivitet',
    label: 'Utredningen av arbeidsaktivitet',
    helpText: 'F.eks. er det ikke innhentet arbeidskontrakt, timelister, eller rapporter fra tiltak.',
    type: KvalitetsvurderingInput.CHECKBOX,
  },
  {
    field: 'utredningenAvEoesUtenlandsproblematikk',
    label: 'Utredningen av EØS-/utenlandsproblematikk',
    helpText:
      'F.eks. er det ikke er innhentet opplysninger om trygdetid i andre land. Er EØS-/utenlandsproblematikk ikke fanget opp i det hele tatt, registreres også det her.',
    type: KvalitetsvurderingInput.CHECKBOX,
  },
  {
    field: 'utredningenAvSivilstandBoforhold',
    label: 'Utredningen av sivilstand/boforhold',
    helpText: 'Du registrerer også her om boforhold/sivilstand er av betydning, men ikke avklart.',
    type: KvalitetsvurderingInput.CHECKBOX,
  },

  {
    field: 'utredningenAvAndreAktuelleForholdISaken',
    label: 'Utredningen av andre aktuelle forhold i saken',
    helpText:
      'Du kan skrive konkret hvilke feil ved utredningen av andre aktuelle forhold det gjelder under «Annet» nederst.',
    type: KvalitetsvurderingInput.CHECKBOX,
  },
];
