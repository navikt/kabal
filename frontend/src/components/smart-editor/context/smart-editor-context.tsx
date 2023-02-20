import { Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Editor, Element, Range, Selection, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact } from 'slate-react';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useUpdateSmartEditorMutation } from '../../../redux-api/oppgaver/mutations/smart-editor';
import { useGetSmartEditorQuery } from '../../../redux-api/oppgaver/queries/smart-editor';
import { IDocumentParams } from '../../../types/documents/common-params';
import { DocumentType } from '../../../types/documents/documents';
import { NoTemplateIdEnum, TemplateIdEnum } from '../../../types/smart-editor/template-enums';
import { withCopy } from '../../rich-text/rich-text-editor/with-copy';
import { withNormalization } from '../../rich-text/rich-text-editor/with-normalization';
import { withTables } from '../../rich-text/rich-text-editor/with-tables';
import { withEditableVoids } from '../../rich-text/rich-text-editor/with-voids';
import { getFocusedThreadIdFromText } from './get-focused-thread-id';

export interface ISmartEditorContext {
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
  readonly dokumentTypeId: DocumentType;
}
interface Props {
  readonly children: React.ReactNode;
  readonly documentId: string | null;
  readonly templateId: TemplateIdEnum | NoTemplateIdEnum;
  readonly dokumentTypeId: DocumentType;
}

export const SmartEditorContextComponent = ({ children, documentId, templateId, dokumentTypeId }: Props) => {
  const editor = useMemo(
    () => withTables(withCopy(withEditableVoids(withHistory(withNormalization(withReact(createEditor())))))),
    []
  );

  const [focusedThreadId, setFocusedThreadId] = useState<string | null>(
    getFocusedThreadIdFromText(editor, editor.selection)
  );
  const [showNewComment, setShowNewComment] = useState<boolean>(false);
  const [showGodeFormuleringer, setShowGodeFormuleringer] = useState<boolean>(false);
  const [showMaltekstTags, setShowMaltekstTags] = useState<boolean>(false);

  const onSelect = useCallback(
    (selection: Selection) => {
      if (selection === null) {
        setFocusedThreadId(null);
        setShowNewComment(false);

        return;
      }

      if (Range.isCollapsed(selection)) {
        const [selectedEntry] = Editor.nodes(editor, {
          at: selection,
          voids: false,
          match: Element.isElement,
        });

        if (typeof selectedEntry === 'undefined') {
          setFocusedThreadId(null);
          setShowNewComment(false);

          return;
        }

        const threadId = getFocusedThreadIdFromText(editor, selection);
        setFocusedThreadId(threadId);
        setShowNewComment(false);

        return;
      }

      setFocusedThreadId(null);
      setShowNewComment(false);
    },
    [editor]
  );

  const oppgaveId = useOppgaveId();

  const [updateDocument] = useUpdateSmartEditorMutation();

  const query: IDocumentParams | typeof skipToken =
    documentId === null || oppgaveId === skipToken ? skipToken : { oppgaveId, dokumentId: documentId };

  const { data, isFetching } = useGetSmartEditorQuery(query);

  const timeout = useRef<NodeJS.Timeout | undefined>(undefined);

  if (isFetching || data === null || data === undefined) {
    return <Loader size="xlarge" />;
  }

  return (
    <SmartEditorContext.Provider
      key={documentId}
      value={{
        templateId,
        documentId,
        focusedThreadId,
        setFocusedThreadId,
        showNewComment,
        setShowNewComment,
        showMaltekstTags,
        setShowMaltekstTags,
        showGodeFormuleringer,
        setShowGodeFormuleringer,
        dokumentTypeId,
      }}
    >
      <Slate
        editor={editor}
        value={data.content}
        onChange={(content) => {
          clearTimeout(timeout.current);

          if (documentId === null || oppgaveId === skipToken) {
            return;
          }

          timeout.current = setTimeout(() => {
            updateDocument({
              oppgaveId,
              dokumentId: documentId,
              content,
              version: data?.version,
            });
          }, 1000);

          onSelect(editor.selection);
        }}
      >
        {children}
      </Slate>
    </SmartEditorContext.Provider>
  );
};

export const SmartEditorContext = React.createContext<ISmartEditorContext>({
  documentId: null,
  focusedThreadId: null,
  setFocusedThreadId: () => {},
  showNewComment: false,
  setShowNewComment: () => {},
  showMaltekstTags: false,
  setShowMaltekstTags: () => {},
  showGodeFormuleringer: true,
  setShowGodeFormuleringer: () => {},
  templateId: null,
  dokumentTypeId: DocumentType.BREV,
});
