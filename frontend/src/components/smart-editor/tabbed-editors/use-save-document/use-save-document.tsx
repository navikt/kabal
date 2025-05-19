import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useMyPlateEditorState } from '@app/plate/types';
import { useSaveDocumentMutation } from '@app/redux-api/oppgaver/mutations/smart-document';
import { skipToken } from '@reduxjs/toolkit/query';
import { slateNodesToInsertDelta } from '@slate-yjs/core';
import { useCallback, useContext, useEffect } from 'react';
import { Doc, XmlText, encodeStateAsUpdateV2 } from 'yjs';
import { getSaveId, getSaveSuccessId } from './ids';

/**
 * Registers a save handler for the smart editor that can be called when PDF rendering fails.
 * We use events because the PDF component is not a child of the smart editor.
 *
 * PDF rendering can fail when BE's state is wrong,
 * for example when a list in a redigerbar maltekst is undoed back to paragraphs.
 *
 * When the event is fired, the smart editor will save the document from the correct frontend state.
 */
export const useSaveDocument = () => {
  const oppgaveId = useOppgaveId();
  const { dokumentId } = useContext(SmartEditorContext);
  const editor = useMyPlateEditorState(dokumentId);
  const [saveDocument] = useSaveDocumentMutation();

  const save = useCallback(async () => {
    if (oppgaveId === skipToken) {
      return;
    }

    const doc = new Doc();
    const xmlText = doc.get('content', XmlText);
    const insertDelta = slateNodesToInsertDelta(editor.children);
    xmlText.applyDelta(insertDelta);
    const state = encodeStateAsUpdateV2(doc);
    const data = btoa(String.fromCharCode(...new Uint8Array(state)));

    await saveDocument({ content: editor.children, dokumentId, oppgaveId, data });

    window.dispatchEvent(new CustomEvent(getSaveSuccessId(dokumentId)));
  }, [oppgaveId, dokumentId, editor.children, saveDocument]);

  useEffect(() => {
    const id = getSaveId(dokumentId);

    window.addEventListener(id, save);
    return () => window.removeEventListener(id, save);
  }, [save, dokumentId]);
};
