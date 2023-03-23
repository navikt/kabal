import { Radio } from '@navikt/ds-react';
import React from 'react';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { Radiovalg } from '@app/types/kaka-kvalitetsvurdering/radio';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { Checkboxes } from './common/checkboxes';
import { HeadingWithHelpText } from './common/heading-with-helptext';
import { RadioButtonsRow, StyledRadioGroup } from './common/styled-components';
import { ICheckboxParams } from './common/types';
import { useKvalitetsvurderingV2FieldName } from './common/use-field-name';
import { useKvalitetsvurderingV2 } from './common/use-kvalitetsvurdering-v2';
import { useValidationError } from './common/use-validation-error';

export const Klageforberedelsen = () => {
  const { isLoading, kvalitetsvurdering, update, oppgave } = useKvalitetsvurderingV2();

  const canEdit = useCanEdit();
  const validationError = useValidationError('klageforberedelsen');
  const header = useKvalitetsvurderingV2FieldName('klageforberedelsen');

  if (isLoading || oppgave.type === SaksTypeEnum.ANKE || oppgave.type === SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
    return null;
  }

  const { klageforberedelsen } = kvalitetsvurdering;

  const onChange = (value: Radiovalg) => update({ klageforberedelsen: value });

  return (
    <section>
      <HeadingWithHelpText helpText="Underinstansen skal gjøre de undersøkelser klagen gir grunn til, og vurdere om de skal endre eget vedtak. De skal imøtegå klagers anførsler og begrunne hvorfor vedtaket blir opprettholdt. Underinstansen har ansvar for å sørge for at alle dokumenter som hører til klagesaken er gjort tilgjengelige for klageinstansen. Underinstansen skal sende kopi av oversendelsesbrevet til parten.">
        {header}
      </HeadingWithHelpText>
      <StyledRadioGroup
        legend={header}
        hideLegend
        value={klageforberedelsen}
        error={validationError}
        onChange={onChange}
        id="klageforberedelsen"
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
        update={update}
        checkboxes={CHECKBOXES}
        show={klageforberedelsen === Radiovalg.MANGELFULLT}
        groupErrorField="klageforberedelsenGroup"
        label="Hva er mangelfullt?"
      />
    </section>
  );
};

const CHECKBOXES: ICheckboxParams[] = [
  {
    field: 'klageforberedelsenSakensDokumenter',
    helpText:
      'Dokumentene er ikke fullstendige; f.eks. feil eller mangelfull journalføring av relevante opplysninger i klagebehandlingen.',
    label: 'Sakens dokumenter.',
    groupErrorField: 'klageforberedelsenSakensDokumenterGroup',
    checkboxes: [
      {
        field: 'klageforberedelsenSakensDokumenterRelevanteOpplysningerFraAndreFagsystemerErIkkeJournalfoert',
        helpText:
          'F.eks. notater, klager, referat eller andre opplysninger fra Arena,  Pesys, Infotrygd, A-inntekt, Modia, eller digital aktivitetsplan.',
        label: 'Relevante opplysninger fra andre fagsystemer er ikke journalført.',
      },
      {
        field: 'klageforberedelsenSakensDokumenterJournalfoerteDokumenterFeilNavn',
        helpText: 'F.eks. står det «fritekstbrev» i stedet for «vedtak», eller «samtale» i stedet for «klage».',
        label: 'Journalførte dokumenter har feil titler/navn.',
      },
      {
        field: 'klageforberedelsenSakensDokumenterManglerFysiskSaksmappe',
        helpText: 'Gjelder kun i saker det er relevant/nødvendig.',
        label: 'Mangler fysisk saksmappe.',
      },
    ],
  },
  {
    field: 'klageforberedelsenOversittetKlagefristIkkeKommentert',
    label: 'Oversittet klagefrist er ikke kommentert.',
  },
  {
    field: 'klageforberedelsenKlagersRelevanteAnfoerslerIkkeTilstrekkeligKommentertImoetegaatt',
    label: 'Klagers relevante anførsler er ikke tilstrekkelig kommentert/imøtegått.',
  },
  {
    field: 'klageforberedelsenFeilVedBegrunnelsenForHvorforAvslagOpprettholdesKlagerIkkeOppfyllerVilkaar',
    label: 'Feil ved begrunnelsen for hvor avslag opprettholdes/klager ikke oppfyller vilkår.',
  },
  {
    field: 'klageforberedelsenOversendelsesbrevetsInnholdErIkkeISamsvarMedSakensTema',
    label: 'Oversendelsesbrevets innhold er ikke i samsvar med sakens tema.',
  },
  {
    field: 'klageforberedelsenOversendelsesbrevIkkeSendtKopiTilPartenEllerFeilMottaker',
    helpText: 'F.eks. er oversendelsesbrevet ikke sendt til fullmektig i saken.',
    label: 'Det er ikke sendt kopi av oversendelsesbrevet til parten, eller det er sendt til feil mottaker.',
  },
];
