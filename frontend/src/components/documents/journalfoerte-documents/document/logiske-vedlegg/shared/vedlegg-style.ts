import { Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const ReadOnlyTag = styled(Tag)`
  display: flex;
  flex-direction: row;
  column-gap: var(--a-spacing-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  border-radius: var(--a-border-radius-xlarge);
  position: relative;
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
  text-align: left;
  justify-content: left;
  max-width: 100%;
`;
