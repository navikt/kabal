import React from 'react';
import styled from 'styled-components';
import { ITextElement } from '../../../../types/smart-editor';

interface Props {
  element: ITextElement;
  onChange: (value: string, element: ITextElement) => void;
}

export const TextElement = React.memo(
  ({ element, onChange }: Props) => (
    <ElementLabel>
      {element.label}
      <input type="text" value={element.content} onChange={({ target }) => onChange(target.value, element)} />
    </ElementLabel>
  ),
  (prevProps, nextProps) =>
    prevProps.element.id === nextProps.element.id &&
    prevProps.element.type === nextProps.element.type &&
    prevProps.element.label === nextProps.element.label &&
    prevProps.element.content === nextProps.element.content
);

TextElement.displayName = 'TextElement';

const ElementLabel = styled.label`
  display: block;
  margin-bottom: 10em;

  &:last-child {
    margin-bottom: 0;
  }
`;
