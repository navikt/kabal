import type { KlageFileViewerHandle } from '@navikt/klage-file-viewer';

/** Module-scoped store for active file viewer handles, accessible from outside React (e.g. SSE event handlers). */
const fileViewerHandles = new Set<KlageFileViewerHandle>();

export const addFileViewerHandle = (handle: KlageFileViewerHandle): void => {
  fileViewerHandles.add(handle);
};

export const removeFileViewerHandle = (handle: KlageFileViewerHandle): void => {
  fileViewerHandles.delete(handle);
};

/** Calls `reloadFile` on all registered file viewer handles. */
export const reloadFileInAllViewers = (url: string): void => {
  for (const handle of fileViewerHandles) {
    handle.reloadFile(url);
  }
};
