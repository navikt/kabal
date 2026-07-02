import type { Enhet } from '@/types/oppgavebehandling/oppgavebehandling';

interface IEnhet {
  id: string;
  navn: string;
  lovligeYtelser: string[];
}

export interface ISettings {
  hjemler: string[];
  ytelser: string[];
}

// Employee from vedtaksinstans or KA.
export interface INavEmployee {
  navIdent: string;
  navn: string;
}

export interface INavEmployeeWithEnhet extends INavEmployee {
  ansattEnhetId: string;
}

export interface IUserData extends INavEmployee {
  navIdent: string;
  navn: string;
  roller: Role[];
  enheter: IEnhet[];
  ansattEnhet: IEnhet;
  tildelteYtelser: string[];
}

export interface UserInfo {
  navIdent: string;
  sammensattNavn: string;
  fornavn: string;
  etternavn: string;
  enhet: Enhet;
}

interface ICustomUserInfo {
  customLongName: string | null;
  customShortName: string | null;
  customJobTitle: string | null;
  anonymous: boolean;
}

export interface ISignatureResponse extends ICustomUserInfo {
  longName: string;
  generatedShortName: string;
}

export enum Role {
  KABAL_SAKSBEHANDLING = 'KABAL_SAKSBEHANDLING',
  KABAL_INNSYN_EGEN_ENHET = 'KABAL_INNSYN_EGEN_ENHET',
  KABAL_OPPGAVESTYRING_ALLE_ENHETER = 'KABAL_OPPGAVESTYRING_ALLE_ENHETER',
  KABAL_TILGANGSSTYRING_EGEN_ENHET = 'KABAL_TILGANGSSTYRING_EGEN_ENHET',
  KABAL_FAGTEKSTREDIGERING = 'KABAL_FAGTEKSTREDIGERING',
  KABAL_MALTEKSTREDIGERING = 'KABAL_MALTEKSTREDIGERING',
  KABAL_ROL = 'KABAL_ROL',
  KABAL_KROL = 'KABAL_KROL',
  KABAL_SVARBREVINNSTILLINGER = 'KABAL_SVARBREVINNSTILLINGER',
  KABAL_ADMIN = 'KABAL_ADMIN',
  KAKA_SAKSBEHANDLER = 'KAKA_SAKSBEHANDLER',
  KAKA_EXCEL_UTTREKK_MED_FRITEKSTFELT = 'KAKA_EXCEL_UTTREKK_MED_FRITEKSTFELT',
  KAKA_EXCEL_UTTREKK_UTEN_FRITEKSTFELT = 'KAKA_EXCEL_UTTREKK_UTEN_FRITEKSTFELT',
  KAKA_KA_KVALITETSREGISTRERING = 'KAKA_KA_KVALITETSREGISTRERING',
  KAKA_KA_LEDERSTATISTIKK_MED_ANSATTFILTER = 'KAKA_KA_LEDERSTATISTIKK_MED_ANSATTFILTER',
  KAKA_KVALITETSTILBAKEMELDING_FOR_LEDER_I_VEDTAKSIN = 'KAKA_KVALITETSTILBAKEMELDING_FOR_LEDER_I_VEDTAKSIN',
  KAKA_TOTALSTATISTIKK = 'KAKA_TOTALSTATISTIKK',
  KAKA_KVALITETSVURDERING = 'KAKA_KVALITETSVURDERING',
  GOSYS_NASJONAL = 'GOSYS_NASJONAL',
  STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
  FORTROLIG = 'FORTROLIG',
  EGEN_ANSATT = 'EGEN_ANSATT',
}

export const ROLE_NAMES: Record<Role, string> = {
  [Role.KABAL_SAKSBEHANDLING]: 'Kabal saksbehandling',
  [Role.KABAL_INNSYN_EGEN_ENHET]: 'Kabal innsyn egen enhet',
  [Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER]: 'Kabal oppgavestyring alle enheter',
  [Role.KABAL_TILGANGSSTYRING_EGEN_ENHET]: 'Kabal tilgangsstyring egen enhet',
  [Role.KABAL_FAGTEKSTREDIGERING]: 'Kabal fagtekstredigering',
  [Role.KABAL_MALTEKSTREDIGERING]: 'Kabal maltekstredigering',
  [Role.KABAL_ROL]: 'Kabal ROL',
  [Role.KABAL_KROL]: 'Kabal KROL',
  [Role.KABAL_SVARBREVINNSTILLINGER]: 'Kabal svarbrevinnstillinger',
  [Role.KABAL_ADMIN]: 'Kabal admin',
  [Role.KAKA_SAKSBEHANDLER]: 'Kaka saksbehandler',
  [Role.KAKA_EXCEL_UTTREKK_MED_FRITEKSTFELT]: 'Kaka excel uttrekk med fritekstfelt',
  [Role.KAKA_EXCEL_UTTREKK_UTEN_FRITEKSTFELT]: 'Kaka excel uttrekk uten fritekstfelt',
  [Role.KAKA_KA_KVALITETSREGISTRERING]: 'Kaka KA kvalitetsregistrering',
  [Role.KAKA_KA_LEDERSTATISTIKK_MED_ANSATTFILTER]: 'Kaka KA lederstatistikk med ansattfilter',
  [Role.KAKA_KVALITETSTILBAKEMELDING_FOR_LEDER_I_VEDTAKSIN]: 'Kaka kvalitetstilbakemelding for leder i vedtaksin',
  [Role.KAKA_TOTALSTATISTIKK]: 'Kaka totalstatistikk',
  [Role.KAKA_KVALITETSVURDERING]: 'Kaka kvalitetsvurdering',
  [Role.GOSYS_NASJONAL]: 'Gosys nasjonal',
  [Role.STRENGT_FORTROLIG]: 'Strengt fortrolig',
  [Role.FORTROLIG]: 'Fortrolig',
  [Role.EGEN_ANSATT]: 'Egen ansatt',
};

const ALL_ROLES = Object.values(Role);
export const ALL_PUBLIC_ROLES = ALL_ROLES.filter((r) => r !== Role.KABAL_ADMIN);

export interface ISetCustomInfoParams {
  key: keyof Omit<ICustomUserInfo, 'anonymous'>;
  value: string | null;
  navIdent: string;
}

export interface CustomAbbrevation {
  id: string;
  short: string;
  long: string;
}
