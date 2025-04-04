import type { SaksbehandlerAccessRights } from '@app/redux-api/access-rights';
import { Label } from '@navikt/ds-react';

interface Props {
  saksbehandlere: SaksbehandlerAccessRights[];
  focusedCell: [number, number];
  setFocusedCell: (cell: [number, number]) => void;
}

const SHADOW_STYLE: React.CSSProperties = {
  boxShadow: 'var(--a-border-on-inverted) 0 1px 0 0, black 0px 5px 5px -5px',
};

const ANGLED_TH_CLASSES =
  'origin-bottom-left pl-2 text-left align-text-bottom whitespace-nowrap relative border-r-1 border-border-on-inverted';
const ANGLED_DIV_CLASSES = 'pr-3 overflow-hidden text-ellipsis absolute bottom-0 text-left origin-bottom-left';

const NON_ANGLED_HEADER_HEIGHT = 32;
const ANGLED_HEADER_WIDTH = 256;
const ANGLED_HEADER_HEIGHT = Math.ceil(Math.sqrt(2 * NON_ANGLED_HEADER_HEIGHT ** 2) / 2);
const CONTAINER_WIDTH = NON_ANGLED_HEADER_HEIGHT;
const CONTAINER_HEIGHT = Math.sqrt(ANGLED_HEADER_WIDTH ** 2 / 2);

export const Head = ({ saksbehandlere, setFocusedCell, focusedCell: [focusedColumn] }: Props) => (
  <thead className="sticky top-0 z-2 bg-bg-default" style={SHADOW_STYLE}>
    <tr>
      <th className="sticky top-0 z-2 bg-bg-default">Ytelse</th>
      <th
        className={`${ANGLED_TH_CLASSES} ${focusedColumn === 0 ? 'bg-blue-200' : 'odd:bg-bg-subtle'}`}
        style={{ height: CONTAINER_HEIGHT, transform: 'skew(-45deg)' }}
        onMouseEnter={() => setFocusedCell([0, -1])}
      >
        <Label
          className={ANGLED_DIV_CLASSES}
          style={{
            width: ANGLED_HEADER_WIDTH,
            height: ANGLED_HEADER_HEIGHT,
            left: CONTAINER_WIDTH,
            transform: 'skew(45deg) rotate(-45deg)',
          }}
        >
          Alle saksbehandlere ({saksbehandlere.length})
        </Label>
      </th>
      {saksbehandlere.map(({ saksbehandlerName, saksbehandlerIdent, ytelseIdList }, i) => (
        <th
          className={`${ANGLED_TH_CLASSES} ${focusedColumn === i + 1 ? 'bg-blue-200' : 'odd:bg-bg-subtle'}`}
          style={{ height: CONTAINER_HEIGHT, transform: 'skew(-45deg)' }}
          key={saksbehandlerIdent}
          onMouseEnter={() => setFocusedCell([i + 1, -1])}
        >
          <Label
            className={ANGLED_DIV_CLASSES}
            style={{
              width: ANGLED_HEADER_WIDTH,
              height: ANGLED_HEADER_HEIGHT,
              left: CONTAINER_WIDTH,
              transform: 'skew(45deg) rotate(-45deg)',
            }}
          >
            {saksbehandlerName} ({ytelseIdList.length}) ({saksbehandlerIdent})
          </Label>
        </th>
      ))}
    </tr>
  </thead>
);
