import { Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const ReadOnlyTag = styled(Tag)`
  display: flex;
  flex-direction: row;
  column-gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  border-radius: var(--a-border-radius-xlarge);
  position: relative;
  padding-left: 8px;
  padding-right: 8px;
  text-align: left;
  justify-content: left;
  max-width: 100%;
`;
