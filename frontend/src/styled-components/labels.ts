import { Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';
import { SaksTypeEnum } from '@app/types/kodeverk';

export const TypeTag = styled(Tag)<{ $type: SaksTypeEnum }>`
  background-color: ${({ $type: type }) =>
    type === SaksTypeEnum.KLAGE ? 'var(--a-white)' : 'var(--a-surface-inverted)'};
  color: ${({ $type: type }) => (type === SaksTypeEnum.KLAGE ? 'var(--a-text-default)' : 'var(--a-white)')};
  border: 1px solid var(--a-red-500);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
