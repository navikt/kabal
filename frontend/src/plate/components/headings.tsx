import { ElementApi } from 'platejs';
import { PlateElement, type PlateElementProps } from 'platejs/react';
import { indentInEm, ptToEm } from '@/plate/components/get-scaled-em';
import type { H1Element, H2Element, H3Element, H4Element, PlaceholderElement } from '@/plate/types';

const CLASSNAMES =
  'font-bold mb-0 before:absolute before:text-ax-neutral-600 before:cursor-text before:content-[attr(data-placeholder)] ';

const H1_FONT_SIZE_PT = 16;
const H2_FONT_SIZE_PT = 13;
const H3_FONT_SIZE_PT = 12;
const H4_FONT_SIZE_PT = 11;

export const HeadingOne = ({ children, element, ...props }: PlateElementProps<H1Element>) => (
  <PlateElement
    {...props}
    element={element}
    as="h1"
    style={{
      fontSize: ptToEm(H1_FONT_SIZE_PT),
      lineHeight: ptToEm(20, H1_FONT_SIZE_PT),
      letterSpacing: ptToEm(0.3, H1_FONT_SIZE_PT),
      marginBottom: ptToEm(26, H1_FONT_SIZE_PT),
      marginLeft: indentInEm(element.indent, H1_FONT_SIZE_PT),
    }}
    className={CLASSNAMES}
    attributes={{ ...props.attributes, 'data-placeholder': isEmpty(element) ? 'Dokumenttittel / Overskrift 1' : '' }}
  >
    {children}
  </PlateElement>
);

export const HeadingTwo = ({ children, element, ...props }: PlateElementProps<H2Element>) => (
  <PlateElement
    {...props}
    element={element}
    as="h2"
    style={{
      fontSize: ptToEm(H2_FONT_SIZE_PT),
      lineHeight: ptToEm(16, H2_FONT_SIZE_PT),
      letterSpacing: ptToEm(0.25, H2_FONT_SIZE_PT),
      marginTop: ptToEm(26, H2_FONT_SIZE_PT),
      marginBottom: '1em',
      marginLeft: indentInEm(element.indent, H2_FONT_SIZE_PT),
    }}
    className={CLASSNAMES}
    attributes={{ ...props.attributes, 'data-placeholder': isEmpty(element) ? 'Overskrift 2' : '' }}
  >
    {children}
  </PlateElement>
);

export const HeadingThree = ({ children, element, ...props }: PlateElementProps<H3Element>) => (
  <PlateElement
    {...props}
    element={element}
    as="h3"
    style={{
      fontSize: ptToEm(H3_FONT_SIZE_PT),
      lineHeight: ptToEm(16, H3_FONT_SIZE_PT),
      letterSpacing: ptToEm(0.2, H3_FONT_SIZE_PT),
      marginTop: ptToEm(26, H3_FONT_SIZE_PT),
      marginBottom: '1em',
      marginLeft: indentInEm(element.indent, H3_FONT_SIZE_PT),
    }}
    className={CLASSNAMES}
    attributes={{ ...props.attributes, 'data-placeholder': isEmpty(element) ? 'Overskrift 3' : '' }}
  >
    {children}
  </PlateElement>
);

export const HeadingFour = ({ children, element, ...props }: PlateElementProps<H4Element>) => (
  <PlateElement
    {...props}
    element={element}
    as="h4"
    style={{
      fontSize: ptToEm(H4_FONT_SIZE_PT),
      lineHeight: ptToEm(16, H4_FONT_SIZE_PT),
      letterSpacing: ptToEm(0.1, H4_FONT_SIZE_PT),
      marginTop: ptToEm(26, H4_FONT_SIZE_PT),
      marginBottom: '1em',
      marginLeft: indentInEm(element.indent, H4_FONT_SIZE_PT),
    }}
    className={CLASSNAMES}
    attributes={{ ...props.attributes, 'data-placeholder': isEmpty(element) ? 'Overskrift 4' : '' }}
  >
    {children}
  </PlateElement>
);

const isEmpty = (element: H1Element | H2Element | H3Element | H4Element | PlaceholderElement): boolean => {
  for (const child of element.children) {
    if (ElementApi.isElement(child)) {
      return false;
    }

    if (child.text.length > 0) {
      return false;
    }
  }

  return true;
};
