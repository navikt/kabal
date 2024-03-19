export interface IArkiverteDocumentsResponse {
  dokumenter: IArkivertDocument[];
  pageReference: string | null;
  antall: number;
  totaltAntall: number;
  sakList: Sak[];
  avsenderMottakerList: AvsenderMottaker[];
  journalposttypeList: Journalposttype[];
  temaIdList: string[];
  fromDate: string | null;
  toDate: string | null;
}

/** Sier hvorvidt journalposten er et inngående dokument, et utgående dokument eller et notat. */
export enum Journalposttype {
  INNGAAENDE = 'I',
  UTGAAENDE = 'U',
  NOTAT = 'N',
}

export enum Journalstatus {
  MOTTATT = 'MOTTATT',
  JOURNALFOERT = 'JOURNALFOERT',
  FERDIGSTILT = 'FERDIGSTILT',
  EKSPEDERT = 'EKSPEDERT',
  UNDER_ARBEID = 'UNDER_ARBEID',
  FEILREGISTRERT = 'FEILREGISTRERT',
  UTGAAR = 'UTGAAR',
  AVBRUTT = 'AVBRUTT',
  UKJENT_BRUKER = 'UKJENT_BRUKER',
  RESERVERT = 'RESERVERT',
  OPPLASTING_DOKUMENT = 'OPPLASTING_DOKUMENT',
  UKJENT = 'UKJENT',
}

enum AvsenderMottakerIdType {
  FNR = 'FNR',
  ORGNR = 'ORGNR',
  HPRNR = 'HPRNR',
  UTL_ORG = 'UTL_ORG',
  UKJENT = 'UKJENT',
  NULL = 'NULL',
}

/** Personen eller organisasjonen som er avsender eller mottaker av dokumentene i journalposten. */
export interface AvsenderMottaker {
  id: string | null;
  type: AvsenderMottakerIdType | null;
  navn: string | null;
  land: string | null;
  erLikBruker: boolean;
}

/** Sier hvilken sak journalposten er knyttet til. En journalpost kan maksimalt være knyttet til én sak, men et dokument kan være knyttet til flere journalposter og dermed flere saker. */
export interface Sak {
  datoOpprettet: string; // LocalDate
  fagsakId: string;
  fagsaksystem: string;
}

/** Utsendingsinfo tilknyttet journalposten. Beskriver hvor forsendelsen er distribuert, eller hvor varsel er sendt. Settes kun for utgående journalposter. */
export interface Utsendingsinfo {
  epostVarselSendt: {
    tittel: string;
    adresse: string;
    varslingstekst: string;
  } | null;
  smsVarselSendt: {
    adresse: string;
    varslingstekst: string;
  } | null;
  fysiskpostSendt: {
    adressetekstKonvolutt: string;
  } | null;
  digitalpostSendt: {
    adresse: string;
  } | null;
}

enum RelevantDatotype {
  DATO_SENDT_PRINT = 'DATO_SENDT_PRINT',
  DATO_EKSPEDERT = 'DATO_EKSPEDERT',
  DATO_JOURNALFOERT = 'DATO_JOURNALFOERT',
  DATO_REGISTRERT = 'DATO_REGISTRERT',
  DATO_AVS_RETUR = 'DATO_AVS_RETUR',
  DATO_DOKUMENT = 'DATO_DOKUMENT',
  DATO_LEST = 'DATO_LEST',
}

interface RelevantDato {
  dato: string;
  datotype: RelevantDatotype;
}

/** Liste over fagspesifikke metadata som er tilknyttet journalpost. */
interface Tilleggsopplysninger {
  key: string;
  value: string;
}

export enum Kanal {
  ALTINN = 'ALTINN',
  EIA = 'EIA',
  NAV_NO = 'NAV_NO',
  NAV_NO_UINNLOGGET = 'NAV_NO_UINNLOGGET',
  NAV_NO_CHAT = 'NAV_NO_CHAT',
  SKAN_NETS = 'SKAN_NETS',
  SKAN_PEN = 'SKAN_PEN',
  SKAN_IM = 'SKAN_IM',
  INNSENDT_NAV_ANSATT = 'INNSENDT_NAV_ANSATT',
  EESSI = 'EESSI',
  EKST_OPPS = 'EKST_OPPS',
  SENTRAL_UTSKRIFT = 'SENTRAL_UTSKRIFT',
  LOKAL_UTSKRIFT = 'LOKAL_UTSKRIFT',
  SDP = 'SDP',
  TRYGDERETTEN = 'TRYGDERETTEN',
  HELSENETTET = 'HELSENETTET',
  INGEN_DISTRIBUSJON = 'INGEN_DISTRIBUSJON',
  DPV = 'DPV',
  DPVS = 'DPVS',
  UKJENT = 'UKJENT',
}

/**
 * SAF Journalpost
 * @documentation https://confluence.adeo.no/display/BOA/Type%3A+Journalpost
 */
export interface Journalpost {
  /** Unik identifikator per journalpost */
  journalpostId: string;
  /**
   * Temaet/Fagområdet som journalposten og tilhørende sak tilhører, f.eks. "FOR".
   * For sakstilknyttede journalposter, er det tema på SAK- eller PSAK-saken som er gjeldende tema.
   * For journalposter som enda ikke har fått sakstilknytning, returneres tema på journalposten.inneholder Joark informasjon om antatt tema for journalposten.
   */
  tema: string | null;
  /** Sier hvorvidt journalposten er et inngående dokument, et utgående dokument eller et notat. */
  journalposttype: Journalposttype | null;
  /**
   * Status på journalposten i joark, f.eks. MOTTATT eller JOURNALFØRT. Journalstatusen gir et indikasjon på hvor i journalførings- eller dokumentproduksjonsprosessen journalposten befinner seg.
   * Journalposter som er resultat av en feilsituasjon og ikke skal hensyntas for saksbehandling har egne koder, som UTGAAR eller AVBRUTT.
   */
  journalstatus: Journalstatus | null;
  /** Detaljering av tema på journalpost og tilhørende sak, f.eks. "ab0072". */
  behandlingstema: string | null;
  /** Dekode av behandlingstema, f.eks "Foreldrepenger ved adopsjon" */
  behandlingstemanavn: string | null;
  /** Sier hvilken sak journalposten er knyttet til. En journalpost kan maksimalt være knyttet til én sak, men et dokument kan være knyttet til flere journalposter og dermed flere saker. */
  sak: Sak | null;
  /** Personen eller organisasjonen som er avsender eller mottaker av dokumentene i journalposten. */
  avsenderMottaker: AvsenderMottaker | null;
  /** NAV-enheten som har journalført forsendelsen. I noen tilfeller brukes journalfEnhet til å rute journalføringsoppgaven til korrekt enhet i NAV. I slike tilfeller vil journalfEnhet være satt også for ikke-journalførte dokumenter. */
  journalfoerendeEnhet: string | null;
  /**
   * Personen eller systembrukeren i NAV som har journalført forsendelsen.
   * Bruken av feltet varierer, og kan inneholde den ansattes navn eller NAV-ident. Dersom forsendelsen er automatisk journalført, kan innholdet være f.eks. en servicebruker eller et batchnavn. */
  journalfortAvNavn: string | null;
  /**
   * Personen eller systembrukeren i NAV som har opprettet journalposten.
   * Bruken av feltet varierer, og kan inneholde den ansattes navn eller NAV-ident. For inngående dokumenter kan innholdet være f.eks. en servicebruker eller et batchnavn.
   * */
  opprettetAvNavn: string | null;
  /** Datoen journalposten ble opprettet i arkivet. Datoen settes automatisk og kan ikke overskrives. Selv om hver journalpost har mange datoer (se Type: RelevantDato) er datoOpprettet å anse som "fasit" på journalpostens alder.
   * @format LocalDateTime
   */
  datoOpprettet: string;
  /** Liste over datoer som kan være relevante for denne journalposten, f.eks. DATO_EKSPEDERT. Hvilke relevante datoer som returneres, avhenger av journalposttypen. */
  relevanteDatoer: RelevantDato[];
  /** Antall ganger brevet har vært forsøkt sendt til bruker og deretter kommet i retur til NAV. Vil kun være satt for utgående forsendelser. */
  antallRetur: number | null;
  /** Liste over fagspesifikke metadata som er tilknyttet journalpost. */
  tilleggsopplysninger: Tilleggsopplysninger[];
  /**
   * Kanalen dokumentene ble mottatt i eller sendt ut på f.eks. "SENTRAL_UTSKRIFT" eller "ALTINN".
   * Dersom journalposten ikke har noen kjent kanal, returneres verdien "UKJENT"
   * */
  kanal: Kanal;
  /** Dekode av Enum: Kanal, f.eks "Sentral utskrift" */
  kanalnavn: string;
  /** Utsendingsinfo tilknyttet journalposten. Beskriver hvor forsendelsen er distribuert, eller hvor varsel er sendt. Settes kun for utgående journalposter. */
  utsendingsinfo: Utsendingsinfo | null;
}

/** SAF Dokument */
export interface DokumentInfo {
  /** Unik identifikator per dokument. */
  dokumentInfoId: string;
  /** Beskriver innholdet i journalposten samlet, f.eks. "Ettersendelse til søknad om foreldrepenger" */
  tittel: string | null;
  /** Om bruker har tilgang til dokumentet. */
  harTilgangTilArkivvariant: boolean;
  /**
   * Et dokumentInfo-objekt kan være gjenbrukt på flere journalposter. OriginalJournalpostId peker på den journalposten som dokumentene var knyttet til på arkiveringstidspunktet.
   */
  originalJournalpostId: string;
}

export enum TimelineTypes {
  OPPRETTET = 'OPPRETTET',
  SENDT_PRINT = 'SENDT_PRINT',
  EKSPEDERT = 'EKSPEDERT',
  JOURNALFOERT = 'JOURNALFOERT',
  REGISTRERT = 'REGISTRERT',
  AVSENDER_RETUR = 'AVSENDER_RETUR',
  LEST = 'LEST',
}

interface TimelineItem {
  /** DateTime */
  timestamp: string;
  type: TimelineTypes;
}

/** Kabal */
interface KabalProperties {
  /** Om dokumentet er inkludert i saksmappen. */
  valgt: boolean;
  datoRegSendt: string | null;
  sortKey: string;
  timeline: TimelineItem[];
}

/** Archived Kabal document */
export interface IArkivertDocument extends Journalpost, DokumentInfo, KabalProperties {
  /** All, except the first, documents in the journalpost. */
  vedlegg: IArkivertDocumentVedlegg[];
}

export interface IArkivertDocumentVedlegg extends DokumentInfo, KabalProperties {}
