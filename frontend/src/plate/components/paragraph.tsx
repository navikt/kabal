import { PlateElement, PlateElementProps, isText } from '@udecode/plate-common';
import { ElementRef, forwardRef } from 'react';
import { styled } from 'styled-components';
import { ptToEm } from '@app/plate/components/get-scaled-em';
import { EditorValue, ParagraphElement, PlaceholderElement } from '@app/plate/types';

type RenderProps = PlateElementProps<EditorValue, ParagraphElement>;

export const Paragraph = forwardRef<ElementRef<typeof PlateElement>, RenderProps>(
  ({ children, element, ...props }, ref) => {
    const indent = ptToEm((element.indent ?? 0) * 24);

    return (
      <PlateElement asChild ref={ref} element={element} {...props}>
        <StyledParagraph
          style={{
            marginLeft: element.align !== 'right' ? indent : undefined,
            marginRight: element.align === 'right' ? indent : undefined,
            textAlign: element.align,
          }}
          $isEmpty={isEmpty(element)}
        >
          {children}
        </StyledParagraph>
      </PlateElement>
    );
  },
);

Paragraph.displayName = 'Paragraph';

export const StyledParagraph = styled.p<{ $isEmpty: boolean }>`
  font-size: 1em;
  white-space: pre-wrap;
  margin-top: 1em;
  margin-bottom: 0;

  &::before {
    position: absolute;
    content: '${({ $isEmpty }) => ($isEmpty ? 'Avsnitt' : '')}';
    color: var(--a-gray-500);
    cursor: text;
  }
`;

const isEmpty = (element: ParagraphElement | PlaceholderElement) => {
  for (const child of element.children) {
    if (isText(child)) {
      if (child.text.length !== 0) {
        return false;
      }
    } else {
      // Placeholder counts as not empty.
      return false;
    }
  }

  return true;
};
