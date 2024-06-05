import { Heading } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  title: string;
  children: React.ReactNode;
  attrs?: {
    [key: string]: string;
  };
}

export const InfoToast = ({ title, children, attrs }: Props) => (
  <Wrapper {...attrs}>
    <Heading level="1" size="xsmall">
      {title}
    </Heading>
    {children}
  </Wrapper>
);

const Wrapper = styled.div`
  white-space: normal;
  word-break: break-word;
`;
