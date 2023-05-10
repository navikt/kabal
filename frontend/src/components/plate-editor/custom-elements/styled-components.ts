import styled from 'styled-components';

export const SideButtons = styled.div`
  position: absolute;
  left: -36pt;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  display: flex;
  flex-direction: column;

  :focus {
    opacity: 1;
  }
`;

export const MaltekstContainer = styled.div`
  display: inherit;
  flex-direction: inherit;
  row-gap: inherit;
  position: relative;
  color: #333;

  ::before {
    content: '';
    position: absolute;
    left: -12pt;
    width: 6pt;
    height: 0;
    top: 0;
    background-color: var(--a-bg-subtle);
    transition: height 0.4s ease-in-out;
  }

  :hover {
    ${SideButtons} {
      opacity: 1;
    }

    ::before {
      height: 100%;
    }
  }
`;
