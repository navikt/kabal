import React from 'react';
import { Editor, Node, Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import { PlaceholderElementType } from '../types/editor-types';
import { RenderElementProps } from './render-props';

const isChromium = typeof window['chrome'] !== 'undefined';

export const PlaceholderElement = ({ element, children, attributes }: RenderElementProps<PlaceholderElementType>) => {
  const editor = useSlateStatic();
  const text = Node.string(element);

  const onClick = (e: React.MouseEvent) => {
    if (text.length === 0) {
      e.preventDefault();
      const path = ReactEditor.findPath(editor, element);
      Transforms.select(editor, { path: [...path, 0], offset: 0, selected: true });
    }
  };

  if (isChromium) {
    return (
      <Wrapper
        {...attributes}
        title={element.placeholder}
        $placeholder={element.placeholder}
        $focused={getIsFocused(editor, element)}
        $hasText={text.length !== 0}
        onClick={onClick}
      >
        <Anchor contentEditable={false} role="presentation">
          ${String.fromCodePoint(160)}
        </Anchor>
        {children}
        <Anchor contentEditable={false} role="presentation">
          ${String.fromCodePoint(160)}
        </Anchor>
      </Wrapper>
    );
  }

  return (
    <Wrapper
      {...attributes}
      title={element.placeholder}
      $placeholder={element.placeholder}
      $focused={getIsFocused(editor, element)}
      $hasText={text.length !== 0}
      onClick={onClick}
    >
      {children}
    </Wrapper>
  );
};

const getIsFocused = (editor: Editor, element: PlaceholderElementType): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const [node] = Editor.nodes(editor, { at: editor.selection, match: (n) => n === element });

  return node !== undefined;
};

interface WrapperProps {
  $placeholder: string;
  $focused: boolean;
  $hasText: boolean;
}

const Wrapper = styled.span<WrapperProps>`
  background-color: ${({ $focused, $hasText }) => getBackgroundColor($focused, $hasText)};
  border-radius: 4px;
  outline: none;

  ::after {
    cursor: text;
    color: var(--navds-semantic-color-text-muted);
    content: ${({ $hasText, $placeholder }) => ($hasText ? '""' : `"${$placeholder}"`)};
  }
`;

const getBackgroundColor = (focused: boolean, hasText: boolean) => {
  if (focused) {
    return 'var(--navds-global-color-blue-100)';
  }

  return hasText ? 'none' : 'var(--navds-global-color-gray-200)';
};

const Anchor = styled.span`
  font-size: 0;
`;
