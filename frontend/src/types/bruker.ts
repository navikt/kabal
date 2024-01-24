import { SaksTypeEnum } from './kodeverk';

interface IEnhet {
  id: string;
  navn: string;
  lovligeYtelser: string[];
}

export interface ISettings {
  hjemler: string[];
  ytelser: string[];
  typer: SaksTypeEnum[];
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
  KABAL_ADMIN = 'KABAL_ADMIN',
  KABAL_ROL = 'KABAL_ROL',
  KABAL_KROL = 'KABAL_KROL',
}

export interface ISetCustomInfoParams {
  key: keyof ICustomUserInfo;
  value: string | null;
  navIdent: string;
}
