import React, { useState } from 'react';
import { Editor, Range, Selection } from 'slate';
import { getFocusedCommentThreadIds } from './get-focused-thread-ids';

interface Props {
  children: JSX.Element[] | null;
}

export const SmartEditorContextComponent = ({ children }: Props) => {
  const [elementId, setElementId] = useState<string | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [selection, setSelection] = useState<Selection>(null);

  const focusedThreadIds = getFocusedCommentThreadIds(editor);
  const showNewThread = editor !== null && editor.selection !== null && Range.isExpanded(editor.selection);

  return (
    <SmartEditorContext.Provider
      value={{
        elementId,
        focusedThreadIds,
        showNewThread,
        editor,
        selection,
        setElementId,
        setEditor,
        setSelection,
      }}
    >
      {children}
    </SmartEditorContext.Provider>
  );
};

interface ISmartEditorContext {
  focusedThreadIds: string[];
  showNewThread: boolean;
  elementId: string | null;
  editor: Editor | null;
  selection: Selection;
  setElementId: (elementId: string) => void;
  setEditor: (editor: Editor | null) => void;
  setSelection: (selection: Selection) => void;
}

export const SmartEditorContext = React.createContext<ISmartEditorContext>({
  focusedThreadIds: [],
  showNewThread: false,
  elementId: null,
  editor: null,
  selection: null,
  setElementId: () => {},
  setEditor: () => {},
  setSelection: () => {},
});
