import React from 'react';
import styled from 'styled-components';
import { IDocumentTitleElement } from '../../../../types/smart-editor';

interface Props {
  element: IDocumentTitleElement;
}

export const DocumentTitleElement = React.memo(
  ({ element }: Props) => <StyledTitle>{element.content}</StyledTitle>,
  (prevProps, nextProps) => prevProps.element.content === nextProps.element.content
);

DocumentTitleElement.displayName = 'DocumentTitleElement';

const StyledTitle = styled.h1`
  font-size: 26px;
  padding-left: 16px;
  margin-top: 16px;
  margin-bottom: 0;
`;
