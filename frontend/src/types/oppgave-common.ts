import { IAddress } from '@app/types/documents/recipients';
import { SexEnum } from '@app/types/kodeverk';
import { Language } from '@app/types/texts/language';
import { INavEmployee } from './bruker';

export interface IJournalfoertDokumentId {
  readonly journalpostId: string;
  readonly dokumentInfoId: string;
}

export interface IVedlegg {
  name: string;
  size: number;
  opplastet: string | null; // LocalDateTime
}

export enum Utsendingskanal {
  SENTRAL_UTSKRIFT = 'SENTRAL_UTSKRIFT',
  SDP = 'SDP',
  NAV_NO = 'NAV_NO',
  LOKAL_UTSKRIFT = 'LOKAL_UTSKRIFT',
  INGEN_DISTRIBUSJON = 'INGEN_DISTRIBUSJON',
  TRYGDERETTEN = 'TRYGDERETTEN',
  DPVT = 'DPVT',
}

export const UTSENDINGSKANAL: Record<Utsendingskanal, string> = {
  [Utsendingskanal.SENTRAL_UTSKRIFT]: 'Sentral utskrift',
  [Utsendingskanal.SDP]: 'Digital Postkasse Innbygger',
  [Utsendingskanal.NAV_NO]: 'Nav.no',
  [Utsendingskanal.LOKAL_UTSKRIFT]: 'Lokal utskrift',
  [Utsendingskanal.INGEN_DISTRIBUSJON]: 'Ingen distribusjon',
  [Utsendingskanal.TRYGDERETTEN]: 'Trygderetten',
  [Utsendingskanal.DPVT]: 'Taushetsbelagt digital post til virksomhet',
};

export interface IPartBase {
  id: string;
  name: string | null;
  address: IAddress | null;
  utsendingskanal: Utsendingskanal;
}

export enum IdType {
  FNR = 'FNR',
  ORGNR = 'ORGNR',
}

export enum PartStatusEnum {
  DEAD = 'DEAD',
  DELETED = 'DELETED',
  EGEN_ANSATT = 'EGEN_ANSATT',
  VERGEMAAL = 'VERGEMAAL',
  FULLMAKT = 'FULLMAKT',
  FORTROLIG = 'FORTROLIG',
  STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
  RESERVERT_I_KRR = 'RESERVERT_I_KRR',
  DELT_ANSVAR = 'DELT_ANSVAR',
}

export type IPersonStatus =
  | {
      status: PartStatusEnum.DEAD;
      date: string;
    }
  | {
      status: PartStatusEnum.EGEN_ANSATT;
      date: null;
    }
  | {
      status: PartStatusEnum.VERGEMAAL;
      date: null;
    }
  | {
      status: PartStatusEnum.FULLMAKT;
      date: null;
    }
  | {
      status: PartStatusEnum.FORTROLIG;
      date: null;
    }
  | {
      status: PartStatusEnum.STRENGT_FORTROLIG;
      date: null;
    }
  | {
      status: PartStatusEnum.RESERVERT_I_KRR;
      date: null;
    };

export type IOrganizationStatus =
  | {
      status: PartStatusEnum.DELETED;
      date: string;
    }
  | {
      status: PartStatusEnum.DELT_ANSVAR;
      date: null;
    };

export interface IPersonPart extends IPartBase {
  type: IdType.FNR;
  statusList: IPersonStatus[];
}

export interface IOrganizationPart extends IPartBase {
  type: IdType.ORGNR;
  statusList: IOrganizationStatus[];
}

export type IPart = IPersonPart | IOrganizationPart;

export interface ISakenGjelder extends IPersonPart {
  sex: SexEnum;
  language: Language;
}

export interface IVenteperiode {
  from: string; // LocalDate;
  to: string; // LocalDate;
  reason: string;
}

export enum FlowState {
  NOT_SENT = 'NOT_SENT',
  SENT = 'SENT',
  RETURNED = 'RETURNED',
}

interface IReturnedHelper {
  employee: INavEmployee;
  flowState: FlowState.RETURNED;
  returnertDate: string; // LocalDateTime
}

interface ISentHelper {
  employee: INavEmployee;
  flowState: FlowState.SENT;
  returnertDate: null; // LocalDateTime
}

interface INotSentHelper {
  employee: INavEmployee | null;
  flowState: FlowState.NOT_SENT;
  returnertDate: null;
}

// Medunderskriver/ROL
export type IHelper = INotSentHelper | ISentHelper | IReturnedHelper;

export interface IMedunderskriverRol {
  employee: INavEmployee | null;
  flowState: FlowState;
}
