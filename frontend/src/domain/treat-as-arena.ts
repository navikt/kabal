import { FAGSYSTEM_ARBEIDSOPPFØLGING, FAGSYSTEM_ARENA } from '@/components/oppgavebehandling-footer/fagsystem';

export const treatAsArena = (fagsystemId: string, requiresGosysOppgave: boolean) =>
  fagsystemId === FAGSYSTEM_ARENA || (fagsystemId === FAGSYSTEM_ARBEIDSOPPFØLGING && requiresGosysOppgave);
