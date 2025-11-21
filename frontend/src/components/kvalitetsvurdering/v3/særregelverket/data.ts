import { MAIN_REASON_LABELS, MainReason } from '@app/components/kvalitetsvurdering/v3/data';

export const HEADER = MAIN_REASON_LABELS[MainReason.Særregelverket];

export enum SærregelverketBoolean {
  saerregelverkAutomatiskVedtak = 'saerregelverkAutomatiskVedtak',
  saerregelverkLovenErTolketEllerAnvendtFeil = 'saerregelverkLovenErTolketEllerAnvendtFeil',
  saerregelverkVedtaketByggerPaaFeilHjemmelEllerLovtolkning = 'saerregelverkVedtaketByggerPaaFeilHjemmelEllerLovtolkning',
  saerregelverkVedtaketByggerPaaFeilKonkretRettsanvendelseEllerSkjoenn = 'saerregelverkVedtaketByggerPaaFeilKonkretRettsanvendelseEllerSkjoenn',
  saerregelverkDetErLagtTilGrunnFeilFaktum = 'saerregelverkDetErLagtTilGrunnFeilFaktum',
}

// All registreringshjemler for ytelse
export enum SærregelverketHjemlerFromYtelseList {
  saerregelverkVedtaketByggerPaaFeilHjemmelEllerLovtolkningHjemlerList = 'saerregelverkVedtaketByggerPaaFeilHjemmelEllerLovtolkningHjemlerList',
}

// Selected registreringshjemler from saksdata
export enum SærregelverketSaksdataHjemlerList {
  saerregelverkVedtaketByggerPaaFeilKonkretRettsanvendelseEllerSkjoennHjemlerList = 'saerregelverkVedtaketByggerPaaFeilKonkretRettsanvendelseEllerSkjoennHjemlerList',
  saerregelverkDetErLagtTilGrunnFeilFaktumHjemlerList = 'saerregelverkDetErLagtTilGrunnFeilFaktumHjemlerList',
}

type Fields = SærregelverketBoolean | SærregelverketHjemlerFromYtelseList | SærregelverketSaksdataHjemlerList;

const FIELDS = Object.values({
  ...SærregelverketBoolean,
  ...SærregelverketHjemlerFromYtelseList,
  ...SærregelverketSaksdataHjemlerList,
});

export const isSærregelverketField = (field: string): field is Fields => FIELDS.some((f) => f === field);

export enum SærregelverketErrorFields {
  saerregelverkGroup = 'saerregelverkGroup',
  saerregelverkLovenErTolketEllerAnvendtFeilGroup = 'saerregelverkLovenErTolketEllerAnvendtFeilGroup',
}

const ERROR_FIELDS = Object.values(SærregelverketErrorFields);

export const isSærregelverketErrorField = (value: string): value is SærregelverketErrorFields =>
  ERROR_FIELDS.some((f) => f === value);

export const SÆRREGELVERKET_LABELS: Record<Fields, string> = {
  [SærregelverketBoolean.saerregelverkAutomatiskVedtak]: 'Automatisk vedtak',
  [SærregelverketBoolean.saerregelverkLovenErTolketEllerAnvendtFeil]: 'Loven er tolket eller anvendt feil i vedtaket',
  [SærregelverketBoolean.saerregelverkVedtaketByggerPaaFeilHjemmelEllerLovtolkning]:
    'Vedtaket bygger på feil hjemmel eller lovtolkning',
  [SærregelverketBoolean.saerregelverkVedtaketByggerPaaFeilKonkretRettsanvendelseEllerSkjoenn]:
    'Vedtaket bygger på feil konkret rettsanvendelse eller skjønnsutøvelse',
  [SærregelverketBoolean.saerregelverkDetErLagtTilGrunnFeilFaktum]: 'Det er lagt til grunn feil faktum i vedtaket',
  [SærregelverketHjemlerFromYtelseList.saerregelverkVedtaketByggerPaaFeilHjemmelEllerLovtolkningHjemlerList]:
    'Hjemler for «Vedtaket bygger på feil hjemmel eller lovtolkning»',
  [SærregelverketSaksdataHjemlerList.saerregelverkVedtaketByggerPaaFeilKonkretRettsanvendelseEllerSkjoennHjemlerList]:
    'Hjemler for «Vedtaket bygger på feil konkret rettsanvendelse eller skjønnsutøvelse»',
  [SærregelverketSaksdataHjemlerList.saerregelverkDetErLagtTilGrunnFeilFaktumHjemlerList]:
    'Hjemler for «Vedtaket er lagt til grunn feil faktum i vedtaket»',
};

export const SÆRREGELVERKET_ERROR_LABELS: Record<SærregelverketErrorFields, string> = {
  [SærregelverketErrorFields.saerregelverkGroup]: HEADER,
  [SærregelverketErrorFields.saerregelverkLovenErTolketEllerAnvendtFeilGroup]:
    SÆRREGELVERKET_LABELS[SærregelverketBoolean.saerregelverkLovenErTolketEllerAnvendtFeil],
};

export const SÆRREGELVERKET_HELP_TEXTS: Partial<Record<SærregelverketBoolean, string>> = {
  [SærregelverketBoolean.saerregelverkVedtaketByggerPaaFeilHjemmelEllerLovtolkning]:
    'Du velger denne dersom det er brukt feil hjemmel i vedtaket, alle relevante hjemler ikke er vurdert i vedtaket, eller vedtaket bygger på feil i lovtolkningen. For eksempel dersom vedtaket mangler hjemmel i lov fordi lovbestemmelsen er tolket i strid med ordlyden. Se også spørsmål om begrunnelsesplikt, hvis vedtaket ikke presenterer innholdet av reglene på en forståelig nok måte.',
  [SærregelverketBoolean.saerregelverkVedtaketByggerPaaFeilKonkretRettsanvendelseEllerSkjoenn]:
    'Det er ikke hensiktsmessig å trekke et skarpt skille mellom konkret rettsanvendelse og skjønnsutøvelse i vedtak som bygger på lovbundet skjønn. Du velger derfor denne uansett om feilen ligger nærmest konkret rettsanvendelse eller skjønnsutøvelse. Det er svært viktig at du også krysser av for feil i hjemmelsgrunnlaget/lovtolkningen dersom feilen i den konkrete rettsanvendelsen eller skjønnsutøvelsen er en følgefeil. Se også spørsmål om begrunnelsesplikt, hvis vedtaket ikke nevner de hensyn som har vært avgjørende for skjønnsutøvelsen som vedtaket bygger på.',
  [SærregelverketBoolean.saerregelverkDetErLagtTilGrunnFeilFaktum]:
    'Du velger denne dersom vedtaket ikke bygger på riktig faktum. For eksempel fordi viktige bevis er oversett, eller det er lagt feil vekt på ulike bevis. Se også spørsmål om utredningsplikt og begrunnelsesplikt, hvis dokumentasjon ikke er hentet inn eller sentrale deler av faktum ikke er omtalt i vedtaket.',
};
