import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import type { TilknyttetDokument } from '@app/types/oppgavebehandling/oppgavebehandling';
import { useCallback, useMemo } from 'react';

const EMPTY_ARRAY: TilknyttetDokument[] = [];

export const useTilknyttedeDokumenter = () => {
  const { data } = useOppgave();

  const tilknyttedeDokumenter = data?.tilknyttedeDokumenter ?? EMPTY_ARRAY;

  return useMemo(() => tilknyttedeDokumenter, [tilknyttedeDokumenter]);
};

export const useIsTilknyttetDokument = (journalpostId: string, dokumentInfoId: string) => {
  const tilknyttedeDokumenter = useTilknyttedeDokumenter();

  return useMemo(
    () => tilknyttedeDokumenter.some((t) => t.journalpostId === journalpostId && t.dokumentInfoId === dokumentInfoId),
    [tilknyttedeDokumenter, journalpostId, dokumentInfoId],
  );
};

export const useLazyIsTilknyttetDokument = () => {
  const tilknyttedeDokumenter = useTilknyttedeDokumenter();

  return useCallback(
    (journalpostId: string, dokumentInfoId: string) =>
      tilknyttedeDokumenter.some((t) => t.journalpostId === journalpostId && t.dokumentInfoId === dokumentInfoId),
    [tilknyttedeDokumenter],
  );
};
