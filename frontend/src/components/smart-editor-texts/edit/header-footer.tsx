import { PlainTextTypes } from '@app/types/common-text-types';
import { Textarea } from '@navikt/ds-react';
import { useState } from 'react';
import { styled } from 'styled-components';

type HeaderFooter = PlainTextTypes.HEADER | PlainTextTypes.FOOTER;

interface Props {
  type: HeaderFooter;
  initialValue: string;
  update: (plainText: string) => void;
}

export const HeaderFooterEditor = ({ type, initialValue, update }: Props) => {
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
    </Container>
  );
};

const getLabel = (type: PlainTextTypes.HEADER | PlainTextTypes.FOOTER) =>
  type === PlainTextTypes.HEADER ? 'Topptekst' : 'Bunntekst';

const StyledTextarea = styled(Textarea)`
  margin: var(--a-spacing-4);
`;

const Container = styled.div`
  flex-grow: 1;
`;
