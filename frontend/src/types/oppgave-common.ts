import { SexEnum } from '@app/types/kodeverk';

export interface IDocumentReference {
  journalpostId: string;
  dokumentInfoId: string;
}

export interface IVedlegg {
  name: string;
  size: number;
  opplastet: string | null; // LocalDateTime
}

// Empoyee from vedtaksinstans or KA.
export interface INavEmployee {
  navIdent: string;
  navn: string;
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
    };

export interface IOrganizationStatus {
  status: PartStatusEnum.DELETED;
  date: string;
}

interface IPersonPart extends IPartBase {
  type: IdType.FNR;
  statusList: IPersonStatus[];
}

interface IOrganizationPart extends IPartBase {
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
