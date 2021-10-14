import React from 'react';
import { NavLink } from 'react-router-dom';
import { isoDateToPretty } from '../../domain/date';
import { useHjemmelFromId, useTemaFromId, useTypeFromId } from '../../hooks/use-kodeverk-ids';
import { IKlagebehandling } from '../../redux-api/oppgaver';
import { LabelMain, LabelTema } from '../../styled-components/labels';
import { FradelKlagebehandlingButton } from '../common-table-components/fradel-button';
import { MedudunderskriverflytLabel } from './medunderskrivflyt-label';
import { StyledAge, StyledDeadline } from './styled-components';

export const Row = ({
  id,
  type,
  tema,
  hjemmel,
  frist,
  person,
  ageKA,
  medunderskriverFlyt,
  erMedunderskriver,
  harMedunderskriver,
  isAvsluttetAvSaksbehandler,
  tildeltSaksbehandlerident,
}: IKlagebehandling): JSX.Element => (
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
    <td>{person?.navn}</td>
    <td>{person?.fnr}</td>
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
      <MedudunderskriverflytLabel
        medunderskriverflyt={medunderskriverFlyt}
        erMedunderskriver={erMedunderskriver}
        harMedunderskriver={harMedunderskriver}
      />
    </td>
    <td>
      <NavLink className="knapp knapp--hoved" to={`/klagebehandling/${id}`}>
        Åpne
      </NavLink>
    </td>
    <td>
      <FradelKlagebehandlingButton
        klagebehandlingId={id}
        isAvsluttetAvSaksbehandler={isAvsluttetAvSaksbehandler}
        tildeltSaksbehandlerident={tildeltSaksbehandlerident}
      />
    </td>
  </tr>
);
