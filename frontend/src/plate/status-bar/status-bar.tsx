import { Scaling } from '@app/plate/status-bar/scaling';
import { styled } from 'styled-components';

interface Props {
  children?: React.ReactNode;
}

export const StatusBar = ({ children }: Props) => (
  <Container>
    <Scaling />
    {children}
  </Container>
);

const Container = styled.div`
  width: 100%;
  padding-top: var(--a-spacing-05);
  padding-bottom: var(--a-spacing-05);
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-left-radius: var(--a-border-radius-medium);
  border-bottom-right-radius: var(--a-border-radius-medium);
  background-color: var(--a-bg-subtle);
  border-top: 1px solid var(--a-border-default);
`;
