import { styled } from 'styled-components';
import { Zoom } from '@app/plate/status-bar/zoom';

export const StatusBar = () => (
  <Container>
    <Zoom />
  </Container>
);

const Container = styled.div`
  width: 100%;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 8px;
  padding-right: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-left-radius: var(--a-border-radius-medium);
  border-bottom-right-radius: var(--a-border-radius-medium);
  background-color: var(--a-gray-200);
  border-top: 1px solid var(--a-border-default);
`;
