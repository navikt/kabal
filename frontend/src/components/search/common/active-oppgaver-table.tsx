import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import React from 'react';
import { IOppgave, IOppgaveList } from '../../../types/oppgaver';
import { Deadline } from '../../common-table-components/deadline';
import { Hjemmel } from '../../common-table-components/hjemmel';
import { OpenOppgavebehandling } from '../../common-table-components/open';
import { SaksbehandlerButton } from '../../common-table-components/saksbehandler-button';
import { Ytelse } from '../../common-table-components/ytelse';
import { Type } from '../../type/type';
import { RightAlignCell, StyledTable } from './styled-components';
import { StyledTableCaption } from './table-caption';

interface Props {
  activeOppgaver: IOppgaveList;
}

export const ActiveOppgaverTable = ({ activeOppgaver }: Props) => {
  if (activeOppgaver.length === 0) {
    return <AlertStripeInfo>Ingen aktive oppgaver</AlertStripeInfo>;
  }

  return (
    <StyledTable className="tabell tabell--stripet" data-testid="search-result-active-oppgaver">
      <StyledTableCaption>Aktive oppgaver</StyledTableCaption>
      <thead>
        <tr>
          <th>Type</th>
          <th>Ytelse</th>
          <th>Hjemmel</th>
          <th>Frist</th>
          <th>Saksbehandler</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {activeOppgaver.map((k) => (
          <Row key={k.id} {...k} />
        ))}
      </tbody>
    </StyledTable>
  );
};

const Row = ({
  id,
  type,
  ytelse,
  hjemmel,
  frist,
  ageKA,
  tildeltSaksbehandlerident,
  tildeltSaksbehandlerNavn,
  isAvsluttetAvSaksbehandler,
}: IOppgave) => (
  <tr data-testid="search-result-active-oppgave">
    <td>
      <Type type={type} />
    </td>
    <td>
      <Ytelse ytelseId={ytelse} />
    </td>
    <td>
      <Hjemmel hjemmel={hjemmel} />
    </td>
    <td>
      <Deadline age={ageKA} frist={frist} />
    </td>
    <td>
      <SaksbehandlerButton
        tildeltSaksbehandlerident={tildeltSaksbehandlerident}
        name={tildeltSaksbehandlerNavn}
        klagebehandlingId={id}
        ytelse={ytelse}
        isAvsluttetAvSaksbehandler={isAvsluttetAvSaksbehandler}
      />
    </td>
    <td></td>
    <RightAlignCell>
      <OpenOppgavebehandling oppgavebehandlingId={id} ytelse={ytelse} type={type} />
    </RightAlignCell>
  </tr>
);
