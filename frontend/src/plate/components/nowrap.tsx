import { Tooltip } from '@navikt/ds-react';
import { PlateElement, PlateElementProps } from '@udecode/plate-common';
import { styled } from 'styled-components';
import { EditorValue, NowrapElement } from '../types';

export const Nowrap = ({ children, element, ...props }: PlateElementProps<EditorValue, NowrapElement>) => (
  <Tooltip content="Linjeskift forhindret">
    <PlateElement as={NowrapStyle} {...props} element={element}>
      {children}
    </PlateElement>
  </Tooltip>
);

const NowrapStyle = styled.span`
  white-space: pre;
  background-color: rgba(99, 70, 137, 0.2);
  border-radius: 4px;
`;
