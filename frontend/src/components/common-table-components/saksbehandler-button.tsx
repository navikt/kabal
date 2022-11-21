import React from 'react';
import { useUser } from '../../simple-api-state/use-user';
import { FradelKlagebehandlingButton } from './fradel-button';
import { TildelKlagebehandlingButton } from './tildel-button';

type TildelProps = Parameters<typeof TildelKlagebehandlingButton>[0];
type FradelProps = Parameters<typeof FradelKlagebehandlingButton>[0];
type ButtonProps = TildelProps & FradelProps;

interface Props extends ButtonProps {
  name: string | null;
  tildeltSaksbehandlerident: string | null;
}

export const SaksbehandlerButton = ({
  klagebehandlingId,
  isAvsluttetAvSaksbehandler,
  tildeltSaksbehandlerident,
  name,
  ytelse,
}: Props): JSX.Element => {
  const { data: userData, isLoading } = useUser();

  if (typeof userData === 'undefined' || isLoading) {
    return <span>Laster...</span>;
  }

  if (tildeltSaksbehandlerident === null) {
    return <TildelKlagebehandlingButton klagebehandlingId={klagebehandlingId} ytelse={ytelse} />;
  }

  if (userData.navIdent === tildeltSaksbehandlerident) {
    return (
      <FradelKlagebehandlingButton
        klagebehandlingId={klagebehandlingId}
        isAvsluttetAvSaksbehandler={isAvsluttetAvSaksbehandler}
      />
    );
  }

  return <span>{name}</span>;
};
