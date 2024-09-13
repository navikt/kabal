import { ReadOnlyTag } from '@app/components/documents/journalfoerte-documents/document/logiske-vedlegg/shared/vedlegg-style';
import { styled } from 'styled-components';

export const EditTag = styled(ReadOnlyTag)`
  max-width: 200px;
  background-color: var(--a-bg-default);

  &:empty::before {
    content: attr(aria-placeholder);
    color: var(--a-text-subtle);
  }

  &[contenteditable='true'] {
    cursor: text;
  }
`;
