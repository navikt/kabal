import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import React from 'react';
import { isoDateToPretty } from '../../../domain/date';
import { IKlagebehandling, IKlagebehandlingList } from '../../../redux-api/oppgaver';
import { Hjemmel } from '../../common-table-components/hjemmel';
import { OpenKlagebehandling } from '../../common-table-components/open';
import { Tema } from '../../common-table-components/tema';
import { Type } from '../../common-table-components/type';
import { RightAlignCell, StyledTable } from './styled-components';
import { StyledTableCaption } from './table-caption';

interface Props {
  finishedOppgaver: IKlagebehandlingList;
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
          <th>Tema</th>
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

const Row = ({ id, type, tema, hjemmel, avsluttetAvSaksbehandlerDate, tildeltSaksbehandlerNavn }: IKlagebehandling) => (
  <tr data-testid="search-result-fullfoert-oppgave">
    <td>
      <Type type={type} />
    </td>
    <td>
      <Tema tema={tema} />
    </td>
    <td>
      <Hjemmel hjemmel={hjemmel} />
    </td>
    <td>{isoDateToPretty(avsluttetAvSaksbehandlerDate)}</td>
    <td>{tildeltSaksbehandlerNavn}</td>
    <RightAlignCell>
      <OpenKlagebehandling klagebehandlingId={id} tema={tema} />
    </RightAlignCell>
  </tr>
);
