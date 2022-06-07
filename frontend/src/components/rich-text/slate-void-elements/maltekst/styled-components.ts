import styled from 'styled-components';
import { voidStyle } from '../style';

interface MaltekstContainerProps {
  isActive: boolean;
  showTags: boolean;
}

const getColor = ({ isActive, showTags }: MaltekstContainerProps) => {
  if (showTags && !isActive) {
    return '#e9f1fc';
  }

  return 'transparent';
};

export const MaltekstContainer = styled.div<MaltekstContainerProps>`
  position: relative;
  ${voidStyle};
  border-radius: 2px;
  transition-property: background-color, outline-color;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  background-color: ${getColor};
  outline-color: ${getColor};
  outline-style: solid;
  outline-width: 8px;
`;

export const ReloadButton = styled.button`
  position: sticky;
  top: 24px;
  background-color: transparent;
  height: fit-content;
  cursor: pointer;
  padding: 0;
  margin: 0;
  border: none;
`;

export const ReloadButtonWrapper = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  left: 100%;
  height: 100%;
  padding-left: 12px;
`;
