import { ActionMenu, InternalHeader } from '@navikt/ds-react';
import { useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { UserDropdown } from '@/components/header/user-menu/dropdown';
import { useGetMySignatureQuery } from '@/redux-api/bruker';

export const User = () => {
  const { user } = useContext(StaticDataContext);
  const name = useSignature();

  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <InternalHeader.UserButton
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
