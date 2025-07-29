import { StaticDataContext } from '@app/components/app/static-data-context';
import { useGetMySignatureQuery } from '@app/redux-api/bruker';
import { ActionMenu, InternalHeader } from '@navikt/ds-react';
import { useContext } from 'react';
import { UserDropdown } from './dropdown';

export const User = () => {
  const { user } = useContext(StaticDataContext);
  const name = useSignature();

  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <InternalHeader.UserButton
          data-testid="user-menu-button"
          name={name}
          description={`Enhet: ${user.ansattEnhet.navn}`}
          className="whitespace-nowrap"
        />
      </ActionMenu.Trigger>

      <UserDropdown />
    </ActionMenu>
  );
};

const useSignature = () => {
  const { data, isSuccess } = useGetMySignatureQuery();

  return isSuccess ? (data.customLongName ?? data.longName) : 'Laster...';
};
