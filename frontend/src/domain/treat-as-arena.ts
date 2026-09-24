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
