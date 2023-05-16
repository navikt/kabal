import React from 'react';
import { Editor, Node, Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import { isGenericObject } from '@app/types/types';
import { PlaceholderElementType } from '../types/editor-types';
import { RenderElementProps } from './render-props';

const isChromium = isGenericObject(window) && typeof window['chrome'] !== 'undefined';

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
          {String.fromCodePoint(160)}
        </Anchor>
        {children}
        <Anchor contentEditable={false} role="presentation">
          {String.fromCodePoint(160)}
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
  background-color: ${({ $focused }) => getBackgroundColor($focused)};
  border-radius: 4px;
  outline: none;
  color: #000;

  ::after {
    cursor: text;
    color: var(--a-text-subtle);
    content: ${({ $hasText, $placeholder }) => ($hasText ? '""' : `"${$placeholder}"`)};
  }
`;

const getBackgroundColor = (focused: boolean) => (focused ? 'var(--a-blue-100)' : 'var(--a-gray-200)');

const Anchor = styled.span`
  font-size: 0;
`;