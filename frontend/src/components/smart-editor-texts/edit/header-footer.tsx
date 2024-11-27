import { SavedStatus, type SavedStatusProps } from '@app/components/saved-status/saved-status';
import { PlainTextTypes } from '@app/types/common-text-types';
import { HStack, Textarea } from '@navikt/ds-react';
import { useState } from 'react';
import { styled } from 'styled-components';

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
    <Container>
      <StyledTextarea
        minRows={5}
        label={getLabel(type)}
        value={value}
        onChange={({ target }) => {
          setValue(target.value);
          update(target.value);
        }}
      />
      <HStack marginBlock="2 0" paddingInline="4" justify="end">
        <SavedStatus {...status} />
      </HStack>
    </Container>
  );
};

const getLabel = (type: PlainTextTypes.HEADER | PlainTextTypes.FOOTER) =>
  type === PlainTextTypes.HEADER ? 'Topptekst' : 'Bunntekst';

const StyledTextarea = styled(Textarea)`
  margin-left: var(--a-spacing-4);
  margin-right: var(--a-spacing-4);
`;

const Container = styled.div`
  flex-grow: 1;
`;
