import { HelpText, type HelpTextProps } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  children: React.ReactNode;
  helpText: string | undefined;
  placement?: HelpTextProps['placement'];
}

export const ContainerWithHelpText = ({ children, helpText, placement = 'right' }: Props) => (
  <Container>
    {children}
    {helpText !== undefined ? <HelpText placement={placement}>{helpText}</HelpText> : null}
  </Container>
);

const Container = styled.span`
  display: flex;
  flex-direction: row;
  gap: var(--a-spacing-2);
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;
