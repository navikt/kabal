import { Receivers } from '@app/components/receivers/receivers';
import { useSetReceiversMutation } from '@app/redux-api/forlenget-behandlingstid';
import type { IMottaker } from '@app/types/documents/documents';

interface Props {
  value: IMottaker[];
  id: string;
}

export const SetReceivers = ({ value, id }: Props) => {
  const [setReceivers] = useSetReceiversMutation();

  return (
    <Receivers
      mottakerList={value}
      setMottakerList={(mottakerList) => setReceivers({ mottakerList, id })}
      sendErrors={[]}
    />
  );
};
