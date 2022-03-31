import { Hovedknapp } from 'nav-frontend-knapper';
import styled from 'styled-components';

export const StyledNewCommentInThread = styled.div`
  border-radius: 4px;
`;

export const StyledNewComment = styled.div`
  position: absolute;
  top: 0;
  left: 24px;
  width: calc(100% - 48px);
  background-color: white;
  z-index: 5;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 24px;
  margin-bottom: 40px;
  border-radius: 4px;
  border: 1px solid #c9c9c9;
`;

export const StyledCommentButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 1em;
  margin-right: 20px;
  width: 100%;
`;

export const StyledCommentButton = styled(Hovedknapp)`
  margin-right: 10px;
`;
