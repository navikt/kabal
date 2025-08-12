import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { INavEmployee } from '@app/types/bruker';
import type { DistribusjonsType, IDocument } from '@app/types/documents/documents';
import type { UtfallEnum } from '@app/types/kodeverk';
import type {
  FlowState,
  IJournalfoertDokumentId,
  IOrganizationPart,
  IPersonPart,
  ISattPåVent,
} from '@app/types/oppgave-common';
import type { BehandlingGosysOppgave, IFeilregistrering } from '@app/types/oppgavebehandling/oppgavebehandling';
import type { FradelReason } from '@app/types/oppgaver';
import type { Language } from '@app/types/texts/language';

export interface BaseEvent {
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

export interface VarsletFristEvent extends BaseEvent {
  timesPreviouslyExtended: number;
  varsletFrist: string;
}

export interface SattPaaVentEvent extends BaseEvent {
  sattPaaVent: ISattPåVent | null;
}

export interface TilbakekrevingEvent extends BaseEvent {
  tilbakekreving: boolean;
}

export interface FerdigstiltEvent extends BaseEvent {
  avsluttetAvSaksbehandler: string;
}

export interface FeilregistreringEvent extends BaseEvent, Omit<IFeilregistrering, 'feilregistrertAv'> {}

export interface GosysOppgaveEvent extends BaseEvent {
  gosysOppgave: BehandlingGosysOppgave;
}

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
  documents: IDocument[];
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

export interface IncludedDocumentsChangedEvent extends BaseEvent {
  journalfoertDokumentReferenceSet: IJournalfoertDokumentId[];
}
