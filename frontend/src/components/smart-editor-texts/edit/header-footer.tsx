import { SavedStatus, type SavedStatusProps } from '@app/components/saved-status/saved-status';
import { PlainTextTypes } from '@app/types/common-text-types';
import { HStack, Textarea } from '@navikt/ds-react';
import { useState } from 'react';

type HeaderFooter = PlainTextTypes.HEADER | PlainTextTypes.FOOTER;

interface Props {
  type: HeaderFooter;
  initialValue: string;
  update: (plainText: string) => void;
  status: SavedStatusProps;
}

export const HeaderFooterEditor = ({ type, initialValue, update, status }: Props) => {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="grow">
      <Textarea
        minRows={5}
        label={getLabel(type)}
        value={value}
        onChange={({ target }) => {
          setValue(target.value);
          update(target.value);
        }}
        className="mx-4"
      />
      <HStack marginBlock="2 0" paddingInline="4" justify="end">
        <SavedStatus {...status} />
      </HStack>
    </div>
  );
};

const getLabel = (type: PlainTextTypes.HEADER | PlainTextTypes.FOOTER) =>
  type === PlainTextTypes.HEADER ? 'Topptekst' : 'Bunntekst';
