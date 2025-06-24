import { ptToEm } from '@app/plate/components/get-scaled-em';
import { ElementApi } from 'platejs';
import { PlateElement, type PlateElementProps } from 'platejs/react';
import type { H1Element, H2Element, H3Element, PlaceholderElement } from '../types';

const CLASSNAMES =
  'font-semibold mt-4 mb-0 before:absolute before:text-gray-500 before:cursor-text before:content-[attr(data-placeholder)] ';

export const HeadingOne = ({ children, element, ...props }: PlateElementProps<H1Element>) => (
  <PlateElement
    {...props}
    element={element}
    as="h1"
    style={{ fontSize: ptToEm(16), marginTop: '1em', marginLeft: ptToEm((element.indent ?? 0) * 24) }}
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
    style={{ fontSize: ptToEm(14), marginLeft: ptToEm((element.indent ?? 0) * 24) }}
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
    style={{ fontSize: ptToEm(12), marginLeft: ptToEm((element.indent ?? 0) * 24) }}
    className={CLASSNAMES}
    attributes={{ ...props.attributes, 'data-placeholder': isEmpty(element) ? 'Overskrift 3' : '' }}
  >
    {children}
  </PlateElement>
);

const isEmpty = (element: H1Element | H2Element | H3Element | PlaceholderElement): boolean => {
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
