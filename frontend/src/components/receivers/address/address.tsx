import { useEffect, useState } from 'react';
import { EditAddress } from '@/components/receivers/address/edit-address';
import { ReadAddress } from '@/components/receivers/address/read-address';
import type { Addresses } from '@/components/receivers/address/types';
import { HandlingEnum, type IAddress } from '@/types/documents/receivers';
import type { IPart } from '@/types/oppgave-common';

interface Props extends Addresses {
  part: IPart;
  handling: HandlingEnum;
  onChange?: (address: IAddress | null) => void;
}

export const Address = ({ part, address, overriddenAddress, handling, onChange }: Props) => {
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (handling === HandlingEnum.LOCAL_PRINT) {
      setEdit(false);
    }
  }, [handling]);

  const onEdit = handling === HandlingEnum.LOCAL_PRINT || onChange === undefined ? undefined : () => setEdit(true);

  if (!edit) {
    return <ReadAddress part={part} address={address} overriddenAddress={overriddenAddress} onEdit={onEdit} />;
  }

  return (
    <EditAddress
      address={address}
      overriddenAddress={overriddenAddress}
      onSave={(newAddress) => {
        onChange?.(newAddress);
        setEdit(false);
      }}
      onCancel={() => setEdit(false)}
    />
  );
};
