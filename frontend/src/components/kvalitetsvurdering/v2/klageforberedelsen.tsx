import { useCanEdit } from '@app/hooks/use-can-edit';
import { Radiovalg } from '@app/types/kaka-kvalitetsvurdering/radio';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { Radio } from '@navikt/ds-react';
import { Checkboxes } from './common/checkboxes';
import { HeadingWithHelpText } from './common/heading-with-helptext';
import { RadioButtonsRow, StyledRadioGroup } from './common/styled-components';
import { type InputParams, KvalitetsvurderingInput } from './common/types';
import { useKvalitetsvurderingV2FieldName } from './common/use-field-name';
import { useKvalitetsvurderingV2 } from './common/use-kvalitetsvurdering-v2';
import { useValidationError } from './common/use-validation-error';

export const Klageforberedelsen = () => {
  const { isLoading, kvalitetsvurdering, update, oppgave } = useKvalitetsvurderingV2();

  const canEdit = useCanEdit();
  const validationError = useValidationError('klageforberedelsen');
  const header = useKvalitetsvurderingV2FieldName('klageforberedelsen');

  if (isLoading || oppgave.typeId === SaksTypeEnum.ANKE || oppgave.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
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

const CHECKBOXES: InputParams[] = [
  {
    field: 'klageforberedelsenSakensDokumenter',
    type: KvalitetsvurderingInput.CHECKBOX,
    helpText:
      'Dokumentene er ikke fullstendige; f.eks. feil eller mangelfull journalføring av relevante opplysninger i klagebehandlingen.',
    label: 'Sakens dokumenter',
    groupErrorField: 'klageforberedelsenSakensDokumenterGroup',
    checkboxes: [
      {
        field: 'klageforberedelsenSakensDokumenterRelevanteOpplysningerFraAndreFagsystemerErIkkeJournalfoert',
        type: KvalitetsvurderingInput.CHECKBOX,
        helpText:
          'F.eks. notater, klager, referat eller andre opplysninger fra Arena, Pesys, Infotrygd, A-inntekt, Modia, eller digital aktivitetsplan.',
        label: 'Relevante opplysninger fra andre fagsystemer er ikke journalført',
      },
      {
        field: 'klageforberedelsenSakensDokumenterJournalfoerteDokumenterFeilNavn',
        type: KvalitetsvurderingInput.CHECKBOX,
        label: 'Journalførte dokumenter har feil titler/navn',
        helpText: 'F.eks. står det «fritekstbrev» i stedet for «vedtak», eller «samtale» i stedet for «klage».',
      },
      {
        field: 'klageforberedelsenSakensDokumenterManglerFysiskSaksmappe',
        type: KvalitetsvurderingInput.CHECKBOX,
        label: 'Mangler fysisk saksmappe',
        helpText: 'Gjelder kun i saker det er relevant/nødvendig.',
      },
    ],
  },
  {
    field: 'klageforberedelsenOversittetKlagefristIkkeKommentert',
    type: KvalitetsvurderingInput.CHECKBOX,
    label: 'Oversittet klagefrist er ikke kommentert eller vurdert feil',
  },
  {
    field: 'klageforberedelsenKlagersRelevanteAnfoerslerIkkeTilstrekkeligKommentertImoetegaatt',
    type: KvalitetsvurderingInput.CHECKBOX,
    label: 'Klagers relevante anførsler er ikke tilstrekkelig kommentert/imøtegått',
  },
  {
    field: 'klageforberedelsenFeilVedBegrunnelsenForHvorforAvslagOpprettholdesKlagerIkkeOppfyllerVilkaar',
    type: KvalitetsvurderingInput.CHECKBOX,
    label: 'Begrunnelsen i oversendelsesbrevet',
    helpText:
      'F.eks. er vilkår eller tema i oversendelsesbrevet vurdert feil, det er henvist til feil hjemler eller begrunnelsen er vanskelig å forstå.',
  },
  {
    field: 'klageforberedelsenOversendelsesbrevetsInnholdErIkkeISamsvarMedSakensTema',
    type: KvalitetsvurderingInput.CHECKBOX,
    label: 'Oversendelsesbrevets innhold er ikke i samsvar med sakens tema',
  },
  {
    field: 'klageforberedelsenOversendelsesbrevIkkeSendtKopiTilPartenEllerFeilMottaker',
    type: KvalitetsvurderingInput.CHECKBOX,
    label: 'Det er ikke sendt kopi av oversendelsesbrevet til parten, eller det er sendt til feil mottaker',
    helpText: 'F.eks. er oversendelsesbrevet ikke sendt til fullmektig i saken.',
  },
  {
    field: 'klageforberedelsenUtredningenUnderKlageforberedelsen',
    type: KvalitetsvurderingInput.CHECKBOX,
    label: 'Utredningen under klageforberedelsen',
    groupErrorField: 'klageforberedelsenUtredningenUnderKlageforberedelsenGroup',
    helpText:
      'Gjelder kvaliteten på utredningen under klageforberedelsen (fra vedtak ble fattet til saken ble oversendt klageinstansen). Gjelder kvaliteten på utredningen av opplysninger som Nav ikke har tilgang til. Dersom utredningen var mangelfull før vedtak ble fattet og dette ikke ble reparert under klageforberedelsen, huker du av for mangelfull utredning både her og under «Utredningen før vedtak».',
    checkboxes: [
      {
        field:
          'klageforberedelsenUtredningenUnderKlageforberedelsenKlageinstansenHarBedtUnderinstansenOmAaInnhenteNyeOpplysninger',
        type: KvalitetsvurderingInput.CHECKBOX,
        label: 'Klageinstansen har bedt underinstansen om å innhente nye opplysninger',
        checkboxes: [
          {
            field:
              'klageforberedelsenUtredningenUnderKlageforberedelsenKlageinstansenHarBedtUnderinstansenOmAaInnhenteNyeOpplysningerFritekst',
            type: KvalitetsvurderingInput.TEXTAREA,
            label: 'Skriv hvilke opplysninger som måtte hentes inn her (valgfri)',
            helpText:
              'Det du skriver her er kun for klageinstansens interne bruk og blir ikke synlig for vedtaksinstansen. Husk å skrive kort / med stikkord. Ikke skriv personopplysninger eller detaljer om saken.',
            description:
              'Det du skriver her er kun synlig for klageinstansen og ikke for vedtaksinstansen. Husk å ikke skrive personopplysninger.',
          },
        ],
      },
      {
        field: 'klageforberedelsenUtredningenUnderKlageforberedelsenKlageinstansenHarSelvInnhentetNyeOpplysninger',
        type: KvalitetsvurderingInput.CHECKBOX,
        label: 'Klageinstansen har selv innhentet nye opplysninger',
        checkboxes: [
          {
            field:
              'klageforberedelsenUtredningenUnderKlageforberedelsenKlageinstansenHarSelvInnhentetNyeOpplysningerFritekst',
            type: KvalitetsvurderingInput.TEXTAREA,
            label: 'Skriv hvilke opplysninger som måtte hentes inn her (valgfri)',
            helpText:
              'Det du skriver her er kun for klageinstansens interne bruk og blir ikke synlig for vedtaksinstansen. Husk å skrive kort / med stikkord. Ikke skriv personopplysninger eller detaljer om saken.',
            description:
              'Det du skriver her er kun synlig for klageinstansen og ikke for vedtaksinstansen. Husk å ikke skrive personopplysninger.',
          },
        ],
      },
    ],
  },
];
