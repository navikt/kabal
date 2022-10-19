import React, { useCallback, useContext, useState } from 'react';
import { Editor, Element, Range, Selection } from 'slate';
import { NoTemplateIdEnum, TemplateIdEnum } from '../../../types/smart-editor/template-enums';
import { IRichTextContext, RichTextContext, RichTextContextComponent } from '../../rich-text/context/context';
import { getFocusedThreadIdFromText } from './get-focused-thread-id';

export interface ISmartEditorContext extends IRichTextContext {
  readonly templateId: null | TemplateIdEnum | NoTemplateIdEnum;
  readonly documentId: null | string;
  readonly focusedThreadId: string | null;
  readonly setFocusedThreadId: (threadId: string | null) => void;
  readonly showNewComment: boolean;
  readonly setShowNewComment: (showNewComment: boolean) => void;
  readonly showMaltekstTags: boolean;
  readonly setShowMaltekstTags: (showMaltekstTags: boolean) => void;
  readonly showGodeFormuleringer: boolean;
  readonly setShowGodeFormuleringer: (showGodeFormuleringer: boolean) => void;
  readonly selection: Selection;
  readonly setSelection: (selection: Selection) => void;
}

interface Props {
  readonly children: React.ReactNode;
  readonly documentId: string | null;
  readonly templateId: TemplateIdEnum | NoTemplateIdEnum;
}

export const SmartEditorContextComponent = ({ children, documentId, templateId }: Props) => (
  <RichTextContextComponent key={documentId}>
    <InternalSmartEditorContextComponent key={documentId} documentId={documentId} templateId={templateId}>
      {children}
    </InternalSmartEditorContextComponent>
  </RichTextContextComponent>
);

const InternalSmartEditorContextComponent = ({ children, documentId, templateId }: Props) => {
  const { editor, setEditor } = useContext(RichTextContext);
  const [selection, setSelection] = useState<Selection>(null);
  const [focusedThreadId, setFocusedThreadId] = useState<string | null>(getFocusedThreadIdFromText(editor, selection));
  const [showNewComment, setShowNewComment] = useState<boolean>(false);
  const [showGodeFormuleringer, setShowGodeFormuleringer] = useState<boolean>(false);
  const [showMaltekstTags, setShowMaltekstTags] = useState<boolean>(false);

  const interalSetSelection = useCallback(
    (newSelection: Selection) => {
      if (editor === null || newSelection === null) {
        setFocusedThreadId(null);
        setSelection(null);
        setShowNewComment(false);

        return;
      }

      if (Range.isCollapsed(newSelection)) {
        const [selectedEntry] = Editor.nodes(editor, {
          at: newSelection,
          voids: false,
          match: Element.isElement,
        });

        if (typeof selectedEntry === 'undefined') {
          setFocusedThreadId(null);
          setShowNewComment(false);
          setSelection(newSelection);

          return;
        }

        const threadId = getFocusedThreadIdFromText(editor, newSelection);
        setFocusedThreadId(threadId);
        setShowNewComment(false);
        setSelection(newSelection);

        return;
      }

      setFocusedThreadId(null);
      setShowNewComment(false);
      setSelection(newSelection);
    },
    [editor]
  );

  return (
    <SmartEditorContext.Provider
      value={{
        templateId,
        documentId,
        editor,
        setEditor,
        focusedThreadId,
        setFocusedThreadId,
        selection,
        setSelection: interalSetSelection,
        showNewComment,
        setShowNewComment,
        showMaltekstTags,
        setShowMaltekstTags,
        showGodeFormuleringer,
        setShowGodeFormuleringer,
      }}
    >
      {children}
    </SmartEditorContext.Provider>
  );
};

export const SmartEditorContext = React.createContext<ISmartEditorContext>({
  documentId: null,
  editor: null,
  setEditor: () => {},
  focusedThreadId: null,
  setFocusedThreadId: () => {},
  selection: null,
  setSelection: () => {},
  showNewComment: false,
  setShowNewComment: () => {},
  showMaltekstTags: false,
  setShowMaltekstTags: () => {},
  showGodeFormuleringer: true,
  setShowGodeFormuleringer: () => {},
  templateId: null,
});
