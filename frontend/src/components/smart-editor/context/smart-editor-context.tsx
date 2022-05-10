import React, { useState } from 'react';
import { Editor, Element, Range, Selection } from 'slate';
import { isCommentableVoid } from '../editor-type-guards';
import { CommentableVoidElementTypes } from '../editor-void-types';
import { getFocusedThreadIdFromText } from './get-focused-thread-id';

interface Props {
  children: React.ReactNode;
  documentId: null | string;
}

export const SmartEditorContextComponent = ({ children, documentId }: Props) => {
  const [elementId, setElementId] = useState<string | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [selection, setSelection] = useState<Selection>(null);
  const [focusedThreadId, setFocusedThreadId] = useState<string | null>(getFocusedThreadIdFromText(editor, selection));
  const [activeElement, setActiveElement] = useState<CommentableVoidElementTypes | null>(null);
  const [showNewComment, setShowNewComment] = useState<boolean>(false);

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
        setSelection: (newSelection) => {
          if (editor === null || newSelection === null) {
            setFocusedThreadId(null);
            setActiveElement(null);
            setSelection(null);
            setShowNewComment(false);
            return;
          }

          if (Range.isCollapsed(newSelection)) {
            const [selectedEntry] = Editor.nodes(editor, {
              at: newSelection,
              voids: true,
              match: Element.isElement,
            });

            if (typeof selectedEntry === 'undefined') {
              setFocusedThreadId(null);
              setActiveElement(null);
              setShowNewComment(false);
              setSelection(newSelection);
              return;
            }

            const [selectedNode] = selectedEntry;

            const isVoid = isCommentableVoid(selectedNode);

            if (isVoid) {
              const [threadId] = selectedNode.threadIds;

              if (threadId !== undefined) {
                setFocusedThreadId(threadId);
              }

              setShowNewComment(false);
              setSelection(newSelection);
              return;
            }

            const threadId = getFocusedThreadIdFromText(editor, newSelection);
            setFocusedThreadId(threadId);
            setActiveElement(null);
            setShowNewComment(false);
            setSelection(newSelection);
            return;
          }

          setFocusedThreadId(null);
          setActiveElement(null);
          setShowNewComment(false);
          setSelection(newSelection);
        },
        activeElement,
        setActiveElement,
        showNewComment,
        setShowNewComment,
      }}
    >
      {children}
    </SmartEditorContext.Provider>
  );
};

export interface ISmartEditorContext {
  documentId: string | null;
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
  elementId: string | null;
  setElementId: (elementId: string) => void;
  focusedThreadId: string | null;
  setFocusedThreadId: (threadId: string | null) => void;
  selection: Selection;
  setSelection: (selection: Selection) => void;
  activeElement: CommentableVoidElementTypes | null;
  setActiveElement: (activeElement: CommentableVoidElementTypes | null) => void;
  showNewComment: boolean;
  setShowNewComment: (showNewComment: boolean) => void;
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
  activeElement: null,
  setActiveElement: () => {},
  showNewComment: false,
  setShowNewComment: () => {},
});
