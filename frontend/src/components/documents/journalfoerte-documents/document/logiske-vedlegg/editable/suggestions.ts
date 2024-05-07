/* eslint-disable max-lines */
export const getSuggestions = (temaId: string): string[] => FORSLAG[temaId] ?? [];

const FORSLAG: Record<string, string[]> = {
  AAP: [
    'Anke',
    'Ber om innsyn',
    'Dokumentasjon boutgifter',
    'Dokumentasjon studier',
    'Faktura',
    'Fødselsattest',
    'Inntektsopplysninger',
    'Institusjonsopphold',
    'Klage',
    'Krav om gjenopptak av ankesak',
    'Krav om omgjøring av vedtak',
    'Legeerklæring',
    'Medisinske opplysninger',
    'Meldekort',
    'Merknader i ankesak',
    'Merknader i klagesak',
    'Næringsfaglig vurdering',
    'Refusjonskrav',
    'Rettsavgjørelse',
    'Skatteopplysninger',
    'Sluttavtale',
    'Spesialisterklæring',
    'Stevning',
    'Svar på varsel',
    'Søknad om arbeidsavklaringspenger',
    'Søknad om arbeidsavklaringspenger under etablering av egen virksomhet (oppstartfase)',
    'Søknad om arbeidsavklaringspenger under etablering av egen virksomhet (utviklingsfase)',
    'Søknad om reisestønad',
    'Søknad om å beholde arbeidsavklaringspenger under utenlandsopphold',
    'Tilleggsopplysninger til søknad om arbeidsavklaringspenger',
  ],
  AAR: [
    'Begjæring om utlevering av opplysninger',
    'Ber om innsyn',
    'E-postkorrespondanse',
    'Klage',
    'Krav om retting av personopplysninger',
    'Krav om sletting av personopplysninger',
    'Melding om konkursåpning',
    'Rettsavgjørelse',
    'Søknad om ettergivelse',
  ],
  AGR: [
    'Adresseendring for bruker bosatt i utlandet',
    'Kontonummer',
    'Kontonummer bidragsgjeld',
    'Legitimasjon',
    'Midlertidig adresse',
    'Skifteattest',
    'Vergefullmakt',
  ],
  ARP: [],
  ARS: ['Henvisning', 'Henvisning Senter for jobbmestring', 'Medisinsk dokumentasjon'],
  BAR: [
    'Anke',
    'Anke på tilbakekreving',
    'Arbeidsavtale',
    'Avtale eller avgjørelse om samvær',
    'Avtale om delt bosted',
    'Avtale om fast bosted eller samvær',
    'Bekreftelse fra barnevernet',
    'Bekreftelse på utenlandsopphold',
    'Dokumentasjon adopsjon',
    'Dokumentasjon fosterforeldre',
    'Dokumentasjon på egen husholdning',
    'Dokumentasjon på egne midler',
    'Dokumentasjon på forsvinning',
    'Dokumentasjon på inntekt eller aktivitet',
    'Erklæring om samlivsbrudd',
    'EØS registreringsbevis',
    'F001',
    'F002',
    'Fravær fra skole',
    'Klage',
    'Klage på tilbakekreving',
    'Krav om gjenopptak av ankesak',
    'Meklingsattest',
    'Merknader i ankesak',
    'Oppholdstillatelse',
    'Pass/ID-papirer',
    'Rettsdokumentasjon',
    'Rettsdokumentasjon - barnefordelingssaker',
    'Skilsmisse- eller separasjonsbevilling',
    'Søknad om barnetrygd',
    'Tilleggsskjema EØS',
    'Uttalelse',
    'Uttalelse tilbakekreving',
  ],
  BID: [],
  BIL: [
    'Anke',
    'Ber om innsyn',
    'Dokumentasjon firehjulstrekk',
    'Forespørsel',
    'Gjeldsbrev gruppe 1',
    'Gjeldsbrev gruppe 2',
    'Klage',
    'Legeerklæring',
    'Medisinske opplysninger',
    'Merknader i ankesak',
    'Merknader i klagesak',
    'Oppfølging bil tre måneder',
    'Oppsigelse eller varsel forsikringsattest',
    'Rapport trafikkskole',
    'Rettsavgjørelse',
    'Transportopplysninger',
    'Uttalelse',
  ],
  DAG: [
    'Anke',
    'Arbeidsavtale',
    'Attest',
    'Bekreftelse av utdanning',
    'Bekreftelse fra bobestyrer',
    'Bekreftelse på ansettelsesforhold',
    'Bekreftelse på arbeidsforhold og permittering',
    'Bekreftelse på sluttårsak / nedsatt arbeidstid (ikke permittert)',
    'Egenerklæring/overdragelse av lønnskrav',
    'Egenerklæringsskjema for fastsettelse av grensearbeiderstatus',
    'EØS-dokument',
    'Faktura',
    'Forespørsel',
    'Forespørsel til arbeidsgiver - permittering',
    'Fødselsattest',
    'Inntektsopplysninger',
    'Klage',
    'Krav om gjenopptak av ankesak',
    'Krav om å beholde dagpenger under utdanning',
    'Lønnsslipper',
    'Manuelt korrigert meldekort',
    'Medisinske opplysninger',
    'Merknader i ankesak',
    'NAV 04-08.03 Bekreftelse på sluttårsak/arbeidstid (ikke permittert)',
    'NAV 04-08.04 bekreftelse på arbeidsforhold og permittering',
    'Næringsfaglig vurdering av etableringsplaner',
    'Oppholdstillatelse',
    'Oppsigelse',
    'Oversikt over arbeidstimer',
    'Perioder av betydning for retten til dagpenger U1',
    'Permitteringsvarsel',
    'Protokoll/Dokumentasjon om enighet ved permittering',
    'Refusjonskrav',
    'Rettsavgjørelse',
    'Sjøfartsbok',
    'Sluttattest',
    'Sluttavtale',
    'Stevning',
    'Svar fra arbeidsgiver - permittering',
    'Søknad om attest PD U1 til bruk ved overføring av dagpengerettigheter',
    'Søknad om attest PD U1/N-301 til bruk ved overføring av dagpengerettigheter',
    'Søknad om attest PD U2',
    'Søknad om dagpenger',
    'Søknad om dagpenger - gjenopptak',
    'Søknad om dagpenger under etablering av egen virksomhet',
    'Søknad om dagpenger ved permittering',
    'Søknad om gjenopptak av dagpenger ved permittering',
    'Søknad om godkjenning av utdanning med rett til dagpenger',
    'Søknad om å beholde dagpengene mens du tar utdanning eller opplæring',
    'Søknad om å beholde dagpenger under opphold i utlandet',
    'Timelister',
    'Tjenestebevis',
    'Uttalelse',
    'Varsel om oppsigelse',
    'Varsel om permittering',
  ],
  ENF: [
    'Adresseendring',
    'Anke',
    'Anke på tilbakebetaling',
    'Avtale om privat barnepass',
    'Bekreftelse på samlivsbrudd',
    'Dokumentasjon på arbeid',
    'Dokumentasjon på separasjon eller skilsmisse',
    'Dokumentasjon på utdanning',
    'Egenerklæring nytt barn',
    'Enslig mor eller far som er arbeidssøker',
    'Fødselsattest',
    'Inntektsopplysninger',
    'Klage',
    'Klage på tilbakebetaling',
    'Krav om gjenopptak av ankesak',
    'Lærlingkontrakt',
    'Manglende barnepassordning',
    'Medisinske opplysninger',
    'Meklingsattest',
    'Merknader i ankesak',
    'Næringsfaglig vurdering',
    'Oppholdsopplysninger',
    'Opplysninger om samvær',
    'Refusjonskrav',
    'Rettsavgjørelse',
    'Søknad om overgangsstønad - enslig mor eller far',
    'Søknad om skolepenger - enslig mor eller far',
    'Søknad om stønad til barnetilsyn - enslig mor eller far i arbeid',
    'Terminbekreftelse',
    'Tilsynsbehov',
    'Tilsynsutgifter',
    'Utdanning',
    'Utgifter til skolepenger',
    'Uttalelse',
    'Uttalelse tilbakebetaling',
  ],
  ERS: [
    'Begjæring om ny behandling',
    'Ber om dokumentinnsyn',
    'Dokumentasjon av økonomisk tap',
    'Krav om erstatning',
    'Medisinske opplysninger',
    'Purring',
    'Rettsavgjørelse',
    'Stevning',
    'Uttalelse',
  ],
  FAR: [],
  FEI: [
    'Anke',
    'Arbeidsforhold',
    'Endring i sivilstand',
    'EØS-dokument',
    'Faktura',
    'Forespørsel',
    'Fødselsattest',
    'Fødselsmelding',
    'Inntektsopplysninger',
    'Institusjonsopphold',
    'Klage',
    'Krav om gjenopptak av ankesak',
    'Medisinsk dokumentasjon',
    'Merknader i ankesak',
    'Refusjonskrav',
    'Skatteopplysninger',
    'Stevning',
    'Uttalelse',
  ],
  FIP: [],
  FOR: [
    'Anke',
    'Bekreftelse fra arbeidsgiver',
    'Bekreftelse fra studiested/skole',
    'Bekreftelse på avtalt ferie',
    'Bekreftelse på deltakelse i kvalifiseringsprogrammet',
    'Bekreftelse på oppholdstillatelse',
    'Bekreftelse på tiltak i regi av Arbeids- og velferdsetaten',
    'Bekreftelse på øvelse eller tjeneste i Forsvaret eller Sivilforsvaret',
    'Beskrivelse av funksjonsnedsettelse',
    'Dokumentasjon av aleneomsorg',
    'Dokumentasjon av begrunnelse for hvorfor man søker tilbake i tid',
    'Dokumentasjon av dato for overtakelse av omsorg',
    'Dokumentasjon av deltakelse i introduksjonsprogrammet',
    'Dokumentasjon av etterlønn/sluttvederlag',
    'Dokumentasjon av innleggelse i helseinstitusjon',
    'Dokumentasjon av militær- eller siviltjeneste',
    'Dokumentasjon av mors utdanning, arbeid eller sykdom',
    'Fødselsattest',
    'Klage',
    'Resultatregnskap',
    'Rettsavgjørelse',
    'Skattemelding',
    'Søknad om endring av uttak av foreldrepenger eller overføring av kvote',
    'Søknad om engangsstønad ved adopsjon',
    'Søknad om engangsstønad ved fødsel',
    'Søknad om foreldrepenger ved adopsjon',
    'Søknad om foreldrepenger ved fødsel',
    'Søknad om svangerskapspenger',
    'Søknad om svangerskapspenger til selvstendig næringsdrivende og frilanser',
    'Terminbekreftelse',
    'Tilrettelegging/omplassering ved graviditet',
    'Uttalelse tilbakekreving',
  ],
  FOS: [
    'Andre refusjonskrav',
    'Anke',
    'Anke på tilbakekreving',
    'Arbeidsforhold',
    'EØS-dokument',
    'Faktura',
    'Forespørsel',
    'Inntektsopplysninger',
    'Klage',
    'Klage på tilbakekreving',
    'Krav om gjenopptak av ankesak',
    'Merknader i ankesak',
    'Refusjonskrav - små bedrifter',
    'Rettsavgjørelse',
    'Skatteopplysninger',
    'Stevning',
    'Søknad - endring av premiegrunnlag fra selvstendig næringsdrivende',
    'Søknad - opptak i forsikring for små bedrifter',
    'Søknad - opptak/endring i forsikring for selvstendig næringsdrivende/frilanser',
    'Søknad fra selvstendig næringsdrivende/frilansere om opptak/endring i forsikring for tillegg til sykepenger',
    'Uttalelse',
    'Uttalelse tilbakekreving',
    'Årsoppgave for arbeidsgiveravgift - Følgeskriv til lønns- og trekkoppgaver (RF1025)',
  ],
  FRI: [],
  FUL: [
    'Annen',
    'Basisfullmakt',
    'Forespørsel',
    'Fullmakt',
    'Generell fullmakt',
    'Samtykke til tverrfaglig samarbeid',
    'Samtykkeerklæring',
    'Skjema for fullmakt',
    'Vergefullmakt',
  ],
  GEN: [
    'Ber om innsyn',
    'Dødsmelding',
    'Fullmakt',
    'Melding om institusjonsopphold',
    'Purring innsyn',
    'Rettsavgjørelse',
    'Stevning',
  ],
  GRA: [
    'Anke på tilbakekreving',
    'Dokumentasjon av medisinsk obduksjon',
    'Dokumentasjon av utgifter',
    'Dokumentasjon om begravelseskasse',
    'Dokumentasjon om forsikring',
    'Dokumentasjon om tjenestepensjon',
    'Dokumentasjon på skilsmisse',
    'Dødsattest',
    'E-signatur til fullmakt til begravelsesbyrå',
    'E-signatur til søknad om gravferdsstønad',
    'Faktura fra begravelsesbyrå',
    'Faktura fra samarbeidende begravelsesbyrå',
    'Feilsendt inkassovarsel',
    'Fullmakt',
    'Fødselsattest',
    'Kjørerute for båretransport i Norge',
    'Klage',
    'Klage på tilbakekrevingsvedtak',
    'Krav om gjenopptak av ankesak',
    'Kvittering for billettutgifter',
    'Merknader ankesak',
    'Prisoverslag for gravmonument',
    'Rettsavgjørelse',
    'Skattemelding/grunnlag for skatt',
    'Stevning',
    'Svar på forespørsel fra annet EØS-land',
    'Søknad om båretransport',
    'Søknad om båretransport og gravferdsstønad',
    'Søknad om gravferdsstønad',
    'Søknad om gravferdsstønad fra EØS-land',
    'Uttalelse i klagesak',
    'Uttalelse om tilbakekreving',
    'Uttalelse til søknad om båretransport',
    'Uttalelse til søknad om gravferdsstønad',
    'Vielsesattest',
  ],
  GRU: [
    'Anke grunnstønad',
    'Anke hjelpestønad',
    'Anke på tilbakekreving',
    'Bankutskrifter',
    'Bekreftelse fra barnevernet',
    'Ber om innsyn',
    'Beskrivelse av hjelpebehov',
    'Bilder',
    'Dokumentasjon av utgifter',
    'Drosjekvitteringer',
    'Døgnhjul - beskrivelse av hjelpebehovet',
    'Epikrise',
    'Ettersendelse av underskrift grunnstønad',
    'Ettersendelse av underskrift hjelpestønad',
    'Forespørsel',
    'Forsikring',
    'Klage grunnstønad',
    'Klage hjelpestønad',
    'Klage tilbakekreving',
    'Krav om gjenopptak av ankesak',
    'Kvittering drosje',
    'Kvitteringer',
    'Legeerklæring',
    'Legeregning',
    'Medisinske opplysninger',
    'Merknader i ankesak',
    'Opplysninger om avlastning',
    'Opplysninger om barnebolig',
    'Opplysninger om helse- og omsorgstjenester',
    'Opplysninger om hjemmesykepleie',
    'Opplysninger om institusjonsopphold',
    'Opplysninger om kontonummer',
    'Opplysninger om kontonummer tilbakekreving',
    'Opplysninger om vergemål',
    'Ordrebekreftelser/faktura',
    'Prøvesvar',
    'Purring',
    'Rettsavgjørelse',
    'Sakkyndig vurdering PPT',
    'Skifteattest',
    'Svar på brev om vurdering av grunnstønad',
    'Svar på brev om vurdering av hjelpestønad',
    'Søknad om grunnstønad',
    'Søknad om grunnstønad uten underskrift',
    'Søknad om hjelpestønad',
    'Søknad om hjelpestønad uten underskrift',
    'Søknad om økning av grunnstønad',
    'Søknad om økning av hjelpestønad',
    'Utredningsrapport',
    'Uttalelse',
    'Uttalelse fra advokat',
    'Uttalelse fra helsepersonell',
    'Uttalelse fra verge',
    'Uttalelse tilbakekreving',
    'Vedtak om avlastning',
    'Vedtak om barnebolig',
    'Vedtak om hjemmesykepleie',
    'Vedtak om institusjonsopphold',
    'Vedtak om vergemål',
    'Vognkort',
  ],
  HEL: [
    'Anke',
    'Anke tilbakekreving',
    'Arbeidsforhold',
    'Endring i sivilstand',
    'Erklæring fra fastlege om forlengelse av rekvisisjonsperiode for ortopediske hjelpemidler',
    'EØS-dokument',
    'Faktura',
    'Forespørsel',
    'Fullmakt',
    'Fødselsmelding eller fødselsattest',
    'Inntektsopplysninger',
    'Institusjonsopphold',
    'Klage',
    'Klage tilbakekreving',
    'Krav om gjenopptak av ankesak',
    'Medisinske opplysninger',
    'Merknader i ankesak',
    'Oppmøtebekreftelse',
    'Refusjonskrav',
    'Rettsavgjørelse',
    'Skatteopplysninger',
    'Stevning',
    'Søknad om ansiktsdefektprotese',
    'Søknad om brystprotese eller protese-bh',
    'Søknad om fornyelse av ortopediske hjelpemidler',
    'Søknad om ortopediske hjelpemidler',
    'Søknad om parykk',
    'Søknad om refusjon av reiseutgifter',
    'Søknad om øyeprotese',
    'Uttalelse',
    'Uttalelse om tilbakekreving',
  ],
  HJE: [
    'Anke på tilbakekreving',
    'Arbeidsforhold',
    'Bestilling av hjelpemidler',
    'Bytte av hjelpemiddel',
    'Dokumentasjon av arbeid eller utdanning',
    'Forespørsel',
    'Fullmakt',
    'Henvisning generell',
    'Hjelp til vurdering og utprøving av IKT-hjelpemidler',
    'Hjelp til vurdering og utprøving av forflytningshjelpemidler',
    'Hjelp til vurdering og utprøving av hjelpemidler til trening, aktivitet og stimulering',
    'Hjelp til vurdering og utprøving av hørselshjelpemidler',
    'Hjelp til vurdering og utprøving av kognisjonshjelpemidler',
    'Hjelp til vurdering og utprøving av kommunikasjonshjelpemidler',
    'Hjelp til vurdering og utprøving av motorkjøretøy eller annet transportmiddel',
    'Hjelp til vurdering og utprøving av synshjelpemidler',
    'Inntektsopplysninger',
    'Klage på tilbakekreving',
    'Klage/anke',
    'Krav om gjenopptak av ankesak',
    'Medisinsk dokumentasjon',
    'Merknader i ankesak',
    'Oppmøtebekreftelse',
    'Pristilbud',
    'Refusjonskrav/faktura',
    'Rettsavgjørelse',
    'Skatteopplysninger',
    'Stevning',
    'Søknad om IKT-hjelpemidler',
    'Søknad om aktivitetshjelpemidler til de over 26 år - AKT26',
    'Søknad om dekning av ekstraordinære veterinærutgifter',
    'Søknad om dekning av ekstrautgifter til folkehøgskole',
    'Søknad om forflytningshjelpemidler',
    'Søknad om førerhund',
    'Søknad om grunnmønster eller søm etter grunnmønster',
    'Søknad om hjelpemidler',
    'Søknad om hjelpemidler til trening, aktivitet og stimulering til de under 26 år',
    'Søknad om høreapparat',
    'Søknad om hørselshjelpemidler',
    'Søknad om kognisjonshjelpemidler',
    'Søknad om kommunikasjonshjelpemidler',
    'Søknad om servicehund',
    'Søknad om stønad til arbeids- og utdanningsreiser',
    'Søknad om synshjelpemidler',
    'Søknad om teknisk bistand',
    'Søknad om tilpasningskurs for syns- og hørselshemmede',
    'Søknad om tolk til døve, hørselshemmede og døvblinde',
    'Tilleggsskjema for adkomst til og i bolig',
    'Tilleggsskjema for arbeidslogg for utprøving av Innowalk',
    'Tilleggsskjema for elektrisk rullestol',
    'Tilleggsskjema for hev- og senkbare kjøkkenløsninger',
    'Tilleggsskjema for hjelpemiddel til trening, stimulering og aktivisering',
    'Tilleggsskjema for hjelpemidler og tilrettelegging i arbeidslivet',
    'Tilleggsskjema for hjelpemidler på bad',
    'Tilleggsskjema for hørselshjelpemiddel',
    'Tilleggsskjema for kognitivt hjelpemiddel',
    'Tilleggsskjema for kommunikasjonshjelpemiddel',
    'Tilleggsskjema for manuell rullestol',
    'Tilleggsskjema for omgivelseskontroll',
    'Tilleggsskjema for stasjonær personløfter',
    'Tilleggsskjema for stol med oppreisningsfunksjon',
    'Tilleggsskjema for synshjelpemiddel',
    'Uttalelse fra fagperson i saken',
    'Vedtak om hjelpemidler',
  ],
  IAR: ['IA - samarbeid', 'Rapport ekspertbistand', 'Refusjonskrav Ekspertbistand', 'Søknad Ekspertbistand'],
  IND: [
    'Arbeidsforhold',
    'Bostedsbevis',
    'EØS-dokument',
    'Faktura',
    'Forespørsel',
    'Fullmakt',
    'Fødselsattest',
    'Institusjonsopphold',
    'Klage',
    'Manuelt korrigert meldekort',
    'Refusjonskrav',
    'Rettsavgjørelse',
    'Stevning',
    'Søknad om tiltakspenger',
    'Uttalelse',
  ],
  KLL: [],
  KNA: [],
  KON: [
    'Anmodning om avgjørelse av kompetanse - F001',
    'Arbeidsavtale',
    'Avtale om delt bosted',
    'Dokumentasjon på barnehageplass',
    'Dokumentasjon på dato for overtakelse av omsorg',
    'Ettersendelse til søknad om kontantstøtte',
    'EØS registreringsbevis',
    'EØS varig oppholdsbevis',
    'Fullmakt',
    'Fødselsattest',
    'H002',
    'Klage',
    'Klage på tilbakekreving',
    'Kontoopplysninger',
    'Lønnsslipper',
    'Melding/anmodning om informasjon - H001',
    'Oppholdstillatelse/lovlig opphold',
    'Pass/ID-papirer',
    'Registerutskrift fra Brønnøysundregistrene',
    'Svar om avgjørelse av kompetanse - F002',
    'Søknad om kontantstøtte',
    'Tilleggsskjema EØS',
    'Utenlandsopphold',
    'Uttalelse',
    'Uttalelse tilbakekreving',
    'Vigselsattest',
  ],
  KTA: [],
  KTR: [
    'Arbeidsgiveropplysninger',
    'Kontoopplysninger',
    'Kontrollrapport',
    'Medisinsk dokumentasjon',
    'Rettsavgjørelse',
    'Skatteopplysninger',
  ],
  MED: [
    'A1 Attest om den trygdelovgivning som innehavende er omfattet av',
    'Anke',
    'Anmodning om opplysninger / E001',
    'Arbeidsforhold',
    'Attest for utsendte arbeidstakere fra Norge til Chile',
    'Attest for utsendte arbeidstakere fra Norge til USA',
    'Bekreftelse på medlemskap etter trygdeavtalen med Quebec',
    'Bekreftelse på medlemskap etter trygdeavtalen med Storbritannia',
    'Bekreftelse på medlemskap i folketrygden etter avtale om sosial trygd mellom Norge og Australia',
    'Bekreftelse på medlemskap i folketrygden etter avtale om sosial trygd mellom Norge og Canada',
    'Endring i sivilstand',
    'EØS-dokument',
    'Faktura',
    'Forespørsel',
    'Fødselsattest',
    'Fødselsmelding',
    'Inntektsopplysninger',
    'Institusjonsopphold',
    'Klage',
    'Krav om gjenopptak av ankesak',
    'Medisinsk dokumentasjon',
    'Merknader i ankesak',
    'Refusjonskrav',
    'Rettsavgjørelse',
    'Skatteopplysninger',
    'Stevning',
    'Studiedokumentasjon',
    'Svar på søknad om unntak fra utenlandsk trygdeordning',
    'Søknad om medlemskap',
    'Unntak medlemskap EU/EØS',
    'Uttalelse',
  ],
  MOB: [],
  OMS: [
    'Anke',
    'Anke på tilbakekreving',
    'Arbeidsforhold',
    'Arbeidsgivers eksemplar av søknaden',
    'Dokumentasjon omsorgsfordeling',
    'Egenmelding',
    'Endring i sivilstand',
    'Faktura',
    'Forespørsel',
    'Fraværsoversikt',
    'Inntektsopplysninger',
    'Institusjonsopphold',
    'Klage',
    'Klage på tilbakekreving',
    'Krav om gjenopptak av ankesak',
    'Legens eksemplar av søknaden',
    'Medisinsk dokumentasjon',
    'Merknader i ankesak',
    'Refusjonskrav',
    'Rettsavgjørelse',
    'Skatteopplysninger',
    'Stevning',
    'Søkers eksemplar av søknaden',
    'Søknad om omsorgspenger',
    'Søknad om opplæringspenger',
    'Søknad om pleiepenger',
    'Uttalelse',
    'Uttalelse tilbakekreving',
  ],
  OPA: ['Samhandling'],
  OPP: [
    'Aktivitetsplan',
    'Arbeidsmarkedstiltak',
    'Arbeidsrettet informasjon fra Introduksjonsprogram',
    'Avtale om del-/egenfinansiering',
    'CV',
    'Dialogmelding',
    'Frammøteskjema ved deltakelse på arbeidstrening',
    'Institusjonsopphold',
    'Jobblogg',
    'Karakterutskrift',
    'Klage',
    'Legeerklæring ved arbeidsuførhet',
    'Medisinske opplysninger',
    'Oppfølging bistand',
    'Oppfølgingsplan ved sykmelding',
    'Oppholdstillatelse',
    'Opplæringsplan',
    'Rapport',
    'Referat fra samarbeidsmøte',
    'Registreringsskjema for tilskudd til utdanning',
    'Samtykkeerklæring for HelselArbeid',
    'Sluttrapport',
    'Spesialisterklæring',
    'Statusrapport',
    'Svarslipp - individuell samtale ved NAV',
    'Svarslipp - informasjonsmøte',
    'Svarslipp - tilbud om tiltak',
    'Søknad om arbeidsmarkedstiltak',
    'Uttalelse fra rådgivende lege',
    'Vitnemål/attester',
  ],
  PEN: [],
  PER: [
    'Forespørsel - permittering',
    'Protokoll/dokumentasjon om enighet ved permittering',
    'Svar - permittering',
    'Varsel om oppsigelse',
    'Varsel om permittering',
  ],
  REH: [],
  REK: ['Aktuelle kandidater oversendt', 'Samarbeidsavtale'],
  RPO: [
    'Ber om innsyn',
    'Klage',
    'Krav om retting av personopplysninger',
    'Medisinske opplysninger',
    'Merknader i klagesak',
    'Purring',
    'Rettsavgjørelse',
    'Stevning',
    'Uttalelse',
  ],
  RVE: [],
  SAK: [
    'Ber om innsyn',
    'Fullmakt',
    'Klage',
    'Krav om sakskostnader',
    'Medisinske opplysninger',
    'Oppdragsbekreftelse',
    'Purring',
    'Rettsavgjørelse',
    'Stevning',
    'Timelister',
    'Utfyllende klage',
    'Uttalelse',
  ],
  SAP: ['Krav om gjenopptak av ankesak', 'Merknader i ankesak', 'Stevning', 'Svar på varsel', 'Uttalelse'],
  SER: ['Forespørsel', 'Rettsavgjørelse', 'Serviceklage', 'Tilleggsopplysninger', 'Uttalelse'],
  STO: [
    'Endringsoppgaver',
    'Erklæring',
    'Faktura',
    'Giro i retur',
    'Inntektsopplysninger',
    'Refundert trygdeavgift',
    'Saldoflytt',
    'Utbetalingsmelding',
    'Årsoppgave',
  ],
  SUP: [
    'Anke',
    'Anke på tilbakekreving',
    'Arbeidsforhold',
    'Dokumentasjon av oppfølgingssamtale',
    'Dokumentasjon av ut- og innreise',
    'Faktura',
    'Forespørsel',
    'Inntektsopplysninger',
    'Institusjonsopphold',
    'Klage',
    'Klage på tilbakekreving',
    'Krav om gjenopptak av ankesak',
    'Legeerklæring',
    'Merknader i ankesak',
    'Merknader i klagesak',
    'NAV SU Kontrollnotat',
    'Oppholdsopplysninger',
    'Pass',
    'Refusjonskrav',
    'Rettsavgjørelse',
    'Skatteopplysninger',
    'Stevning',
    'Søknad om supplerende stønad til person over 67 år',
    'Søknad om supplerende stønad til ufør flyktning',
    'Uttalelse',
    'Uttalelse tilbakekreving',
  ],
  SYK: [
    'Anke',
    'Arbeidsavtale(r)',
    'Ber om innsyn',
    'Bestridelse',
    'Bestridelse av sykmelding',
    'Dokumentasjon på næringsinntekt',
    'Egenerklæring',
    'Egenerklæring for utenlandske sykmeldinger',
    'Enkeltstående behandlingsdager',
    'Ferieopplysninger',
    'Inntektsopplysninger',
    'Inntektsopplysninger for selvstendig næringsdrivende og/eller frilansere som skal ha sykepenger',
    'Institusjonsopphold',
    'Klage',
    'Kontoutskrifter',
    'Krav fra arbeidsgiveren om refusjon av sykepenger utbetalt i arbeidsgiverperioden til en arbeidstaker som er unntatt fra arbeidsgiveransvar',
    'Krav om gjenopptak av ankesak',
    'Krav om sykepenger - midlertidig ute av inntektsgivende arbeid',
    'Manglende betaling av sykepenger fra arbeidsgiver',
    'Medisinske opplysninger',
    'Medisinske opplysninger - behandlingsdager',
    'Merknader i ankesak',
    'Merknader i klagesak',
    'Næringsspesifikasjon',
    'Om arbeidsgiverperioden',
    'Om oppgitt inntekt',
    'Purring på krevd refusjon',
    'Purring på refusjon',
    'Purring på refusjon av arbeidsgiverperiode',
    'Purring på utbetaling av sykepenger',
    'Resultatregnskap',
    'Skatteopplysninger',
    'Spørsmål om trekk i utbetaling',
    'Sykmelding del A',
    'Sykmelding del D',
    'Søknad om dekning av sykepenger i arbeidsgiverperioden',
    'Søknad om refusjon av reisetilskudd til arbeidsreiser',
    'Søknad om unntak fra arbeidsgiveransvar for sykepenger til en arbeidstaker som har sykefravær på grunn av svangerskap',
    'Søknad om unntak fra arbeidsgiveransvar for sykepenger til en arbeidstaker som lider av en langvarig eller kronisk sykdom',
    'Søknad om å beholde sykepenger under opphold i utlandet',
    'Timelister',
    'Utenlandsk sykmelding',
    'Uttalelse',
    'Yrkesskade',
  ],
  SYM: ['Egenerklæring for utenlandske sykmeldinger', 'Sykmelding', 'Utenlandsk sykmelding'],
  TIL: [
    'Arbeidsplassvurdering - Rekvisisjon og rapportskjema',
    'Avtale om arbeidstrening',
    'Avtale om oppstart lønnstilskudd',
    'Faktura',
    'Forespørsel',
    'Fremmøteliste',
    'Klage',
    'Refusjonskrav',
    'Resultatrapport',
    'Rettsavgjørelse',
    'Stevning',
    'Søknad om refusjon av honorar til bruk av godkjent bedriftshelsetjeneste',
    'Søknad om tilretteleggingstilskudd (gjelder IA-virksomheter)',
    'Søknad om tiltak',
    'Uttalelse',
  ],
  TRK: [
    'Endring',
    'Erstatningskrav',
    'Forvaltningstrekk',
    'Gjeldsordning',
    'Husleietrekk',
    'Klage',
    'Merknader i klagesak',
    'Purring',
    'Refusjonskrav',
    'Skattekorrigering',
    'Stoppmelding',
    'Tilleggstrekk skatt',
    'Trekk',
    'Trekkopplysninger for arbeidstaker som skal ha sykepenger, foreldrepenger, svangerskapspenger, pleie-/opplæringspenger og omsorgspenger',
    'Vederlagstrekk',
  ],
  TRY: [
    'Anke',
    'Anke på tilbakekreving',
    'Arbeidsforhold',
    'Endring i sivilstand',
    'EØS-dokument',
    'Faktura',
    'Forespørsel',
    'Fullmakt',
    'Fødselsattest',
    'Fødselsmelding',
    'Inntektsopplysninger',
    'Institusjonsopphold',
    'Klage',
    'Klage på tilbakekreving',
    'Medisinsk dokumentasjon',
    'Refusjonskrav',
    'Skatteopplysninger',
    'Stevning',
    'Uttalelse',
    'Uttalelse tilbakekreving',
  ],
  TSO: [
    'Anke',
    'Bekreftelse på barns plass i barnehage/skolefritidsordning',
    'Bekreftelse på samling',
    'Bekreftelse på særskilte behov for flere hjemreiser',
    'Bekreftelse på utdanning',
    'Bostedsbevis',
    'Dokumentasjon av innhentede tilbud',
    'Dokumentasjon av plass på kurs eller utdanning',
    'Dokumentasjon av reiseutgifter',
    'Dokumentasjon av utgifter',
    'Dokumentasjon av utgifter knyttet til bruk av egen bil',
    'Dokumentasjon av årsak til reise/flytting',
    'Dokumentasjon boutgifter',
    'Dokumentasjon enslig forsørger',
    'Dokumentasjon flytteårsak/utgifter',
    'Dokumentasjon gjenlevende ektefelle',
    'Dokumentasjon på behov for tilsyn',
    'Dokumentasjon tidligere familiepleier',
    'Faktura',
    'Forespørsel',
    'Institusjonsopphold',
    'Kjøreliste for godkjent bruk av egen bil',
    'Klage',
    'Krav om gjenopptak av ankesak',
    'Medisinske opplysninger',
    'Merknader i ankesak',
    'Merknader i klagesak',
    'Oppholdsopplysninger',
    'Refusjon reisetilskudd',
    'Refusjonskrav',
    'Rettsavgjørelse',
    'Stevning',
    'Søknad om tilleggsstønad',
    'Uttalelse',
  ],
  TSR: [
    'Bekreftelse på samling',
    'Bekreftelse på særskilte behov for flere hjemreiser',
    'Dokumentasjon av reiseutgifter',
    'Dokumentasjon av utgifter',
    'Dokumentasjon på innhentede tilbud',
    'Dokumentasjon på utgifter knyttet til bruk av egen bil',
    'Dokumentasjon på årsak til reise/flytting',
    'Faktura',
    'Kjøreliste for bruk av egen bil arbeidssøker',
    'Klage',
    'Refusjon av reisetilskudd',
    'Refusjonskrav',
    'Rettsavgjørelse',
    'Stevning',
    'Søknad om tilleggsstønader',
    'Uttalelse',
  ],
  UFM: [
    'A1 Attest om den lovgivningen som skal anvendes',
    'A1 Attest om den trygdelovgivning som den innehavende er omfattet av',
    'Anke',
    'Attest for utsendte arbeidstakere fra Australia til Norge',
    'Attest for utsendte arbeidstakere fra Canada til Norge',
    'Attest for utsendte arbeidstakere fra USA til Norge',
    'Bekreftelse på unntak etter EØS-avtalen',
    'Bekreftelse på unntak etter bilateral avtale',
    'E 101 Attest om den lovgivningen som skal anvendes',
    'Forespørsel',
    'Klage',
    'Krav om gjenopptak av ankesak',
    'Purring',
    'Svar på forespørsel',
    'Søknad om unntak etter EØS-avtalen',
    'Søknad om unntak etter bilateral avtale',
    'Søknad om unntak etter britisk konvensjon',
    'Søknad om unntak etter folketrygdloven',
    'Uttalelse',
    'Vedtak',
  ],
  UFO: [],
  VEN: [
    'Arbeidsforhold',
    'EØS-dokument',
    'Faktura',
    'Forespørsel',
    'Inntektsopplysninger',
    'Institusjonsopphold',
    'Klage',
    'Medisinsk dokumentasjon',
    'Refusjonskrav',
    'Rettsavgjørelse',
    'Skatteopplysninger',
    'Stevning',
    'Søknad om ventelønn',
    'Uttalelse',
  ],
  YRA: [],
  YRK: [
    'Anke',
    'Anke på tilbakekreving',
    'Arbeidsforhold',
    'Arbeidstilsynsmelding',
    'Ber om innsyn',
    'EØS-dokument',
    'Faktura',
    'Forespørsel',
    'Fullmakt',
    'Inntektsopplysninger',
    'Institusjonsopphold',
    'Klage',
    'Klage på tilbakekreving',
    'Krav om gjenopptak av ankesak',
    'Medisinsk dokumentasjon',
    'Melding om yrkesskade',
    'Merknader i ankesak',
    'Refusjonskrav',
    'Rettsavgjørelse',
    'Skadeforklaring',
    'Skadelig påvirkning i arbeid',
    'Skatteopplysninger',
    'Stevning',
    'Søknad fra selvstendig næringsdrivende og frilansere om opptak i frivillig trygd med rett til særytelser ved yrkesskade',
    'Søknad om menerstatning',
    'Tannlegeerklæring',
    'Uttalelse',
    'Uttalelse tilbakekreving',
  ],
};
