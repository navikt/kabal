import { HStack, Radio } from '@navikt/ds-react';
import { Alert } from '@/components/alert/alert';
import { HelpTextCheckBox } from '@/components/kvalitetsvurdering/common/kvalitetsvurdering-checkbox';
import { StyledRadioGroup } from '@/components/kvalitetsvurdering/common/styled-components';
import { Checkboxes } from '@/components/kvalitetsvurdering/v3/common/checkboxes';
import type { CheckboxParams } from '@/components/kvalitetsvurdering/v3/common/types';
import { useKvalitetsvurderingV3 } from '@/components/kvalitetsvurdering/v3/common/use-kvalitetsvurdering-v3';
import { useValidationError } from '@/components/kvalitetsvurdering/v3/common/use-validation-error';
import { MainReason } from '@/components/kvalitetsvurdering/v3/data';
import { getCheckbox } from '@/components/kvalitetsvurdering/v3/helpers';
import {
  HEADER,
  SÆRREGELVERKET_LABELS,
  SærregelverketBoolean,
  SærregelverketErrorFields,
  SærregelverketHjemlerFromYtelseList,
  SærregelverketSaksdataHjemlerList,
} from '@/components/kvalitetsvurdering/v3/særregelverket/data';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { Radiovalg } from '@/types/kaka-kvalitetsvurdering/radio';

const vedtaketAutomatiskVedtakhelpText =
  'Du skal gjøre de samme kvalitetsvurderingene for automatiske vedtak som for andre vedtak. Du kan krysse av for automatisk vedtak dersom det er tydelig merket i vedtaket.';

export const Særregelverket = () => {
  const { isLoading, kvalitetsvurdering, update } = useKvalitetsvurderingV3();

  const canEdit = useCanEditBehandling();
  const validationError = useValidationError(MainReason.Særregelverket);

  if (isLoading) {
    return null;
  }

  const { saerregelverkAutomatiskVedtak, saerregelverk } = kvalitetsvurdering;

  const onChange = (value: Radiovalg) => update({ saerregelverk: value });

  return (
    <SectionWithHeading heading={HEADER} size="small">
      {saerregelverkAutomatiskVedtak === true ? <Alert variant="info">{vedtaketAutomatiskVedtakhelpText}</Alert> : null}
      <HelpTextCheckBox
        helpText={vedtaketAutomatiskVedtakhelpText}
        value={SærregelverketBoolean.saerregelverkAutomatiskVedtak}
        checked={saerregelverkAutomatiskVedtak}
        onChange={({ target }) => update({ saerregelverkAutomatiskVedtak: target.checked })}
        disabled={!canEdit}
      >
        {SÆRREGELVERKET_LABELS[SærregelverketBoolean.saerregelverkAutomatiskVedtak]}
      </HelpTextCheckBox>

      <StyledRadioGroup
        legend={HEADER}
        hideLegend
        value={saerregelverk}
        error={validationError}
        onChange={onChange}
        id={MainReason.Særregelverket}
      >
        <HStack gap="space-16" width="100%">
          <Radio value={Radiovalg.BRA} disabled={!canEdit}>
            Riktig / ikke kvalitetsavvik
          </Radio>
          <Radio value={Radiovalg.MANGELFULLT} disabled={!canEdit}>
            Mangelfullt/kvalitetsavvik
          </Radio>
        </HStack>
      </StyledRadioGroup>

      {saerregelverk === Radiovalg.MANGELFULLT ? (
        <Checkboxes
          kvalitetsvurdering={kvalitetsvurdering}
          update={update}
          childList={CHECKBOXES}
          groupErrorField={SærregelverketErrorFields.saerregelverkGroup}
          label="Hva er mangelfullt/kvalitetsavviket?"
        />
      ) : null}
    </SectionWithHeading>
  );
};

const CHECKBOXES: CheckboxParams[] = [
  getCheckbox({
    field: SærregelverketBoolean.saerregelverkLovenErTolketEllerAnvendtFeil,
    groupErrorField: SærregelverketErrorFields.saerregelverkLovenErTolketEllerAnvendtFeilGroup,
    childList: [
      getCheckbox({
        field: SærregelverketBoolean.saerregelverkVedtaketByggerPaaFeilHjemmelEllerLovtolkning,
        allRegistreringshjemler:
          SærregelverketHjemlerFromYtelseList.saerregelverkVedtaketByggerPaaFeilHjemmelEllerLovtolkningHjemlerList,
      }),
      getCheckbox({
        field: SærregelverketBoolean.saerregelverkVedtaketByggerPaaFeilKonkretRettsanvendelseEllerSkjoenn,
        saksdatahjemler:
          SærregelverketSaksdataHjemlerList.saerregelverkVedtaketByggerPaaFeilKonkretRettsanvendelseEllerSkjoennHjemlerList,
      }),
    ],
  }),
  getCheckbox({
    field: SærregelverketBoolean.saerregelverkDetErLagtTilGrunnFeilFaktum,
    saksdatahjemler: SærregelverketSaksdataHjemlerList.saerregelverkDetErLagtTilGrunnFeilFaktumHjemlerList,
  }),
];
