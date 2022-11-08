import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Descendant, Node, NodeEntry, Range, Selection, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { ReactEditor, RenderLeafProps, Slate, withReact } from 'slate-react';
import { RichTextContext } from '../context/context';
import { renderElement } from '../slate-elements/render-elements';
import { EditorContainer, StyledEditable } from '../styled-components';
import { SmartEditorButtonsProps } from '../toolbar/smart-editor-buttons';
import { Toolbar } from '../toolbar/toolbar';
import { renderLeaf } from './leaf/render';
import { useKeyboard } from './use-keyboard/use-keyboard';
import { withNormalization } from './with-normalization';
import { withEditableVoids } from './with-voids';

interface RichTextElementProps extends SmartEditorButtonsProps {
  id: string;
  savedContent: Descendant[];
  canEdit: boolean;
  onChange: (value: Descendant[]) => void;
  className?: string;
  focusedThreadId?: string | null;
  onSelect?: (selection: Selection) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
}

export const RichTextEditorElement = React.memo(
  ({
    savedContent,
    canEdit,
    onChange,
    showCommentsButton,
    showAnnotationsButton,
    showGodeFormuleringerButton,
    showPlaceholderButton,
    className,
    focusedThreadId,
    onSelect,
    onKeyDown,
  }: RichTextElementProps) => {
    const editor = useMemo(() => withEditableVoids(withHistory(withNormalization(withReact(createEditor())))), []);
    const keyboard = useKeyboard(editor);
    const [isFocused, setIsFocused] = useState<boolean>(ReactEditor.isFocused(editor));
    const { setEditor } = useContext(RichTextContext);

    const savedSelection = useRef<Selection>(editor.selection);
    const containerRef = useRef<HTMLDivElement>(null);

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
      setEditor(editor);

      return () => setEditor(null);
    });

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
        value={savedContent}
        onChange={(c) => {
          onChange(c);

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

          if (typeof onSelect === 'function') {
            onSelect(editor.selection);
          }
        }}
      >
        <EditorContainer ref={containerRef} className={className} onKeyDown={onKeyDown}>
          <Toolbar
            visible
            showAnnotationsButton={showAnnotationsButton}
            showCommentsButton={showCommentsButton}
            showGodeFormuleringerButton={showGodeFormuleringerButton}
            showPlaceholderButton={showPlaceholderButton}
          />
          <StyledEditable
            readOnly={!canEdit}
            renderElement={renderElement}
            renderLeaf={renderLeafCallback}
            decorate={decorate}
            onKeyDown={keyboard}
            onFocus={onFocus}
            onBlur={onBlur}
            data-is-focused={isFocused}
            className={className}
            spellCheck
          />
        </EditorContainer>
      </Slate>
    );
  },
  (prevProps, nextProps) =>
    prevProps.id === nextProps.id &&
    prevProps.onChange === nextProps.onChange &&
    prevProps.onSelect === nextProps.onSelect &&
    prevProps.canEdit === nextProps.canEdit &&
    prevProps.showAnnotationsButton === nextProps.showAnnotationsButton &&
    prevProps.showCommentsButton === nextProps.showCommentsButton &&
    prevProps.showGodeFormuleringerButton === nextProps.showGodeFormuleringerButton &&
    prevProps.showPlaceholderButton === nextProps.showPlaceholderButton &&
    prevProps.focusedThreadId === nextProps.focusedThreadId
);

RichTextEditorElement.displayName = 'RichTextEditorElement';
