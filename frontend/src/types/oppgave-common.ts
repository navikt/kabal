import { SexEnum } from '@app/types/kodeverk';
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

export interface IPartBase {
  id: string;
  name: string | null;
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

export interface IOrganizationStatus {
  status: PartStatusEnum.DELETED;
  date: string;
}

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
  navIdent: string;
  navn: string;
  flowState: FlowState.RETURNED;
  returnertDate: string; // LocalDateTime
}

interface ISentHelper {
  navIdent: string;
  navn: string;
  flowState: FlowState.SENT;
  returnertDate: null; // LocalDateTime
}

interface INotSentHelper {
  navIdent: string | null;
  navn: string | null;
  flowState: FlowState.NOT_SENT;
  returnertDate: null;
}

// Medunderskriver/ROL
export type IHelper = INotSentHelper | ISentHelper | IReturnedHelper;

export interface IMedunderskriverRol {
  employee: INavEmployee | null;
  flowState: FlowState;
}
