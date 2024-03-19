import { INavEmployee } from '../bruker';
import { SaksTypeEnum, UtfallEnum } from '../kodeverk';
import { IMedunderskriverRol, IPart, ISakenGjelder, IVedlegg, IVenteperiode } from '../oppgave-common';

type UUID = string;

export enum KvalitetsvurderingVersion {
  V1 = 1,
  V2 = 2,
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
  medunderskriver: IMedunderskriverRol;
  /** DateTime */
  modified: string;
  /** Date */
  mottattVedtaksinstans: string | null;
  /** Date */
  mottattKlageinstans: string | null;
  previousSaksbehandler: INavEmployee | null;
  prosessfullmektig: IPart | null;
  raadfoertMedLege: string | null;
  resultat: Resultat;
  sakenGjelder: ISakenGjelder;
  sattPaaVent: IVenteperiode | null;
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
}

export interface IKlagebehandling extends IOppgavebehandlingBase {
  typeId: SaksTypeEnum.KLAGE;
  rol: IMedunderskriverRol;
}

export interface IAnkebehandling extends IOppgavebehandlingBase {
  typeId: SaksTypeEnum.ANKE;
  rol: IMedunderskriverRol;
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
  extraUtfallIdSet: UtfallEnum[];
}

export interface IFeilregistrering {
  registered: string;
  reason: string;
  fagsystemId: string;
  feilregistrertAv: INavEmployee;
}
