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
export const reloadFileInAllViewers = async (url: string): Promise<void> => {
  const promises: Promise<boolean>[] = [];

  for (const handle of fileViewerHandles) {
    promises.push(handle.reloadFile(url));
  }

  await Promise.all(promises);
};
