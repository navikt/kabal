import {
  FAGSYSTEM_ARBEIDSOPPFØLGING,
  FAGSYSTEM_ARENA,
  FAGSYSTEM_GOSYS,
} from '@/components/oppgavebehandling-footer/fagsystem';

// https://nav-it.slack.com/archives/G01CTUC8LSU/p1787141984237739
// https://nav-it.slack.com/archives/G01CTUC8LSU/p1788425945624739
export const treatAsArena = (fagsystemId: string, requiresGosysOppgave: boolean) => {
  if (fagsystemId === FAGSYSTEM_ARENA) {
    return true;
  }

  if (requiresGosysOppgave) {
    return fagsystemId === FAGSYSTEM_ARBEIDSOPPFØLGING || fagsystemId === FAGSYSTEM_GOSYS;
  }

  return false;
};
