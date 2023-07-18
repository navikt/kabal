import { styled } from 'styled-components';

export const StyledDocumentLink = styled.a<{ $isActive: boolean; $disabled?: boolean }>`
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: ${({ $disabled }) => ($disabled === true ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled === true ? 0.5 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled === true ? 'none' : 'auto')};
  text-shadow: ${({ $isActive }) => ($isActive ? '0 0 1px #262626' : 'none')};
  border: none;
  padding: 0;
  font-size: inherit;
  background-color: transparent;
  padding-top: 0;
  padding-bottom: 0;
  line-height: 1.25;
  font-size: 1em;
  overflow: hidden;
  text-align: left;
  text-decoration: none;
  color: var(--a-text-action);
  height: 100%;
  user-select: text;

  &:hover {
    color: #262626;
  }

  &:visited {
    color: var(--a-text-visited);
  }
`;

export const EllipsisTitle = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;
