import { OppgaveType } from './kodeverk';

export interface IEnhet {
  id: string;
  navn: string;
  lovligeYtelser: string[];
}

export interface ISettings {
  hjemler: string[];
  ytelser: string[];
  typer: OppgaveType[];
}

export interface IUserData {
  navIdent: string;
  roller: Role[];
  enheter: IEnhet[];
  ansattEnhet: IEnhet;
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
  ROLE_KLAGE_SAKSBEHANDLER = 'ROLE_KLAGE_SAKSBEHANDLER',
  ROLE_KLAGE_FAGANSVARLIG = 'ROLE_KLAGE_FAGANSVARLIG',
  ROLE_KLAGE_LEDER = 'ROLE_KLAGE_LEDER',
  ROLE_KLAGE_MERKANTIL = 'ROLE_KLAGE_MERKANTIL',
  ROLE_KLAGE_FORTROLIG = 'ROLE_KLAGE_FORTROLIG',
  ROLE_KLAGE_STRENGT_FORTROLIG = 'ROLE_KLAGE_STRENGT_FORTROLIG',
  ROLE_KLAGE_EGEN_ANSATT = 'ROLE_KLAGE_EGEN_ANSATT',
  ROLE_ADMIN = 'ROLE_ADMIN',
}

export interface ISetCustomInfoParams {
  key: keyof ICustomUserInfo;
  value: string | null;
  navIdent: string;
}
