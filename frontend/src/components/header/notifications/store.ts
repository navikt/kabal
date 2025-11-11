import { type KabalNotification, NotificationType } from '@app/components/header/notifications/types';
import { Observable } from '@app/observable';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { addMinutes } from 'date-fns';

export const notificationsStore = new Observable<KabalNotification[]>([
  {
    type: NotificationType.MESSAGE,
    id: crypto.randomUUID(),
    read: false,
    createdAt: new Date().toISOString().slice(0, -1),
    actor: {
      navIdent: 'Z123456',
      navn: 'Ola Nordmann',
    },
    behandling: {
      id: '3ab8e6c3-3a8d-475e-a4cb-bf521ddfd7b5',
      typeId: SaksTypeEnum.KLAGE,
      ytelseId: '5',
      saksnummer: '21/54321',
    },
    content: 'Dette er en testmelding fra Ola Nordmann.',
  },
  {
    type: NotificationType.MESSAGE,
    id: crypto.randomUUID(),
    read: false,
    createdAt: new Date().toISOString().slice(0, -1),
    actor: {
      navIdent: 'Z123456',
      navn: 'Ola Nordmann',
    },
    behandling: {
      id: '05794b15-4c01-427d-8855-7bc134bb7b95',
      typeId: SaksTypeEnum.KLAGE,
      ytelseId: '5',
      saksnummer: '21/54321',
    },
    content: 'Dette er en testmelding fra Ola Nordmann.',
  },
  {
    type: NotificationType.MESSAGE,
    id: crypto.randomUUID(),
    read: false,
    createdAt: new Date().toISOString().slice(0, -1),
    actor: {
      navIdent: 'Z123456',
      navn: 'Ola Nordmann',
    },
    behandling: {
      id: '3ab8e6c3-3a8d-475e-a4cb-bf521ddfd7b5',
      typeId: SaksTypeEnum.KLAGE,
      ytelseId: '5',
      saksnummer: '21/54321',
    },
    content: 'Dette er en testmelding fra Ola Nordmann.',
  },
  {
    type: NotificationType.MESSAGE,
    id: crypto.randomUUID(),
    read: false,
    createdAt: new Date().toISOString().slice(0, -1),
    actor: {
      navIdent: 'Z123456',
      navn: 'Ola Nordmann',
    },
    behandling: {
      id: '05794b15-4c01-427d-8855-7bc134bb7b95',
      typeId: SaksTypeEnum.KLAGE,
      ytelseId: '5',
      saksnummer: '21/54321',
    },
    content: 'Dette er en testmelding fra Ola Nordmann.',
  },
  {
    type: NotificationType.MESSAGE,
    id: crypto.randomUUID(),
    read: false,
    createdAt: new Date().toISOString().slice(0, -1),
    actor: {
      navIdent: 'Z123456',
      navn: 'Ola Nordmann',
    },
    behandling: {
      id: '3ab8e6c3-3a8d-475e-a4cb-bf521ddfd7b5',
      typeId: SaksTypeEnum.KLAGE,
      ytelseId: '5',
      saksnummer: '21/54321',
    },
    content: 'Dette er en testmelding fra Ola Nordmann.',
  },
  {
    type: NotificationType.MESSAGE,
    id: crypto.randomUUID(),
    read: false,
    createdAt: new Date().toISOString().slice(0, -1),
    actor: {
      navIdent: 'Z123456',
      navn: 'Ola Nordmann',
    },
    behandling: {
      id: '05794b15-4c01-427d-8855-7bc134bb7b95',
      typeId: SaksTypeEnum.KLAGE,
      ytelseId: '5',
      saksnummer: '21/54321',
    },
    content: 'Dette er en testmelding fra Ola Nordmann.',
  },
  {
    type: NotificationType.MESSAGE,
    id: crypto.randomUUID(),
    read: false,
    createdAt: new Date().toISOString().slice(0, -1),
    actor: {
      navIdent: 'Z123456',
      navn: 'Ola Nordmann',
    },
    behandling: {
      id: '3ab8e6c3-3a8d-475e-a4cb-bf521ddfd7b5',
      typeId: SaksTypeEnum.KLAGE,
      ytelseId: '5',
      saksnummer: '21/54321',
    },
    content: 'Dette er en testmelding fra Ola Nordmann.',
  },
  {
    type: NotificationType.MESSAGE,
    id: crypto.randomUUID(),
    read: false,
    createdAt: addMinutes(new Date(), 1).toISOString().slice(0, -1),
    actor: {
      navIdent: 'Z123456',
      navn: 'Ola Nordmann',
    },
    behandling: {
      id: 'de678d29-b6ea-4028-926e-a9660da60d2d',
      typeId: SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR,
      ytelseId: '43',
      saksnummer: '22/12345',
    },
    content: 'Dette er en testmelding fra Ola Nordmann.',
  },
  {
    type: NotificationType.JOURNALPOST,
    id: crypto.randomUUID(),
    read: false,
    createdAt: addMinutes(new Date(), 5).toISOString().slice(0, -1),
    journalpostId: 'JP-987654321',
    temaId: 'FOR',
    documentNames: ['Dokument 1', 'Dokument 2'],
    behandling: {
      id: '3ab8e6c3-3a8d-475e-a4cb-bf521ddfd7b5',
      typeId: SaksTypeEnum.KLAGE,
      ytelseId: '5',
      saksnummer: '21/54321',
    },
  },
  {
    type: NotificationType.MESSAGE,
    id: crypto.randomUUID(),
    read: true,
    createdAt: addMinutes(new Date(), 10).toISOString().slice(0, -1),
    actor: {
      navIdent: 'Z123456',
      navn: 'Ola Nordmann',
    },
    behandling: {
      id: '05794b15-4c01-427d-8855-7bc134bb7b95',
      typeId: SaksTypeEnum.KLAGE,
      ytelseId: '5',
      saksnummer: '21/54321',
    },
    content:
      'Dette er en testmelding fra Ola Nordmann. Denne meldingen er alt for lang for å teste hvordan tekstbryting fungerer i notifikasjonsvinduet. Vi ønsker å sikre at selv veldig lange meldinger vises korrekt uten å ødelegge layouten eller brukervennligheten.',
  },
  {
    type: NotificationType.SYSTEM,
    id: crypto.randomUUID(),
    read: false,
    createdAt: addMinutes(new Date(), 15).toISOString().slice(0, -1),
    title: 'Problemer med KA-rutinen',
    content:
      'Den tekniske koblingen mellom KA-rutinen og Kabal er nede. Dette kan føre til noe redusert funksjonalitet i Kabal.',
  },
  {
    type: NotificationType.SYSTEM,
    id: crypto.randomUUID(),
    read: true,
    createdAt: addMinutes(new Date(), 15).toISOString().slice(0, -1),
    title: 'Problemer med PDL',
    content:
      'PDL har tekniske problemer. Kabal vil kunne oppleve forsinkelser ved henting av persondata i denne perioden.',
  },
]);
