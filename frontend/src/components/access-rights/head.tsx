import { Label } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { SaksbehandlerAccessRights } from '@app/redux-api/access-rights';

interface Props {
  saksbehandlere: SaksbehandlerAccessRights[];
  focusedCell: [number, number];
  setFocusedCell: (cell: [number, number]) => void;
}

export const Head = ({ saksbehandlere, setFocusedCell, focusedCell: [focusedColumn] }: Props) => (
  <Thead>
    <tr>
      <StyledHeader>Ytelse</StyledHeader>
      <AngledHeader
        grey={false}
        first
        focused={focusedColumn === 0}
        zIndex={saksbehandlere.length}
        text={`Alle saksbehandlere (${saksbehandlere.length})`}
        onMouseEnter={() => setFocusedCell([0, -1])}
      />
      {saksbehandlere.map(({ saksbehandlerName, saksbehandlerIdent, ytelseIdList }, i) => (
        <AngledHeader
          key={saksbehandlerIdent}
          grey={i % 2 === 0}
          focused={focusedColumn === i + 1}
          zIndex={saksbehandlere.length - 1 - i}
          text={`${saksbehandlerName} (${ytelseIdList.length}) (${saksbehandlerIdent})`}
          onMouseEnter={() => setFocusedCell([i + 1, -1])}
        />
      ))}
    </tr>
  </Thead>
);

interface AngledHeaderProps {
  text: string;
  grey: boolean;
  first?: boolean;
  focused: boolean;
  zIndex: number;
  onMouseEnter: () => void;
}

const AngledHeader = ({ text, grey, focused, zIndex, onMouseEnter, first = false }: AngledHeaderProps) => (
  <StyledAngledHeader
    $grey={grey}
    $first={first}
    $focused={focused}
    $zIndex={zIndex}
    title={text}
    onMouseEnter={onMouseEnter}
  >
    <AngledHeaderDiv>{text}</AngledHeaderDiv>
  </StyledAngledHeader>
);

const Thead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: white;

  box-shadow: var(--a-border-on-inverted) 0 1px 0 0, black 0px 5px 5px -5px;
`;

const NON_ANGLED_HEADER_HEIGHT = 32;
const ANGLED_HEADER_WIDTH = 256;
const ANGLED_HEADER_HEIGHT = Math.ceil(Math.sqrt(2 * NON_ANGLED_HEADER_HEIGHT ** 2) / 2);
const CONTAINER_WIDTH = NON_ANGLED_HEADER_HEIGHT;
const CONTAINER_HEIGHT = Math.sqrt(ANGLED_HEADER_WIDTH ** 2 / 2);

const StyledHeader = styled.th`
  padding-left: 8px;
  vertical-align: bottom;
  text-align: left;
`;

const getBackgroundColor = (props: StyledAngledHeaderDivProps) => {
  if (props.$focused) {
    return 'var(--a-blue-200)';
  }

  if (props.$grey) {
    return 'rgb(247, 247, 247)';
  }

  return 'white';
};

interface StyledAngledHeaderDivProps {
  $grey: boolean;
  $first: boolean;
  $focused: boolean;
  $zIndex?: number;
}

const StyledAngledHeader = styled(StyledHeader)<StyledAngledHeaderDivProps>`
  white-space: nowrap;

  transform-origin: bottom left;
  position: relative;

  transform: skew(-45deg);
  border-right: 1px solid var(--a-border-on-inverted);
  border-left: ${({ $first }) => ($first ? '1px solid var(--a-border-on-inverted)' : 'none')};

  height: ${CONTAINER_HEIGHT}px;
  background-color: ${getBackgroundColor};
`;

const AngledHeaderDiv = styled(Label)`
  padding-right: 12px;
  width: ${ANGLED_HEADER_WIDTH}px;
  height: ${ANGLED_HEADER_HEIGHT}px;

  overflow: hidden;
  text-overflow: ellipsis;

  position: absolute;
  bottom: 0;
  left: ${CONTAINER_WIDTH}px;

  transform-origin: bottom left;
  transform: skew(45deg) rotate(-45deg);

  text-align: left;
`;
