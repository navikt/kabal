import React from 'react';
import styled from 'styled-components';
import { isoDateToPretty } from '@app/domain/date';
import { IOppgave } from '@app/types/oppgaver';

type Props = Pick<IOppgave, 'sattPaaVent'>;

export const PaaVent = ({ sattPaaVent }: Props) =>
  sattPaaVent?.isExpired === true ? (
    <Expired>{isoDateToPretty(sattPaaVent?.to ?? null)}</Expired>
  ) : (
    <NonExpired>{isoDateToPretty(sattPaaVent?.to ?? null)}</NonExpired>
  );

const NonExpired = styled.span``;

const Expired = styled(NonExpired)`
  color: #c30000;
`;
