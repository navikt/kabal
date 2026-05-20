import { TextApi } from 'platejs';
import { PlateElement, type PlateElementProps } from 'platejs/react';
import { indentInEm, pxToEm } from '@/plate/components/get-scaled-em';
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
        fontSize: pxToEm(11),
        lineHeight: pxToEm(16),
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
