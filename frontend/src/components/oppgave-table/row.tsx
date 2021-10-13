import React from 'react';
import { isoDateToPretty } from '../../domain/date';
import { useHjemmelFromId, useTemaFromId, useTypeFromId } from '../../hooks/use-kodeverk-ids';
import { IKlagebehandling } from '../../redux-api/oppgaver';
import { LabelMain, LabelTema } from '../../styled-components/labels';
import { TildelKlagebehandlingButton } from '../common-table-components/tildel-button';
import { StyledAge, StyledDeadline } from './styled-components';

export const Row = ({ id, type, tema, hjemmel, frist, ageKA }: IKlagebehandling): JSX.Element => (
  <tr>
    <td>
      <LabelMain>{useTypeFromId(type)}</LabelMain>
    </td>
    <td>
      <LabelTema tema={tema}>{useTemaFromId(tema)}</LabelTema>
    </td>
    <td>
      <LabelMain>{useHjemmelFromId(hjemmel)}</LabelMain>
    </td>
    <td>
      <StyledAge age={ageKA}>
        {ageKA} {ageKA === 1 ? 'dag' : 'dager'}
      </StyledAge>
    </td>
    <td>
      <StyledDeadline age={ageKA} dateTime={frist}>
        {isoDateToPretty(frist)}
      </StyledDeadline>
    </td>
    <td>
      <TildelKlagebehandlingButton klagebehandlingId={id} />
    </td>
  </tr>
);
