import { Loader } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  text: string;
}

export const AppLoader = ({ text }: Props) => (
  <LoaderWrapper>
    <Content>
      <Loader size="2xlarge" variant="neutral" transparent title={text} />
      <span>{text}</span>
    </Content>
  </LoaderWrapper>
);

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #fafafa;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
