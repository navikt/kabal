import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import { getFileViewerUrl } from '@/domain/file-viewer-url';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useFilesViewed } from '@/hooks/settings/use-setting';

/** Returns the file-viewer URL for the currently viewed file set, or `null` if nothing is being viewed. */
export const useFileViewerUrl = (): string | null => {
  const { value: pdfViewed } = useFilesViewed();
  const oppgaveId = useOppgaveId();

  return useMemo(
    () => getFileViewerUrl(pdfViewed, oppgaveId === skipToken ? undefined : oppgaveId),
    [pdfViewed, oppgaveId],
  );
};
