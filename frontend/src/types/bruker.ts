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

export interface IUserData extends INavEmployee {
  navIdent: string;
  navn: string;
  roller: Role[];
  enheter: IEnhet[];
  ansattEnhet: IEnhet;
  tildelteYtelser: string[];
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
  KABAL_ADMIN = 'KABAL_ADMIN',
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
  [Role.KABAL_ADMIN]: 'Kabal admin',
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
