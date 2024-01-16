import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';
import { UtfallEnum } from '@app/types/kodeverk';
import { IHelper, INavEmployee, IOrganizationPart, IPersonPart, IVenteperiode } from '@app/types/oppgave-common';
import { IFeilregistrering } from '@app/types/oppgavebehandling/oppgavebehandling';

interface BaseEvent {
  actor: INavEmployee;
  timestamp: string;
}

interface ReturnedDate {
  returnedDate: string;
}

export type MedunderskriverEvent = BaseEvent & Omit<IHelper, 'returnertDate'>;
export type RolEvent = BaseEvent & IHelper & ReturnedDate;

export interface NewMessageEvent extends BaseEvent {
  id: string;
  text: string;
}

interface KlagerPersonEvent extends BaseEvent {
  part: IPersonPart;
}

interface KlagerOrgEvent extends BaseEvent {
  part: IOrganizationPart;
}

export type KlagerEvent = KlagerPersonEvent | KlagerOrgEvent;

interface FullmektigPersonEvent extends BaseEvent {
  part: IPersonPart | null;
}

interface FullmektigOrgEvent extends BaseEvent {
  part: IOrganizationPart | null;
}

export type FullmektigEvent = FullmektigPersonEvent | FullmektigOrgEvent;

export interface UtfallEvent extends BaseEvent {
  utfallId: UtfallEnum | null;
}

export interface ExtraUtfallEvent extends BaseEvent {
  utfallIdList: UtfallEnum[];
}

export interface HjemlerEvent extends BaseEvent {
  hjemmelIdSet: string[];
}

export interface MottattVedtaksinstansEvent extends BaseEvent {
  mottattVedtaksinstans: string;
}

export interface SattPaaVentEvent extends BaseEvent {
  sattPaaVent: IVenteperiode | null;
}

export interface FerdigstiltEvent extends BaseEvent {
  avsluttetAvSaksbehandler: string;
}

export interface FeilregistreringEvent extends BaseEvent, Omit<IFeilregistrering, 'feilregistrertAv'> {}

interface ChangedDocument {
  id: string;
  parentId: string | null;
  dokumentTypeId: DistribusjonsType;
  tittel: string;
  isMarkertAvsluttet: boolean;
}

export interface DocumentsChangedEvent extends BaseEvent {
  documents: ChangedDocument[];
}

export interface DocumentsAddedEvent extends BaseEvent {
  documents: IMainDocument[];
}

/** The document has been archived and possibly sent. */
export interface DocumentFinishedEvent extends BaseEvent {
  id: string;
  journalpostList: IArkivertDocument[];
}

export interface DocumentsRemovedEvent extends BaseEvent {
  idList: string[];
}

export interface JournalpostAddedEvent extends BaseEvent {
  journalpostList: IArkivertDocument[];
}

export interface JournalfoertDocumentModifiedEvent extends BaseEvent {
  journalpostId: string;
  dokumentInfoId: string;
  tittel: string;
}
