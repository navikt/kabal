import { MedunderskriverFlyt, SaksTypeEnum, UtfallEnum } from '../kodeverk';
import { INavEmployee, IPart, ISakenGjelder, IVedlegg, IVenteperiode } from '../oppgave-common';

type UUID = string;

export enum KvalitetsvurderingVersion {
  V1 = 1,
  V2 = 2,
}

export interface IOppgavebehandlingBase {
  avsluttetAvSaksbehandlerDate: string | null; // LocalDate
  created: string; // LocalDateTime
  datoSendtMedunderskriver: string | null; // LocalDate
  egenansatt: boolean;
  eoes: string | null;
  fortrolig: boolean;
  fraNAVEnhet: string | null;
  fraNAVEnhetNavn: string | null;
  fraSaksbehandlerident: string | null;
  frist: string | null;
  hjemmelIdList: string[];
  id: string;
  internVurdering: string;
  isAvsluttetAvSaksbehandler: boolean;
  klager: IPart;
  kommentarFraVedtaksinstans: string | null;
  kvalitetsvurderingReference: {
    id: UUID;
    version: KvalitetsvurderingVersion;
  } | null;
  medunderskriver: INavEmployee | null;
  medunderskriverFlyt: MedunderskriverFlyt;
  modified: string; // LocalDateTime
  mottattVedtaksinstans: string | null; // LocalDate
  mottattKlageinstans: string | null; // LocalDate
  prosessfullmektig: IPart | null;
  raadfoertMedLege: string | null;
  resultat: Resultat;
  sakenGjelder: ISakenGjelder;
  sattPaaVent: IVenteperiode | null;
  sendTilbakemelding: boolean | null;
  strengtFortrolig: boolean;
  vergemaalEllerFremtidsfullmakt: boolean;
  dead: string | null; // LocalDate
  fullmakt: boolean;
  temaId: string;
  tilbakemelding: string | null;
  tildelt: string | null; // LocalDate
  tildeltSaksbehandler: INavEmployee | null;
  tildeltSaksbehandlerEnhet: string | null;
  ytelseId: string;
  feilregistrering: IFeilregistrering | null;
  fagsystemId: string;
}

interface IKlagebehandling extends IOppgavebehandlingBase {
  typeId: SaksTypeEnum.KLAGE;
}

interface IAnkebehandling extends IOppgavebehandlingBase {
  typeId: SaksTypeEnum.ANKE;
}

export interface ITrygderettsankebehandling extends IOppgavebehandlingBase {
  typeId: SaksTypeEnum.ANKE_I_TRYGDERETTEN;
  kjennelseMottatt: string | null; // LocalDate
  sendtTilTrygderetten: string | null; // LocalDate
}

export type IOppgavebehandling = IKlagebehandling | IAnkebehandling | ITrygderettsankebehandling;

interface Resultat {
  file: IVedlegg | null;
  hjemmelIdSet: string[];
  id: string;
  utfallId: UtfallEnum | null;
}

export interface IFeilregistrering {
  registered: string;
  reason: string;
  fagsystemId: string;
  feilregistrertAv: INavEmployee;
}
