import styled, { css } from 'styled-components';
import { CancelIcon } from '../../icons/cancelblack';
import { ExtLinkIcon } from '../../icons/extlink';
import { ZoomInIcon } from '../../icons/zoom-in';
import { ZoomOutIcon } from '../../icons/zoom-out';

interface BeholderProps {
  width: number;
}

export const Container = styled.section<BeholderProps>`
  display: block;
  min-width: ${(props) => props.width}px;
  margin: 0.25em 0.5em;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  height: 100%;
`;

export const StyledDocumentTitle = styled.h1`
  font-size: 1em;
  margin: 0;
  padding: 0;
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledHeaderButton = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
  margin-right: 15px;
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
  height: calc(100% - 3.5em);
`;

export const Header = styled.div`
  background: #cde7d8;
  display: flex;
  position: sticky;
  top: 0;
  padding: 1em 0 1em 0.5em;
  z-index: 1;
  justify-content: space-between;
  height: 3.5em;
`;

const iconStyle = css`
  & {
    color: black;
    cursor: pointer;
    margin: 0.25em 1em 0 0.2em;
    -webkit-transition: all 0.15s ease-in-out;
    transition: all 0.15s ease-in-out;
    width: 1rem;
    height: 1rem;

    :hover {
      transform: scale(1.1);
    }
  }
`;

export const StyledZoomInIcon = styled(ZoomInIcon)`
  ${iconStyle}
`;

export const StyledZoomOutIcon = styled(ZoomOutIcon)`
  ${iconStyle}
`;

export const StyledCancelIcon = styled(CancelIcon)`
  ${iconStyle}
`;

export const StyledExtLinkIcon = styled(ExtLinkIcon)`
  ${iconStyle}/* cursor: pointer;
  color: #0067c5;
  margin: 0.25em 1em 0 0.2em;
  -webkit-transition: all 0.15s ease-in-out;
  transition: all 0.15s ease-in-out;
  &:hover {
    transform: scale(1.1);
  } */
`;
