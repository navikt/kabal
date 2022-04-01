import { Close, ExternalLink, ZoomIn, ZoomOut } from '@navikt/ds-icons';
import styled, { css } from 'styled-components';

interface BeholderProps {
  width: number;
}

export const Container = styled.section<BeholderProps>`
  display: flex;
  flex-direction: column;
  min-width: ${(props) => props.width}px;
  margin: 0.25em 0.5em;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  height: 100%;
  scroll-snap-align: start;
`;

export const StyledDocumentTitleContainer = styled.div`
  height: 100%;
  white-space: nowrap;
`;
export const StyledDocumentTitle = styled.div`
  font-size: 1em;
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledButtonContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

export const StyledHeaderButton = styled.button<{ rightSide: boolean }>`
  border: none;
  background-color: transparent;
  padding: 0;
  margin-right: ${(props) => (!props.rightSide ? '15px' : '')};
  cursor: pointer;
`;

export const StyledHeaderLink = styled.a`
  border: none;
  background-color: transparent;
  padding: 0;
  margin-right: 15px;
  cursor: pointer;
`;

export const PDF = styled.object`
  width: 100%;
  flex-grow: 1;
`;

export const Header = styled.div`
  background: #cde7d8;
  display: flex;
  position: relative;
  padding: 8px;
  z-index: 1;
  justify-content: space-between;
`;

export const LeftSide = styled.div``;
export const RightSide = styled.div``;

const iconStyle = css`
  & {
    color: black;
    cursor: pointer;
    -webkit-transition: all 0.15s ease-in-out;
    transition: all 0.15s ease-in-out;
    width: 12px;
    height: 12px;

    :hover {
      transform: scale(1.1);
    }
  }
`;

export const StyledZoomInIcon = styled(ZoomIn)`
  ${iconStyle}
`;

export const StyledZoomOutIcon = styled(ZoomOut)`
  ${iconStyle}
`;

export const StyledCancelIcon = styled(Close)`
  ${iconStyle}
`;

export const StyledExtLinkIcon = styled(ExternalLink)`
  ${iconStyle}
`;
