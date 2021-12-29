import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import React from 'react';
import { isoDateToPretty } from '../../../domain/date';
import { IOppgave, IOppgaveList } from '../../../redux-api/oppgaver-types';
import { Hjemmel } from '../../common-table-components/hjemmel';
import { OpenKlagebehandling } from '../../common-table-components/open';
import { Type } from '../../common-table-components/type';
import { Ytelse } from '../../common-table-components/ytelse';
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
      <Ytelse ytelseId={ytelse} type={type} />
    </td>
    <td>
      <Hjemmel hjemmel={hjemmel} type={type} />
    </td>
    <td>{isoDateToPretty(avsluttetAvSaksbehandlerDate)}</td>
    <td>{tildeltSaksbehandlerNavn}</td>
    <RightAlignCell>
      <OpenKlagebehandling klagebehandlingId={id} ytelse={ytelse} />
    </RightAlignCell>
  </tr>
);
