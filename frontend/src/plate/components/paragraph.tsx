import { TextApi } from 'platejs';
import { PlateElement, type PlateElementProps } from 'platejs/react';
import { FONT_SIZE_PT, indentInEm, LINE_HEIGHT_PT, ptToEm } from '@/plate/components/get-scaled-em';
import type { ParagraphElement, PlaceholderElement } from '@/plate/types';

type RenderProps = PlateElementProps<ParagraphElement>;

export const Paragraph = (props: RenderProps) => {
  const { children, element } = props;
  const indent = indentInEm(element.indent);

  return (
    <PlateElement
      {...props}
      as="p"
      style={{
        marginLeft: element.align !== 'right' ? indent : undefined,
        marginRight: element.align === 'right' ? indent : undefined,
        textAlign: element.align,
        fontSize: ptToEm(FONT_SIZE_PT),
        lineHeight: ptToEm(LINE_HEIGHT_PT),
        marginBottom: '1em',
      }}
      className="mb-0 whitespace-pre-wrap before:absolute before:cursor-text before:text-ax-text-neutral-decoration before:content-[attr(data-placeholder)]"
      attributes={{ ...props.attributes, 'data-placeholder': isEmpty(element) ? 'Avsnitt' : '' }}
    >
      {children}
    </PlateElement>
  );
};

const isEmpty = (element: ParagraphElement | PlaceholderElement) => {
  for (const child of element.children) {
    if (TextApi.isText(child)) {
      if (child.text.length > 0) {
        return false;
      }
    } else {
      // Placeholder counts as not empty.
      return false;
    }
  }

  return true;
};
