import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Descendant, Node, NodeEntry, Range, Selection, Transforms, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { ReactEditor, RenderLeafProps, Slate, withReact } from 'slate-react';
import { IRichTextElement } from '../../../../redux-api/smart-editor-types';
import { SmartEditorContext } from '../../context/smart-editor-context';
import { renderElement } from '../../slate-elements';
import { EditorContainer, StyledEditable } from '../../styled-components';
import { EditorOppgavelinje } from '../../toolbar/toolbar';
import { renderLeaf } from './leaf/render';
import { useKeyboard } from './use-keyboard';
import { withNormalization } from './with-normalization';

interface RichTextElementProps extends Pick<IRichTextElement, 'content'> {
  elementId: string;
  onChange: (value: Descendant[]) => void;
}

export const RichTextEditorElement = React.memo(
  ({ content, onChange, elementId }: RichTextElementProps) => {
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
        if (!isFocused) {
          setIsFocused(true);
          setEditor(editor);
          setElementId(elementId);

          if (editor.selection === null && savedSelection.current !== null) {
            event.preventDefault();
            Transforms.select(editor, savedSelection.current);
            ReactEditor.focus(editor);
          }
        }
      },
      [editor, isFocused, savedSelection, elementId, setElementId, setEditor]
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
        value={content}
        onChange={(value) => {
          onChange(value);

          savedSelection.current = editor.selection;
          setSelection(savedSelection.current);
        }}
      >
        <EditorContainer>
          <EditorOppgavelinje />
          <StyledEditable
            renderElement={renderElement}
            renderLeaf={renderLeafCallback}
            decorate={decorate}
            onKeyDown={keyboard}
            onFocus={onFocus}
            onBlur={onBlur}
            theme={{
              isFocused,
            }}
          />
        </EditorContainer>
      </Slate>
    );
  },
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps)
);

RichTextEditorElement.displayName = 'RichTextEditorElement';
