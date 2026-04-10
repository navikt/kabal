import { HStack, Radio } from '@navikt/ds-react';
import { StyledRadioGroup } from '@/components/kvalitetsvurdering/common/styled-components';
import { Checkboxes } from '@/components/kvalitetsvurdering/v3/common/checkboxes';
import type { CheckboxParams } from '@/components/kvalitetsvurdering/v3/common/types';
import { useKvalitetsvurderingV3 } from '@/components/kvalitetsvurdering/v3/common/use-kvalitetsvurdering-v3';
import { useValidationError } from '@/components/kvalitetsvurdering/v3/common/use-validation-error';
import { MainReason } from '@/components/kvalitetsvurdering/v3/data';
import { getCheckbox } from '@/components/kvalitetsvurdering/v3/helpers';
import {
  BegrunnelsespliktenBoolean,
  BegrunnelsespliktenSaksdataHjemlerLists,
  ForeleggelsespliktenBoolean,
  ForhåndsvarslingBoolean,
  HEADER,
  JournalfoeringspliktenBoolean,
  KlageOgKlageforberedelsenBoolean,
  KlartSpraakBoolean,
  OmgjoeringBoolean,
  SaksbehandlingsregleneErrorFields,
  UtredningspliktenBoolean,
  VeiledningspliktenBoolean,
} from '@/components/kvalitetsvurdering/v3/saksbehandlingsreglene/data';
import { SectionWithHeading } from '@/components/section-with-heading/section-with-heading';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { Radiovalg } from '@/types/kaka-kvalitetsvurdering/radio';

export const Saksbehandlingsreglene = () => {
  const { isLoading, kvalitetsvurdering, update } = useKvalitetsvurderingV3();

  const canEdit = useCanEditBehandling();
  const validationError = useValidationError(MainReason.Saksbehandlingsreglene);

  if (isLoading) {
    return null;
  }

  const { saksbehandlingsregler } = kvalitetsvurdering;

  const onChange = (value: Radiovalg) => update({ saksbehandlingsregler: value });

  return (
    <SectionWithHeading heading={HEADER} size="small">
      <StyledRadioGroup
        legend={HEADER}
        hideLegend
        value={saksbehandlingsregler}
        error={validationError}
        onChange={onChange}
        id="saksbehandlingsreglene"
      >
        <HStack gap="space-16" width="100%" wrap={false}>
          <Radio value={Radiovalg.BRA} disabled={!canEdit}>
            Riktig / ikke kvalitetsavvik
          </Radio>
          <Radio value={Radiovalg.MANGELFULLT} disabled={!canEdit}>
            Mangelfullt/kvalitetsavvik
          </Radio>
        </HStack>
      </StyledRadioGroup>

      {saksbehandlingsregler === Radiovalg.MANGELFULLT ? (
        <Checkboxes
          kvalitetsvurdering={kvalitetsvurdering}
          update={update}
          childList={CHECKBOXES}
          groupErrorField={SaksbehandlingsregleneErrorFields.saksbehandlingsreglerGroup}
          label="Hva er mangelfullt/kvalitetsavviket?"
        />
      ) : null}
    </SectionWithHeading>
  );
};

const CHECKBOXES: CheckboxParams[] = [
  // Veiledningsplikten
  getCheckbox({
    field: VeiledningspliktenBoolean.saksbehandlingsreglerBruddPaaVeiledningsplikten,
    groupErrorField: SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaVeiledningspliktenGroup,
    childList: [
      getCheckbox({
        field: VeiledningspliktenBoolean.saksbehandlingsreglerVeiledningspliktenPartenHarIkkeFaattSvarPaaHenvendelser,
      }),
      getCheckbox({
        field: VeiledningspliktenBoolean.saksbehandlingsreglerVeiledningspliktenNavHarIkkeGittGodNokVeiledning,
      }),
    ],
  }),

  // Forhåndsvarsling
  getCheckbox({
    field: ForhåndsvarslingBoolean.saksbehandlingsreglerBruddPaaRegleneOmForhaandsvarsling,
    groupErrorField: SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaRegleneOmForhaandsvarslingGroup,
    childList: [
      getCheckbox({
        field: ForhåndsvarslingBoolean.saksbehandlingsreglerForhaandsvarslingPartenIkkeVarsletFoerVedtak,
      }),
      getCheckbox({
        field: ForhåndsvarslingBoolean.saksbehandlingsreglerForhaandsvarslingPartenVarsletMangelfullt,
      }),
    ],
  }),

  // Utredningsplikten
  getCheckbox({
    field: UtredningspliktenBoolean.saksbehandlingsreglerBruddPaaUtredningsplikten,
    groupErrorField: SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaUtredningspliktenGroup,
    childList: [
      getCheckbox({
        field:
          UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvMedisinskeForholdHarIkkeVaertGodNok,
      }),
      getCheckbox({
        field:
          UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvInntektsArbeidsforholdHarIkkeVaertGodNok,
      }),
      getCheckbox({
        field:
          UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvEoesUtenlandsforholdHarIkkeVaertGodNok,
      }),
      getCheckbox({
        field:
          UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvSivilstandsBoforholdHarIkkeVaertGodNok,
      }),
      getCheckbox({
        field:
          UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvSamvaersforholdHarIkkeVaertGodNok,
      }),
      getCheckbox({
        field:
          UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvAndreForholdISakenHarIkkeVaertGodNok,
      }),
    ],
  }),

  // Foreleggelsesplikten
  getCheckbox({
    field: ForeleggelsespliktenBoolean.saksbehandlingsreglerBruddPaaForeleggelsesplikten,
    groupErrorField: SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaForeleggelsespliktenGroup,
    childList: [
      getCheckbox({
        field:
          ForeleggelsespliktenBoolean.saksbehandlingsreglerForeleggelsespliktenUttalelseFraRaadgivendeLegeHarIkkeVaertForelagtParten,
      }),
      getCheckbox({
        field:
          ForeleggelsespliktenBoolean.saksbehandlingsreglerForeleggelsespliktenAndreOpplysningerISakenHarIkkeVaertForelagtParten,
      }),
    ],
  }),

  // Begrunnelsesplikten
  getCheckbox({
    field: BegrunnelsespliktenBoolean.saksbehandlingsreglerBruddPaaBegrunnelsesplikten,
    groupErrorField: SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaBegrunnelsespliktenGroup,
    childList: [
      getCheckbox({
        field: BegrunnelsespliktenBoolean.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenViserIkkeTilRegelverket,
        saksdatahjemler:
          BegrunnelsespliktenSaksdataHjemlerLists.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenViserIkkeTilRegelverketHjemlerList,
      }),
      getCheckbox({
        field: BegrunnelsespliktenBoolean.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeFaktum,
        saksdatahjemler:
          BegrunnelsespliktenSaksdataHjemlerLists.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeFaktumHjemlerList,
      }),
      getCheckbox({
        field:
          BegrunnelsespliktenBoolean.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeAvgjoerendeHensyn,
        saksdatahjemler:
          BegrunnelsespliktenSaksdataHjemlerLists.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeAvgjoerendeHensynHjemlerList,
      }),
    ],
  }),

  // Klage og klageforberedelse
  getCheckbox({
    field: KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaRegleneOmKlageOgKlageforberedelse,
    groupErrorField:
      SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaRegleneOmKlageOgKlageforberedelseGroup,
    childList: [
      getCheckbox({
        field:
          KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaKlageKlagefristenEllerOppreisningErIkkeVurdertEllerFeilVurdert,
      }),
      getCheckbox({
        field:
          KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaKlageDetErIkkeSoergetForRettingAvFeilIKlagensFormEllerInnhold,
      }),
      getCheckbox({
        field:
          KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaKlageUnderKlageforberedelsenErDetIkkeUtredetEllerGjortUndersoekelser,
      }),
      getCheckbox({
        field:
          KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaKlageRegleneIkkeFulgtTilTrossForNyttEnkeltvedtak,
      }),
    ],
  }),

  // Omgjøring
  getCheckbox({
    field: OmgjoeringBoolean.saksbehandlingsreglerBruddPaaRegleneOmOmgjoeringUtenforKlageOgAnke,
    groupErrorField:
      SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaRegleneOmOmgjoeringUtenforKlageOgAnkeGroup,
    childList: [
      getCheckbox({
        field: OmgjoeringBoolean.saksbehandlingsreglerOmgjoeringUgyldighetOgOmgjoeringErIkkeVurdertEllerFeilVurdert,
      }),
      getCheckbox({
        field:
          OmgjoeringBoolean.saksbehandlingsreglerOmgjoeringDetErFattetVedtakTilTrossForAtBeslutningVarRiktigAvgjoerelsesform,
      }),
    ],
  }),

  // Journalføringsplikten
  getCheckbox({
    field: JournalfoeringspliktenBoolean.saksbehandlingsreglerBruddPaaJournalfoeringsplikten,
    groupErrorField: SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaJournalfoeringspliktenGroup,
    childList: [
      getCheckbox({
        field:
          JournalfoeringspliktenBoolean.saksbehandlingsreglerJournalfoeringspliktenRelevanteOpplysningerErIkkeJournalfoert,
      }),
      getCheckbox({
        field:
          JournalfoeringspliktenBoolean.saksbehandlingsreglerJournalfoeringspliktenRelevanteOpplysningerHarIkkeGodNokTittelEllerDokumentkvalitet,
      }),
    ],
  }),

  // Klart språk
  getCheckbox({
    field: KlartSpraakBoolean.saksbehandlingsreglerBruddPaaPliktTilAaKommuniserePaaEtKlartSpraak,
    groupErrorField:
      SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaPliktTilAaKommuniserePaaEtKlartSpraakGroup,
    childList: [
      getCheckbox({
        field: KlartSpraakBoolean.saksbehandlingsreglerBruddPaaKlartSprakSpraketIVedtaketErIkkeKlartNok,
      }),
      getCheckbox({
        field: KlartSpraakBoolean.saksbehandlingsreglerBruddPaaKlartSprakSpraketIOversendelsesbrevetsErIkkeKlartNok,
      }),
    ],
  }),
];
