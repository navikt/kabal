import {
  FAGSYSTEM_ARBEIDSOPPFØLGING,
  FAGSYSTEM_ARENA,
  FAGSYSTEM_GOSYS,
} from '@/components/oppgavebehandling-footer/fagsystem';

// https://nav-it.slack.com/archives/G01CTUC8LSU/p1787141984237739
// https://nav-it.slack.com/archives/G01CTUC8LSU/p1788425945624739
// https://nav-it.slack.com/archives/G01CTUC8LSU/p1790239624564469
export const treatAsArena = (fagsystemId: string, requiresGosysOppgave: boolean) => {
  if (!requiresGosysOppgave) {
    return false;
  }

  return (
    fagsystemId === FAGSYSTEM_ARENA || fagsystemId === FAGSYSTEM_ARBEIDSOPPFØLGING || fagsystemId === FAGSYSTEM_GOSYS
  );
};

// Only actual Arena cases, not Arbeidsoppfølging or Gosys.
// https://nav-it.slack.com/archives/G01CTUC8LSU/p1790757728942239?thread_ts=1790683854.400249&cid=G01CTUC8LSU
export const isArenaCase = (fagsystemId: string, requiresGosysOppgave: boolean) =>
  requiresGosysOppgave && fagsystemId === FAGSYSTEM_ARENA;
