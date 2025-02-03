import { toast } from '@app/components/toast/store';
import { pushEvent, pushLog } from '@app/observability';
import { nodeNormalize } from '@app/plate/plugins/normalize-node';
import { LogLevel } from '@grafana/faro-web-sdk';
import type { skipToken } from '@reduxjs/toolkit/query';
import { type Descendant, ElementApi } from '@udecode/plate';
import type { PlateEditor } from '@udecode/plate-core/react';
import { Scrubber } from 'slate';

export const fixDocument = (editor: PlateEditor, id?: string | typeof skipToken) => {
  const oppgaveId = typeof id === 'string' ? id : '';

  pushEvent('fix-document', 'plate');

  const before = Scrubber.stringify(editor.children);

  let normalizations = 0;

  const normalize = (children: Descendant[]) => {
    for (const child of children) {
      const path = editor.api.findPath(child);

      if (path === undefined) {
        const options = { context: { node: Scrubber.stringify(child) } };

        pushLog('Normalize document: Could not find path for node', options, LogLevel.WARN);

        continue;
      }

      if (ElementApi.isElement(child)) {
        if (nodeNormalize(editor, child, path)) {
          normalizations++;
        }

        normalize(child.children);
      }
    }
  };

  normalize(editor.children);

  const after = Scrubber.stringify(editor.children);

  pushLog('Normalized document', { context: { oppgaveId, before, after } });

  if (normalizations > 0) {
    return toast.success(
      `Utførte ${normalizations} ${normalizations === 1 ? 'reparasjon' : 'reparasjoner'} i dokumentet.`,
    );
  }

  return toast.info('Fant ingen reparasjoner å utføre.');
};
