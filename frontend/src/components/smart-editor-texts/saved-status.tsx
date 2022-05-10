import { SaveFile, Success } from '@navikt/ds-icons';
import React from 'react';
import styled from 'styled-components';

interface Props {
  isSaved: boolean;
}

export const SavedStatus = ({ isSaved }: Props) =>
  isSaved ? (
    <StyledSuccess title="Lagret!" />
  ) : (
    <TextContainer>
      <SaveFile />
      Lagrer...
    </TextContainer>
  );

const StyledSuccess = styled(Success)`
  color: var(--navds-global-color-green-600);
`;

const TextContainer = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;
