import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Descendant, Node, NodeEntry, Range, Selection, Transforms, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { ReactEditor, RenderLeafProps, Slate, withReact } from 'slate-react';
import { IRichTextElement } from '../../../../types/smart-editor';
import { SmartEditorContext } from '../../context/smart-editor-context';
import {
  BulletListElementType,
  CustomTextType,
  ListItemContainerElementType,
  ListItemElementType,
  NumberedListElementType,
} from '../../editor-types';
import { renderElement } from '../../slate-elements';
import { EditorContainer, StyledEditable } from '../../styled-components';
import { EditorOppgavelinje } from '../../toolbar/toolbar';
import { renderLeaf } from './leaf/render';
import { useKeyboard } from './use-keyboard';
import { withNormalization } from './with-normalization';

interface RichTextElementProps {
  element: IRichTextElement;
  onChange: (value: Descendant[], element: IRichTextElement) => void;
}

export const RichTextEditorElement = React.memo(
  ({ onChange, element }: RichTextElementProps) => {
    const editor = useMemo(() => withHistory(withNormalization(withReact(createEditor()))), []);
    const keyboard = useKeyboard(editor);
    const [isFocused, setIsFocused] = useState<boolean>(ReactEditor.isFocused(editor));
    const { focusedThreadIds, setElementId, setEditor, setSelection } = useContext(SmartEditorContext);

    const savedSelection = useRef<Selection>(editor.selection);

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

    const onFocus = useCallback<React.FocusEventHandler<HTMLDivElement>>(
      (event) => {
        setIsFocused(true);
        setEditor(editor);
        setElementId(element.id);

        if (
          editor.selection === null &&
          savedSelection.current !== null &&
          Range.isExpanded(savedSelection.current) &&
          ReactEditor.hasRange(editor, savedSelection.current)
        ) {
          event.preventDefault();
          Transforms.select(editor, savedSelection.current);
          ReactEditor.focus(editor);
        }
      },
      [editor, element.id, setElementId, setEditor]
    );

    const onBlur = useCallback(() => {
      setIsFocused(false);
      savedSelection.current = editor.selection;
    }, [editor, savedSelection, setIsFocused]);

    const renderLeafCallback = useCallback(
      (props: RenderLeafProps) => renderLeaf(props, focusedThreadIds),
      [focusedThreadIds]
    );

    return (
      <Slate
        editor={editor}
        value={element.content}
        onChange={(value) => {
          onChange(value, element);

          savedSelection.current = editor.selection;
          setSelection(savedSelection.current);
        }}
      >
        <EditorContainer>
          <EditorOppgavelinje visible={isFocused} />
          <StyledEditable
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
  (prevProps, nextProps) => {
    if (
      prevProps.element.id !== nextProps.element.id ||
      prevProps.element.content.length !== nextProps.element.content.length
    ) {
      return false;
    }

    return prevProps.element.content.every((p, i) => {
      const n = nextProps.element.content[i];

      if (p === n) {
        return true;
      }

      const { type, children } = p;

      if (type !== n.type) {
        return false;
      }

      if (typeof children === 'undefined' || typeof children === 'boolean' || typeof children === 'string') {
        return children === n.children;
      }

      const nChildren = n.children as typeof children;

      if (children.length !== nChildren.length) {
        return false;
      }

      const childList: (
        | BulletListElementType
        | NumberedListElementType
        | ListItemElementType
        | ListItemContainerElementType
        | CustomTextType
      )[] = children;

      return childList.every((c, ii) => c === nChildren[ii]);
    });
  }
);

RichTextEditorElement.displayName = 'RichTextEditorElement';
