import { BodyShort, Label } from '@navikt/ds-react';
import React, { useContext, useId } from 'react';
import { styled } from 'styled-components';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { AddressField } from '@app/components/documents/new-documents/modal/finish-document/address/field';
import { Row } from '@app/components/documents/new-documents/modal/finish-document/address/layout';

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
          {value === null ? 'Postnummer mangler' : getPoststed(value) ?? 'Ukjent'}
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
  min-height: 24px;
`;

const Poststed = styled(BodyShort)`
  display: flex;
  align-items: center;
  height: 32px;
`;
