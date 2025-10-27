import { HelpTextRadio } from '@app/components/kvalitetsvurdering/common/kvalitetsvurdering-checkbox';
import { StyledRadioGroup } from '@app/components/kvalitetsvurdering/common/styled-components';
import { Checkboxes } from '@app/components/kvalitetsvurdering/v3/common/checkboxes';
import type { CheckboxParams } from '@app/components/kvalitetsvurdering/v3/common/types';
import { useKvalitetsvurderingV3 } from '@app/components/kvalitetsvurdering/v3/common/use-kvalitetsvurdering-v3';
import { useValidationError } from '@app/components/kvalitetsvurdering/v3/common/use-validation-error';
import { MainReason } from '@app/components/kvalitetsvurdering/v3/data';
import { getCheckbox } from '@app/components/kvalitetsvurdering/v3/helpers';
import {
  HEADER,
  TrygdemedisinBoolean,
  TrygdemedisinErrorFields,
} from '@app/components/kvalitetsvurdering/v3/trygdemedisin/data';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useIsRelevantYtelseForRaadgivende } from '@app/hooks/use-is-relevant-ytelse-for-raadgivende';
import { RadiovalgExtended } from '@app/types/kaka-kvalitetsvurdering/radio';
import { Heading, HStack, Radio } from '@navikt/ds-react';

export const Trygdemedisin = () => {
  const { isLoading, kvalitetsvurdering, update, oppgave } = useKvalitetsvurderingV3();
  const show = useIsRelevantYtelseForRaadgivende(oppgave?.ytelseId ?? null);

  const canEdit = useCanEditBehandling();
  const validationError = useValidationError(MainReason.Trygdemedisin);

  if (!show || isLoading) {
    return null;
  }

  const { brukAvRaadgivendeLege } = kvalitetsvurdering;

  const onChange = (value: RadiovalgExtended) => update({ brukAvRaadgivendeLege: value });

  return (
    <section>
      <Heading size="small">{HEADER}</Heading>
      <StyledRadioGroup
        legend={HEADER}
        hideLegend
        value={brukAvRaadgivendeLege}
        error={validationError}
        onChange={onChange}
        id="trygdemedisin"
      >
        <HStack gap="4" width="100%" wrap={false}>
          <HelpTextRadio
            helpText="Du registrerer her dersom den konkrete saken ikke gjelder trygdemedisinske spørsmål."
            value={RadiovalgExtended.IKKE_AKTUELT}
            disabled={!canEdit}
          >
            Ikke aktuelt for den konkrete saken
          </HelpTextRadio>

          <HelpTextRadio
            helpText="Du registrerer her om den konkrete saken gjelder trygdemedisinske spørsmål og det er ok at rådgivende lege ikke er brukt, eller bruken av rådgivende lege er god nok."
            value={RadiovalgExtended.BRA}
            disabled={!canEdit}
          >
            Riktig / ikke kvalitetsavvik
          </HelpTextRadio>

          <Radio value={RadiovalgExtended.MANGELFULLT} disabled={!canEdit}>
            Mangelfullt/kvalitetsavvik
          </Radio>
        </HStack>
      </StyledRadioGroup>

      {brukAvRaadgivendeLege === RadiovalgExtended.MANGELFULLT ? (
        <Checkboxes
          kvalitetsvurdering={kvalitetsvurdering}
          childList={CHECKBOXES}
          update={update}
          groupErrorField={TrygdemedisinErrorFields.brukAvRaadgivendeLegeGroup}
          label="Hva er mangelfullt/kvalitetsavviket?"
        />
      ) : null}
    </section>
  );
};

const CHECKBOXES: CheckboxParams[] = [
  getCheckbox({ field: TrygdemedisinBoolean.raadgivendeLegeIkkebrukt }),
  getCheckbox({ field: TrygdemedisinBoolean.raadgivendeLegeMangelfullBrukAvRaadgivendeLege }),
  getCheckbox({ field: TrygdemedisinBoolean.raadgivendeLegeUttaltSegOmTemaUtoverTrygdemedisin }),
  getCheckbox({ field: TrygdemedisinBoolean.raadgivendeLegeBegrunnelseMangelfullEllerIkkeDokumentert }),
];
