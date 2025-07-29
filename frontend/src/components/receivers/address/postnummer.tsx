import { StaticDataContext } from '@app/components/app/static-data-context';
import { AddressField } from '@app/components/receivers/address/field';
import { BodyShort, HStack, Label, VStack } from '@navikt/ds-react';
import { useContext, useId } from 'react';

interface Props {
  value: string | null;
  originalValue: string | null;
  onChange: (value: string | null) => void;
  error: boolean;
}

export const POSTNUMMER_ID = 'postnummer';

export const Postnummer = ({ value, originalValue, onChange, error }: Props) => {
  const poststedElementId = useId();

  const { getPoststed } = useContext(StaticDataContext);

  return (
    <HStack align="center" gap="1">
      <AddressField
        id={POSTNUMMER_ID}
        label="Postnummer"
        value={value}
        originalValue={originalValue}
        onChange={onChange}
        error={error}
        required
        maxLength={4}
        inputMode="numeric"
        pattern="^[0-9]{0,4}$"
        htmlSize={8}
      />
      <VStack justify="start" gap="2">
        <Label size="small" htmlFor={poststedElementId} className="flex min-h-6 items-center">
          Poststed
        </Label>
        <BodyShort size="medium" id={poststedElementId} className="flex h-8 items-center">
          {value === null ? 'Postnummer mangler' : (getPoststed(value) ?? 'Ukjent')}
        </BodyShort>
      </VStack>
    </HStack>
  );
};
