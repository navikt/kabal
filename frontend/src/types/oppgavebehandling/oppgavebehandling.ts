import type { INavEmployee } from '../bruker';
import type { SaksTypeEnum, UtfallEnum } from '../kodeverk';
import type { IFullmektig, IMedunderskriverRol, IPart, ISakenGjelder, ISattPåVent, IVedlegg } from '../oppgave-common';

type UUID = string;

export enum KvalitetsvurderingVersion {
  V1 = 1,
  V2 = 2,
}

export enum GosysStatus {
  AAPNET = 'AAPNET',
  OPPRETTET = 'OPPRETTET',
  UNDER_BEHANDLING = 'UNDER_BEHANDLING',
  FERDIGSTILT = 'FERDIGSTILT',
  FEILREGISTRERT = 'FEILREGISTRERT',
}

interface BaseGosysOppgave {
  id: number;
  tildeltEnhetsnr: string;
  endretAvEnhetsnr: string | null;
  endretAv: INavEmployee | null;
  endretTidspunkt: string | null; // LocalDateTime
  opprettetAv: INavEmployee | null;
  opprettetTidspunkt: string | null; // LocalDateTime
  beskrivelse: string | null;
  temaId: string;
  gjelder: string | null;
  oppgavetype: string | null;
  fristFerdigstillelse: string | null; // LocalDate
  ferdigstiltTidspunkt: string | null; // LocalDateTime
  status: GosysStatus;
  editable: boolean;
  opprettetAvEnhet: Enhet | null;
  mappe: {
    id: number;
    navn: string;
  };
}

export interface BehandlingGosysOppgave extends BaseGosysOppgave {
  alreadyUsedBy: string;
}

export interface ListGosysOppgave extends BaseGosysOppgave {
  alreadyUsedBy: string | null;
}

export interface Enhet {
  enhetsnr: string;
  navn: string;
}

enum Tiltakstype {
  FYUS = 'FYUS',
  TFUS = 'TFUS',
  FTUS = 'FTUS',
  DIUS = 'DIUS',
  TOAN = 'TOAN',
}

export interface ISikkerhetstiltak {
  beskrivelse: string;
  /** Date */
  gyldigFraOgMed: string;
  /** Date */
  gyldigTilOgMed: string;
  tiltakstype: Tiltakstype;
}

export interface IOppgavebehandlingBase {
  /** DateTime */
  avsluttetAvSaksbehandlerDate: string | null;
  /** DateTime */
  created: string;
  /** DateTime */
  datoSendtMedunderskriver: string | null;
  egenansatt: boolean;
  eoes: string | null;
  fortrolig: boolean;
  fraNAVEnhet: string | null;
  fraNAVEnhetNavn: string | null;
  fraSaksbehandlerident: string | null;
  /** Date */
  frist: string | null;
  /** Date */
  varsletFrist: string | null;
  hjemmelIdList: string[];
  id: string;
  internVurdering: string;
  isAvsluttetAvSaksbehandler: boolean;
  klager: IPart;
  kommentarFraVedtaksinstans: string | null;
  gosysOppgaveId: number | null;
  kvalitetsvurderingReference: {
    id: UUID;
    version: KvalitetsvurderingVersion;
  } | null;
  medunderskriver: IMedunderskriverRol;
  /** DateTime */
  modified: string;
  /** Date */
  mottattVedtaksinstans: string | null;
  /** Date */
  mottattKlageinstans: string | null;
  previousSaksbehandler: INavEmployee | null;
  prosessfullmektig: IFullmektig | null;
  raadfoertMedLege: string | null;
  resultat: Resultat;
  rol: IMedunderskriverRol;
  sakenGjelder: ISakenGjelder;
  sattPaaVent: ISattPåVent | null;
  sendTilbakemelding: boolean | null;
  strengtFortrolig: boolean;
  vergemaalEllerFremtidsfullmakt: boolean;
  /** DateTime */
  dead: string | null;
  fullmakt: boolean;
  temaId: string;
  tilbakemelding: string | null;
  /** Date */
  tildelt: string | null;
  saksbehandler: INavEmployee | null;
  ytelseId: string;
  feilregistrering: IFeilregistrering | null;
  fagsystemId: string;
  saksnummer: string;
  tilbakekreving: boolean;
  timesPreviouslyExtended: number;
  sikkerhetstiltak: ISikkerhetstiltak | null;
  readonly tilknyttedeDokumenter: TilknyttetDokument[];
  requiresGosysOppgave: boolean;
}

export interface TilknyttetDokument {
  readonly journalpostId: string;
  readonly dokumentInfoId: string;
}

export interface IKlagebehandling extends IOppgavebehandlingBase {
  typeId: SaksTypeEnum.KLAGE;
}

export interface IAnkebehandling extends IOppgavebehandlingBase {
  typeId: SaksTypeEnum.ANKE;
}

export interface ITrygderettsankebehandling extends IOppgavebehandlingBase {
  typeId: SaksTypeEnum.ANKE_I_TRYGDERETTEN;
  kjennelseMottatt: string | null; // LocalDate
  sendtTilTrygderetten: string | null; // LocalDate
}

export interface IBehandlingEtterTryderettenOpphevet extends IOppgavebehandlingBase {
  typeId: SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET;
  kjennelseMottatt: string | null;
}

export interface IOmgjøringskravbehandling extends IOppgavebehandlingBase {
  typeId: SaksTypeEnum.OMGJØRINGSKRAV;
}

export interface IBegjæringOmGjenopptakBehandling extends IOppgavebehandlingBase {
  typeId: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK;
}

export interface IBegjæringOmGjenopptakITRBehandling extends IOppgavebehandlingBase {
  kjennelseMottatt: string | null; // LocalDate
  sendtTilTrygderetten: string | null; // LocalDate
  typeId: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR;
}

export type IOppgavebehandling =
  | IKlagebehandling
  | IAnkebehandling
  | ITrygderettsankebehandling
  | IBehandlingEtterTryderettenOpphevet
  | IOmgjøringskravbehandling
  | IBegjæringOmGjenopptakBehandling
  | IBegjæringOmGjenopptakITRBehandling;

interface Resultat {
  file: IVedlegg | null;
  hjemmelIdSet: string[];
  id: string;
  utfallId: UtfallEnum | null;
  extraUtfallIdSet: UtfallEnum[];
}

export interface IFeilregistrering {
  registered: string;
  reason: string;
  fagsystemId: string;
  feilregistrertAv: INavEmployee;
}
