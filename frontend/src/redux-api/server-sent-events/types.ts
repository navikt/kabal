import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { INavEmployee } from '@app/types/bruker';
import { DistribusjonsType, IMainDocument } from '@app/types/documents/documents';
import { UtfallEnum } from '@app/types/kodeverk';
import { FlowState, IOrganizationPart, IPersonPart, IVenteperiode } from '@app/types/oppgave-common';
import { IFeilregistrering } from '@app/types/oppgavebehandling/oppgavebehandling';
import { FradelReason } from '@app/types/oppgaver';
import { Language } from '@app/types/texts/language';

interface BaseEvent {
  actor: INavEmployee;
  timestamp: string;
}

interface SentMedunderskriverEvent {
  medunderskriver: INavEmployee;
  flowState: FlowState.SENT;
}

interface NotSentMedunderskriverEvent {
  medunderskriver: INavEmployee | null;
  flowState: FlowState.NOT_SENT;
}

interface ReturnedMedunderskriverEvent {
  medunderskriver: INavEmployee;
  flowState: FlowState.RETURNED;
}

type Medunderskriver = SentMedunderskriverEvent | NotSentMedunderskriverEvent | ReturnedMedunderskriverEvent;

export type MedunderskriverEvent = BaseEvent & Medunderskriver;

interface SentRolEvent {
  rol: INavEmployee;
  flowState: FlowState.SENT;
  returnertDate: null;
}

interface NotSentRolEvent {
  rol: INavEmployee | null;
  flowState: FlowState.NOT_SENT;
  returnertDate: null;
}

interface ReturnedRolEvent {
  rol: INavEmployee;
  flowState: FlowState.RETURNED;
  returnertDate: string; // LocalDateTime
}

type Rol = SentRolEvent | NotSentRolEvent | ReturnedRolEvent;

export type RolEvent = BaseEvent & Rol;

export interface NewMessageEvent extends BaseEvent {
  id: string;
  text: string;
}

export interface TildelingEvent extends BaseEvent {
  saksbehandler: INavEmployee | null;
  fradelingReasonId: FradelReason | null;
  hjemmelIdList: string[];
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

export interface SmartDocumentVersionedEvent extends BaseEvent {
  documentId: string;
  version: number;
  author: INavEmployee;
}

export interface SmartDocumentLanguageEvent extends BaseEvent {
  document: { id: string; language: Language };
}

export interface SmartDocumentCommentEvent extends BaseEvent {
  documentId: string;
  parentId: string | null;
  commentId: string;
  author: INavEmployee;
  text: string;
}

export interface JournalpostAddedEvent extends BaseEvent {
  journalpostList: IArkivertDocument[];
}

export interface JournalfoertDocumentModifiedEvent extends BaseEvent {
  journalpostId: string;
  dokumentInfoId: string;
  tittel: string;
}
