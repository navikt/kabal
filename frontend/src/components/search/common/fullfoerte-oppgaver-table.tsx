import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import React from 'react';
import { isoDateToPretty } from '../../../domain/date';
import { IOppgave, IOppgaveList } from '../../../types/oppgaver';
import { Hjemmel } from '../../common-table-components/hjemmel';
import { OpenOppgavebehandling } from '../../common-table-components/open';
import { Ytelse } from '../../common-table-components/ytelse';
import { Type } from '../../type/type';
import { RightAlignCell, StyledTable } from './styled-components';
import { StyledTableCaption } from './table-caption';

interface Props {
  finishedOppgaver: IOppgaveList;
}

export const FullfoerteOppgaverTable = ({ finishedOppgaver }: Props) => {
  if (finishedOppgaver.length === 0) {
    return <AlertStripeInfo>Ingen fullførte oppgaver siste 12 måneder</AlertStripeInfo>;
  }

  return (
    <StyledTable className="tabell tabell--stripet" data-testid="search-result-fullfoerte-oppgaver">
      <StyledTableCaption>Fullførte oppgaver siste 12 måneder</StyledTableCaption>
      <thead>
        <tr>
          <th>Type</th>
          <th>Ytelse</th>
          <th>Hjemmel</th>
          <th>Fullført</th>
          <th>Saksbehandler</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {finishedOppgaver.map((k) => (
          <Row key={k.id} {...k} />
        ))}
      </tbody>
    </StyledTable>
  );
};

const Row = ({ id, type, hjemmel, ytelse, avsluttetAvSaksbehandlerDate, tildeltSaksbehandlerNavn }: IOppgave) => (
  <tr data-testid="search-result-fullfoert-oppgave">
    <td>
      <Type type={type} />
    </td>
    <td>
      <Ytelse ytelseId={ytelse} />
    </td>
    <td>
      <Hjemmel hjemmel={hjemmel} />
    </td>
    <td>{isoDateToPretty(avsluttetAvSaksbehandlerDate)}</td>
    <td>{tildeltSaksbehandlerNavn}</td>
    <RightAlignCell>
      <OpenOppgavebehandling oppgavebehandlingId={id} ytelse={ytelse} type={type} />
    </RightAlignCell>
  </tr>
);
