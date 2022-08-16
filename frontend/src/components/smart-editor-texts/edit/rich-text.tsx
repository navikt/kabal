import { Historic } from '@navikt/ds-icons';
import React, { useCallback } from 'react';
import { Descendant } from 'slate';
import styled from 'styled-components';
import { ErrorBoundary } from '../../../error-boundary/error-boundary';
import { useDebounced } from '../../../hooks/use-debounce';
import { useUpdateTextPropertyMutation } from '../../../redux-api/texts';
import { RichTextEditorElement } from '../../rich-text/rich-text-editor/rich-text-editor';
import { ErrorComponent } from '../error-component';
// import { NEW_TEXT } from '../functions/new-text';
import { useTextQuery } from '../hooks/use-text-query';

interface Props {
  textId: string;
  savedContent: Descendant[];
}

export const RichTextEditor = ({ textId, savedContent }: Props) => {
  const [updateProperty] = useUpdateTextPropertyMutation({ fixedCacheKey: textId });
  const query = useTextQuery();

  const [, setContent] = useDebounced(
    savedContent,
    useCallback(
      (value) => updateProperty({ id: textId, key: 'content', value, query }),
      [textId, query, updateProperty]
    )
  );

  return (
    <ErrorBoundary
      errorComponent={() => <ErrorComponent textId={textId} />}
      actionButton={{
        onClick: async () => setContent(savedContent),
        buttonText: 'Gjenopprett tekst',
        buttonIcon: <Historic aria-hidden />,
        variant: 'primary',
        size: 'small',
      }}
    >
      <StyledRichTextEditorElement key={textId} id={textId} savedContent={savedContent} onChange={setContent} canEdit />
    </ErrorBoundary>
  );
};

const StyledRichTextEditorElement = styled(RichTextEditorElement)`
  width: 210mm;
  flex-grow: 1;
`;
