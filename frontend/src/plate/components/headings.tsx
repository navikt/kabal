import { PlateElement, PlateElementProps } from '@udecode/plate-common';
import React from 'react';
import { styled } from 'styled-components';
import { ptToEm } from '@app/plate/components/get-scaled-em';
import { EditorValue, H1Element, H2Element, H3Element } from '../types';

interface HeadingStyleProps {
  $isEmpty: boolean;
}

const HeadingOneStyle = styled.h1<HeadingStyleProps>`
  font-size: ${ptToEm(16)};
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0;

  &::before {
    position: absolute;
    content: '${({ $isEmpty }) => ($isEmpty ? 'Dokumenttittel / Overskrift 1' : '')}';
    color: var(--a-gray-500);
    cursor: text;
  }
`;

export const HeadingOne = ({ children, element, ...props }: PlateElementProps<EditorValue, H1Element>) => (
  <PlateElement asChild {...props} element={element}>
    <HeadingOneStyle $isEmpty={isEmpty(element)} style={{ marginLeft: ptToEm((element.indent ?? 0) * 24) }}>
      {children}
    </HeadingOneStyle>
  </PlateElement>
);

const HeadingTwoStyle = styled.h2<HeadingStyleProps>`
  font-size: ${ptToEm(14)};
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0;

  &::before {
    position: absolute;
    content: '${({ $isEmpty }) => ($isEmpty ? 'Overskrift 2' : '')}';
    color: var(--a-gray-500);
    cursor: text;
  }
`;

export const HeadingTwo = ({ children, element, ...props }: PlateElementProps<EditorValue, H2Element>) => (
  <PlateElement asChild {...props} element={element}>
    <HeadingTwoStyle $isEmpty={isEmpty(element)} style={{ marginLeft: ptToEm((element.indent ?? 0) * 24) }}>
      {children}
    </HeadingTwoStyle>
  </PlateElement>
);

const HeadingThreeStyle = styled.h3<HeadingStyleProps>`
  font-size: 1em;
  font-weight: 600;
  margin-top: 1em;
  margin-bottom: 0;

  &::before {
    position: absolute;
    content: '${({ $isEmpty }) => ($isEmpty ? 'Overskrift 3' : '')}';
    color: var(--a-gray-500);
    cursor: text;
  }
`;

export const HeadingThree = ({ children, element, ...props }: PlateElementProps<EditorValue, H3Element>) => (
  <PlateElement asChild {...props} element={element}>
    <HeadingThreeStyle $isEmpty={isEmpty(element)} style={{ marginLeft: ptToEm((element.indent ?? 0) * 24) }}>
      {children}
    </HeadingThreeStyle>
  </PlateElement>
);

const isEmpty = (element: H1Element | H2Element | H3Element) => {
  for (const child of element.children) {
    if (child.text.length !== 0) {
      return false;
    }
  }

  return true;
};
