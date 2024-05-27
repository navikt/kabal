import React, { useEffect, useState } from 'react';
import { EditAddress } from '@app/components/documents/new-documents/modal/finish-document/address/edit-address';
import { ReadAddress } from '@app/components/documents/new-documents/modal/finish-document/address/read-address';
import { Addresses } from '@app/components/documents/new-documents/modal/finish-document/address/types';
import { HandlingEnum, IAddress } from '@app/types/documents/recipients';
import { IPart } from '@app/types/oppgave-common';

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
