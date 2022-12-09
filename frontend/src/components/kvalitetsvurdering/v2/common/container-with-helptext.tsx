import { HelpText, HelpTextProps } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  helpText: string;
  placement?: HelpTextProps['placement'];
}

export const ContainerWithHelpText = ({ children, helpText, placement = 'right' }: Props) => (
  <Container>
    {children}
    <HelpText placement={placement}>{helpText}</HelpText>
  </Container>
);

const Container = styled.span`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;
