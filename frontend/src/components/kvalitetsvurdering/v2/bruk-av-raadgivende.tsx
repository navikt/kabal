import { Radio } from '@navikt/ds-react';
import React from 'react';
import { useCanEdit } from '../../../hooks/use-can-edit';
import { useIsRelevantYtelseForRaadgivende } from '../../../hooks/use-is-relevant-ytelse-for-raadgivende';
import { RadiovalgExtended } from '../../../types/kaka-kvalitetsvurdering/radio';
import { Checkboxes } from './common/checkboxes';
import { ContainerWithHelpText } from './common/container-with-helptext';
import { StyledHeading, StyledRadioGroup } from './common/styled-components';
import { ICheckboxParams } from './common/types';
import { useKvalitetsvurderingV2FieldName } from './common/use-field-name';
import { useKvalitetsvurderingV2 } from './common/use-kvalitetsvurdering-v2';
import { useValidationError } from './common/use-validation-error';

export const BrukAvRaadgivendeLege = () => {
  const { isLoading, kvalitetsvurdering, update, oppgave } = useKvalitetsvurderingV2();
  const show = useIsRelevantYtelseForRaadgivende(oppgave?.ytelse ?? null);

  const canEdit = useCanEdit();
  const validationError = useValidationError('brukAvRaadgivendeLege');
  const header = useKvalitetsvurderingV2FieldName('brukAvRaadgivendeLege');

  if (!show || isLoading) {
    return null;
  }

  const { brukAvRaadgivendeLege } = kvalitetsvurdering;

  const onChange = (value: RadiovalgExtended) => update({ brukAvRaadgivendeLege: value });

  return (
    <section>
      <StyledHeading size="small">{header}</StyledHeading>
      <StyledRadioGroup
        legend={header}
        hideLegend
        value={brukAvRaadgivendeLege}
        error={validationError}
        onChange={onChange}
        id="brukAvRaadgivendeLege"
        size="small"
      >
        <ContainerWithHelpText helpText="Du registrerer her dersom den konkrete saken ikke gjelder trygdemedisinske spørsmål.">
          <Radio value={RadiovalgExtended.IKKE_AKTUELT} disabled={!canEdit}>
            Ikke aktuelt for den konkrete saken
          </Radio>
        </ContainerWithHelpText>

        <ContainerWithHelpText helpText="Du registrerer her om den konkrete saken gjelder trygdemedisinske spørsmål og det er ok at rådgivende lege ikke er brukt, eller bruken av rådgivende lege er god nok.">
          <Radio value={RadiovalgExtended.BRA} disabled={!canEdit}>
            Bra/godt nok
          </Radio>
        </ContainerWithHelpText>

        <Radio value={RadiovalgExtended.MANGELFULLT} disabled={!canEdit}>
          Mangelfullt
        </Radio>
      </StyledRadioGroup>

      <Checkboxes
        kvalitetsvurdering={kvalitetsvurdering}
        checkboxes={CHECKBOXES}
        update={update}
        show={brukAvRaadgivendeLege === RadiovalgExtended.MANGELFULLT}
        groupErrorField="raadgivendeLegeGroup"
        label="Hva er mangelfullt?"
      />
    </section>
  );
};

const CHECKBOXES: ICheckboxParams[] = [
  {
    field: 'raadgivendeLegeIkkebrukt',
    helpText:
      'Du registrerer her om rådgivende lege burde vært brukt av underinstansen for å sikre og/eller synliggjøre at det trygdemedisinske er forstått riktig.',
    label: 'Rådgivende lege er ikke brukt.',
  },
  {
    field: 'raadgivendeLegeMangelfullBrukAvRaadgivendeLege',
    helpText:
      'F.eks. har saksbehandler stilt feil spørsmål, eller saksbehandler har lagt for mye vekt på vurdering fra rådgivende lege/brukt som «fasit».',
    label: 'Saksbehandlers bruk av rådgivende lege er mangelfull.',
  },
  {
    field: 'raadgivendeLegeUttaltSegOmTemaUtoverTrygdemedisin',
    label: 'Rådgivende lege har uttalt seg om tema utover trygdemedisin.',
  },
  {
    field: 'raadgivendeLegeBegrunnelseMangelfullEllerIkkeDokumentert',
    helpText:
      'Du registrerer her om begrunnelsen er dokumentert, men for tynn, f.eks. kun inneholder en konklusjon. Du registrerer her om det ikke går frem hva slags dokumentasjon rådgivende lege har sett. Du registrerer også her om vurderingen fra rådgivende lege ikke er dokumentert i det hele tatt.',
    label: 'Rådgivende lege er brukt, men begrunnelsen fra rådgivende lege er mangelfull eller ikke dokumentert.',
  },
];
