import { Skeleton } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useContext } from 'react';
import { UserContext } from '@app/components/app/user';
import { useGetSignatureQuery } from '@app/redux-api/bruker';

interface Props {
  navIdent: string | null;
}

export const ToastName = ({ navIdent }: Props) => {
  const user = useContext(UserContext);

  if (navIdent === user.navIdent) {
    return 'deg';
  }

  return <Name navIdent={navIdent} />;
};

export const Name = ({ navIdent }: Props) => {
  const { data, isLoading } = useGetSignatureQuery(navIdent ?? skipToken);

  if (navIdent === null) {
    return 'Ukjent';
  }

  if (isLoading) {
    return <Skeleton variant="text" width={100} as="span" style={{ display: 'inline-block' }} />;
  }

  return data?.customLongName ?? data?.longName ?? navIdent;
};
