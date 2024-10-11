import { StaticDataContext } from '@app/components/app/static-data-context';
import { AddressField } from '@app/components/documents/new-documents/modal/finish-document/address/field';
import { Row } from '@app/components/documents/new-documents/modal/finish-document/address/layout';
import { BodyShort, Label } from '@navikt/ds-react';
import { useContext, useId } from 'react';
import { styled } from 'styled-components';

interface Props {
  value: string | null;
  originalValue: string | null;
  onChange: (value: string | null) => void;
  error: boolean;
}

export const Postnummer = ({ value, originalValue, onChange, error }: Props) => {
  const poststedElementId = useId();

  const { getPoststed } = useContext(StaticDataContext);

  return (
    <Row>
      <AddressField
        id="postnummer"
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
      <PoststedContainer>
        <StyledLabel size="small" htmlFor={poststedElementId}>
          Poststed
        </StyledLabel>
        <Poststed size="medium" id={poststedElementId}>
          {value === null ? 'Postnummer mangler' : (getPoststed(value) ?? 'Ukjent')}
        </Poststed>
      </PoststedContainer>
    </Row>
  );
};

const PoststedContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: start;
  gap: var(--a-spacing-2);
`;

const StyledLabel = styled(Label)`
  display: flex;
  align-items: center;
  min-height: var(--a-spacing-6);
`;

const Poststed = styled(BodyShort)`
  display: flex;
  align-items: center;
  height: var(--a-spacing-8);
`;
