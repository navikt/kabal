import React from 'react';
import { useGetBrukerQuery } from '../../redux-api/bruker';
import { FradelKlagebehandlingButton } from './fradel-button';
import { TildelKlagebehandlingButton } from './tildel-button';

type TildelProps = Parameters<typeof TildelKlagebehandlingButton>[0];
type FradelProps = Parameters<typeof FradelKlagebehandlingButton>[0];
type ButtonProps = TildelProps & FradelProps;

interface Props extends ButtonProps {
  name: string | null;
}

export const SaksbehandlerButton = ({
  klagebehandlingId,
  isAvsluttetAvSaksbehandler,
  tildeltSaksbehandlerident,
  name,
  tema,
}: Props): JSX.Element => {
  const { data: userData, isLoading } = useGetBrukerQuery();

  if (typeof userData === 'undefined' || isLoading) {
    return <span>Laster...</span>;
  }

  if (tildeltSaksbehandlerident === null) {
    return <TildelKlagebehandlingButton klagebehandlingId={klagebehandlingId} tema={tema} />;
  }

  if (userData.info.navIdent === tildeltSaksbehandlerident) {
    return (
      <FradelKlagebehandlingButton
        klagebehandlingId={klagebehandlingId}
        isAvsluttetAvSaksbehandler={isAvsluttetAvSaksbehandler}
        tildeltSaksbehandlerident={tildeltSaksbehandlerident}
      />
    );
  }

  return <span>{name}</span>;
};
