import React, { memo, useCallback, useRef } from 'react';
import { Node, NodeEntry, Range, Text } from 'slate';
import { RenderLeafProps, useFocused, useSlate, useSlateSelection } from 'slate-react';
import { renderElement } from '../slate-elements/render-elements';
import { EditorContainer, StyledEditable } from '../styled-components';
import { SmartEditorButtonsProps } from '../toolbar/smart-editor-buttons';
import { Toolbar } from '../toolbar/toolbar';
import { renderLeaf } from './leaf/render';
import { useKeyboard } from './use-keyboard/use-keyboard';

interface RichTextElementProps extends SmartEditorButtonsProps {
  className?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  focusedThreadId?: string | null;
  canEdit?: boolean;
}

export const RichTextEditorElement = memo(
  ({
    showCommentsButton,
    showAnnotationsButton,
    showGodeFormuleringerButton,
    showPlaceholderButton,
    className,
    onKeyDown,
    focusedThreadId,
    canEdit = true,
  }: RichTextElementProps) => {
    const editor = useSlate();
    const selection = useSlateSelection();
    const isFocused = useFocused();
    const keyboard = useKeyboard(editor);

    const containerRef = useRef<HTMLDivElement>(null);

    const decorate = useCallback<(entry: NodeEntry<Node>) => Range[]>(
      ([node, path]) => {
        if (Text.isText(node) && !isFocused && selection !== null && Range.includes(selection, path)) {
          const selectionRange = { ...selection, selected: true };

          return [selectionRange];
        }

        return [];
      },
      [isFocused, selection]
    );

    const onBlur = useCallback<React.FocusEventHandler<HTMLDivElement>>((event) => {
      // Click on all focusable elements inside the editor will trigger a blur event.
      if (containerRef.current !== null && containerRef.current.contains(event.relatedTarget)) {
        event.preventDefault();
      }
    }, []);

    const renderLeafCallback = useCallback(
      (props: RenderLeafProps) => renderLeaf(props, focusedThreadId, selection !== null && Range.isExpanded(selection)),
      [selection, focusedThreadId]
    );

    return (
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
          onBlur={onBlur}
          data-is-focused={isFocused}
          className={className}
          spellCheck
        />
      </EditorContainer>
    );
  },
  (prevProps, nextProps) =>
    prevProps.showCommentsButton === nextProps.showCommentsButton &&
    prevProps.showAnnotationsButton === nextProps.showAnnotationsButton &&
    prevProps.showGodeFormuleringerButton === nextProps.showGodeFormuleringerButton &&
    prevProps.showPlaceholderButton === nextProps.showPlaceholderButton &&
    prevProps.className === nextProps.className &&
    prevProps.onKeyDown === nextProps.onKeyDown &&
    prevProps.focusedThreadId === nextProps.focusedThreadId &&
    prevProps.canEdit === nextProps.canEdit
);

RichTextEditorElement.displayName = 'RichTextEditorElement';
