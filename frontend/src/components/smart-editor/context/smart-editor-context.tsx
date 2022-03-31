import React, { useEffect, useState } from 'react';
import { Editor, Range, Selection } from 'slate';
import { ReactEditor } from 'slate-react';
import { getFocusedCommentThreadId } from './get-focused-thread-id';

interface Props {
  children: JSX.Element[] | null;
  documentId: null | string;
}

export const SmartEditorContextComponent = ({ children, documentId }: Props) => {
  const [elementId, setElementId] = useState<string | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [selection, setSelection] = useState<Selection>(null);
  const [focusedThreadId, setFocusedThreadId] = useState<string | null>(getFocusedCommentThreadId(editor, selection));

  useEffect(() => {
    if (editor !== null && selection !== null) {
      const threadId = getFocusedCommentThreadId(editor, selection);
      setFocusedThreadId(threadId);
    }
  }, [editor, selection, setFocusedThreadId]);

  const showNewThread =
    editor !== null && selection !== null && Range.isExpanded(selection) && ReactEditor.hasRange(editor, selection);

  return (
    <SmartEditorContext.Provider
      value={{
        documentId,
        editor,
        setEditor,
        elementId,
        setElementId,
        focusedThreadId,
        setFocusedThreadId,
        selection,
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
  setEditor: (editor: Editor | null) => void;
  elementId: string | null;
  setElementId: (elementId: string) => void;
  focusedThreadId: string | null;
  setFocusedThreadId: (threadId: string | null) => void;
  selection: Selection;
  setSelection: (selection: Selection) => void;
  showNewThread: boolean;
}

export const SmartEditorContext = React.createContext<ISmartEditorContext>({
  documentId: null,
  editor: null,
  setEditor: () => {},
  elementId: null,
  setElementId: () => {},
  focusedThreadId: null,
  setFocusedThreadId: () => {},
  selection: null,
  setSelection: () => {},
  showNewThread: false,
});
