import React from 'react';
import { styled } from 'styled-components';
import { UnpublishMaltekstseksjonButton } from '@app/components/maltekstseksjoner/maltekstseksjon/unpublish-maltekstseksjon-button';
import { IGetTextsParams } from '@app/types/maltekstseksjoner/params';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { MaltekstseksjonVersions } from './maltekstseksjon-versions';

interface Props {
  maltekstseksjon: IMaltekstseksjon;
  query: IGetTextsParams;
}

export const Maltekstseksjon = ({ maltekstseksjon, query }: Props) => (
  <MaltekstseksjonContainer>
    <UnpublishMaltekstseksjonButton id={maltekstseksjon.id} title={maltekstseksjon.title} query={query} />

    <MaltekstseksjonVersions id={maltekstseksjon.id} query={query} />
  </MaltekstseksjonContainer>
);

const MaltekstseksjonContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--a-border-radius-medium);
  box-shadow: var(--a-shadow-medium);
  padding: 8px;
  padding-top: 0;
  padding-right: 0;
  margin-right: 4px;
  margin-bottom: 4px;
  margin-top: 4px;
  grid-area: content;
`;
