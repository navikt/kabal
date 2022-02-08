import React, { useState } from 'react';
import { Editor, Range, Selection } from 'slate';
import { getFocusedCommentThreadIds } from './get-focused-thread-ids';

interface Props {
  children: JSX.Element[] | null;
  documentId: null | string;
}

export const SmartEditorContextComponent = ({ children, documentId }: Props) => {
  const [elementId, setElementId] = useState<string | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [selection, setSelection] = useState<Selection>(null);

  const focusedThreadIds = getFocusedCommentThreadIds(editor);
  const showNewThread = editor !== null && editor.selection !== null && Range.isExpanded(editor.selection);

  return (
    <SmartEditorContext.Provider
      value={{
        documentId,
        editor,
        elementId,
        focusedThreadIds,
        selection,
        setEditor,
        setElementId,
        setSelection,
        showNewThread,
      }}
    >
      {children}
    </SmartEditorContext.Provider>
  );
};

interface ISmartEditorContext {
  documentId: string | null;
  editor: Editor | null;
  elementId: string | null;
  focusedThreadIds: string[];
  selection: Selection;
  setEditor: (editor: Editor | null) => void;
  setElementId: (elementId: string) => void;
  setSelection: (selection: Selection) => void;
  showNewThread: boolean;
}

export const SmartEditorContext = React.createContext<ISmartEditorContext>({
  documentId: null,
  editor: null,
  elementId: null,
  focusedThreadIds: [],
  selection: null,
  setEditor: () => {},
  setElementId: () => {},
  setSelection: () => {},
  showNewThread: false,
});
