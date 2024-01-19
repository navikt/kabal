import { Alert, Skeleton } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React from 'react';
import { useGetSignatureQuery } from '@app/redux-api/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';

interface Props {
  previousSaksbehandler: string | null;
  type: SaksTypeEnum.ANKE_I_TRYGDERETTEN | SaksTypeEnum.ANKE;
}

export const PreviousSaksbehandler = ({ previousSaksbehandler, type }: Props) => {
  const { data } = useGetSignatureQuery(previousSaksbehandler ?? skipToken);

  if (previousSaksbehandler === null) {
    return (
      <Alert variant="info" size="small" inline>
        Bruk «Søk på person» for å finne hvem som fullførte tidligere {getTypeName(type)}.
      </Alert>
    );
  }

  return data === undefined ? <Skeleton width={200} height={21} /> : data.longName;
};

const getTypeName = (type: SaksTypeEnum.ANKE_I_TRYGDERETTEN | SaksTypeEnum.ANKE) => {
  switch (type) {
    case SaksTypeEnum.ANKE:
      return 'klagebehandling';
    case SaksTypeEnum.ANKE_I_TRYGDERETTEN:
      return 'ankebehandling';
  }
};
