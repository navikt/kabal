import { Skeleton } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React from 'react';
import styled from 'styled-components';
import { useCanEdit } from '@app/hooks/use-can-edit';
import { useGetSignatureQuery } from '@app/redux-api/bruker';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { getTitleCapitalized } from './getTitle';

type MedunderskriverInfoProps = Pick<
  IOppgavebehandling,
  'tildeltSaksbehandlerident' | 'medunderskriverident' | 'typeId'
>;

export const MedunderskriverInfo = ({
  tildeltSaksbehandlerident,
  medunderskriverident,
  typeId,
}: MedunderskriverInfoProps) => {
  const canEdit = useCanEdit();

  if (canEdit) {
    return null;
  }

  const title = getTitleCapitalized(typeId);

  return (
    <div data-testid="medunderskriver-info">
      <StyledInfoLine>
        <b>Saksbehandler:</b>{' '}
        {tildeltSaksbehandlerident === null ? 'Ikke tildelt' : <Name navIdent={tildeltSaksbehandlerident} />}
      </StyledInfoLine>
      <StyledInfoLine>
        <b>{title}:</b>{' '}
        {medunderskriverident === null ? `${title} ikke satt` : <Name navIdent={medunderskriverident} />}
      </StyledInfoLine>
    </div>
  );
};

interface INameProps {
  navIdent: string;
}

const Name = ({ navIdent }: INameProps) => {
  const { data, isLoading } = useGetSignatureQuery(navIdent ?? skipToken);

  if (isLoading) {
    return <Skeleton variant="text" />;
  }

  const name = data?.customLongName ?? data?.longName ?? 'Ukjent';

  return name;
};

const StyledInfoLine = styled.p`
  margin: 0;
  margin-bottom: 8px;
`;
