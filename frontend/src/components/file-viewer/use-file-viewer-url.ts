import { getFileViewerUrl } from '@app/domain/file-viewer-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useFilesViewed } from '@app/hooks/settings/use-setting';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';

/** Returns the file-viewer URL for the currently viewed file set, or `null` if nothing is being viewed. */
export const useFileViewerUrl = (): string | null => {
  const { value: pdfViewed } = useFilesViewed();
  const oppgaveId = useOppgaveId();

  return useMemo(
    () => getFileViewerUrl(pdfViewed, oppgaveId === skipToken ? undefined : oppgaveId),
    [pdfViewed, oppgaveId],
  );
};
