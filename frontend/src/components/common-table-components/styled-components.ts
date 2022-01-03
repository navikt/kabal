import { AlertStripeSuksess } from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';

export const SuccessStatus = styled(AlertStripeSuksess)`
  padding-top: 7px;
  padding-bottom: 7px;
  padding-left: 0.5em;
  padding-right: 0.5em;
  height: 2.5em;
`;

export const TildelDropdownButton = styled.button`
  width: 100%;
  user-select: none;
  cursor: pointer;

  ::before,
  ::after {
    content: '';
    position: absolute;
    width: 12px;
    border-radius: 2px;
    height: 2px;
    background: #0067c5;
    right: 24px;
    top: 50%;
    transition: transform 0.1s ease;
  }

  ::before {
    transform: ${({ open }: { open: boolean }) =>
      open ? 'translateX(-31%) translateY(-50%) rotate(-45deg)' : 'translateX(-31%) translateY(-50%) rotate(45deg)'};
  }

  ::after {
    transform: ${({ open }: { open: boolean }) =>
      open ? 'translateX(31%) translateY(-50%) rotate(45deg)' : 'translateX(31%) translateY(-50%) rotate(-45deg)'};
  }

  :hover {
    ::before,
    ::after {
      background: #fff;
    }
  }
`;

export const DropdownOption = styled.button`
  display: block;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
  margin: 0;
  background-color: transparent;
  border: none;
  font-size: 16px;
  white-space: nowrap;
  line-height: 1.5;
  width: 100%;
  text-align: left;
  cursor: pointer;

  :hover {
    background-color: #0067c5;
    color: white;
  }
`;

export const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const Dropdown = styled.ul`
  position: absolute;
  list-style: none;
  top: 100%;
  right: 0;
  z-index: 1;
  background-color: white;
  border: none;
  border-radius: 4px;
  padding: 0;
  margin: 0;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
`;

export const StyledButton = styled(Knapp)`
  width: 100%;
`;
