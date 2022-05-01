import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Descendant, Node, NodeEntry, Range, Selection, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { ReactEditor, RenderLeafProps, Slate, withReact } from 'slate-react';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useGetBrukerQuery } from '../../../redux-api/bruker';
import { useUpdateSmartEditorMutation } from '../../../redux-api/smart-editor-api';
import { MedunderskriverFlyt } from '../../../types/kodeverk';
import { SmartEditorContext } from '../context/smart-editor-context';
import { renderElement } from '../slate-elements';
import { EditorContainer, StyledEditable } from '../styled-components';
import { Toolbar } from '../toolbar/toolbar';
import { renderLeaf } from './leaf/render';
import { useKeyboard } from './use-keyboard/use-keyboard';
import { withNormalization } from './with-normalization';
import { withEditableVoids } from './with-voids';

interface RichTextElementProps {
  oppgaveId: string;
  documentId: string;
  savedContent: Descendant[];
}

export const RichTextEditorElement = React.memo(
  ({ savedContent, documentId, oppgaveId }: RichTextElementProps) => {
    const [content, setContent] = useState<Descendant[]>(savedContent);
    const [updateDocument] = useUpdateSmartEditorMutation();

    const editor = useMemo(() => withEditableVoids(withHistory(withNormalization(withReact(createEditor())))), []);
    const keyboard = useKeyboard(editor);
    const [isFocused, setIsFocused] = useState<boolean>(ReactEditor.isFocused(editor));
    const { focusedThreadId, setEditor, setSelection } = useContext(SmartEditorContext);

    const savedSelection = useRef<Selection>(editor.selection);
    const containerRef = useRef<HTMLDivElement>(null);

    const canEditDocument = useCanEditDocument();

    const decorate = useCallback<(entry: NodeEntry<Node>) => Range[]>(
      ([, path]) => {
        if (!isFocused && savedSelection.current !== null && Range.includes(savedSelection.current, path)) {
          const selectionRange = { ...savedSelection.current, selected: true };
          return [selectionRange];
        }

        return [];
      },
      [savedSelection, isFocused]
    );

    useEffect(() => {
      const timeout = setTimeout(() => {
        updateDocument({
          oppgaveId,
          dokumentId: documentId,
          content,
        });
      }, 1000);

      return () => clearTimeout(timeout);
    }, [documentId, content, oppgaveId, updateDocument]);

    const onFocus = useCallback<React.FocusEventHandler<HTMLDivElement>>(() => {
      setIsFocused(true);
      setEditor(editor);
    }, [setEditor, editor]);

    const onBlur = useCallback<React.FocusEventHandler<HTMLDivElement>>((event) => {
      // Click on all focusable elements inside the editor will trigger a blur event.
      if (containerRef.current !== null && containerRef.current.contains(event.relatedTarget)) {
        event.preventDefault();
        return;
      }

      setIsFocused(false);
    }, []);

    const renderLeafCallback = useCallback(
      (props: RenderLeafProps) => renderLeaf(props, focusedThreadId),
      [focusedThreadId]
    );

    return (
      <Slate
        editor={editor}
        value={content}
        onChange={(c) => {
          setContent(c);

          if (editor.selection === savedSelection.current) {
            return;
          }

          if (
            editor.selection !== null &&
            savedSelection.current !== null &&
            Range.equals(editor.selection, savedSelection.current)
          ) {
            return;
          }

          savedSelection.current = editor.selection;
          setSelection(editor.selection);
        }}
      >
        <EditorContainer ref={containerRef}>
          <Toolbar visible={isFocused} />
          <StyledEditable
            readOnly={!canEditDocument}
            renderElement={renderElement}
            renderLeaf={renderLeafCallback}
            decorate={decorate}
            onKeyDown={keyboard}
            onFocus={onFocus}
            onBlur={onBlur}
            data-is-focused={isFocused}
            spellCheck
          />
        </EditorContainer>
      </Slate>
    );
  },
  (prevProps, nextProps) => prevProps.documentId === nextProps.documentId
);

RichTextEditorElement.displayName = 'RichTextEditorElement';

const useCanEditDocument = (): boolean => {
  const { data: oppgave, isLoading: oppgaveIsLoading, isFetching: oppgaveIsFetching } = useOppgave();
  const { data: user, isLoading: userIsLoading } = useGetBrukerQuery();

  return useMemo<boolean>(() => {
    if (oppgaveIsLoading || userIsLoading || oppgaveIsFetching) {
      return false;
    }

    if (typeof oppgave === 'undefined' || typeof user === 'undefined' || oppgave.isAvsluttetAvSaksbehandler) {
      return false;
    }

    if (oppgave.medunderskriverFlyt === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER) {
      return oppgave.medunderskriver?.navIdent === user.navIdent;
    }

    return oppgave.tildeltSaksbehandler?.navIdent === user.navIdent;
  }, [oppgave, oppgaveIsFetching, oppgaveIsLoading, user, userIsLoading]);
};
