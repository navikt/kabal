import type { oppgaverApi } from '@/redux-api/oppgaver/oppgaver';

export type Dispatch = Parameters<(typeof oppgaverApi)['middleware']>[0]['dispatch'];
