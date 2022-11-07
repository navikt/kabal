import { Historic } from '@navikt/ds-icons';
import React from 'react';
import { Descendant } from 'slate';
import styled from 'styled-components';
import { ErrorBoundary } from '../../../error-boundary/error-boundary';
import { RichTextEditorElement } from '../../rich-text/rich-text-editor/rich-text-editor';
import { ErrorComponent } from '../error-component';

interface Props {
  textId: string;
  savedContent: Descendant[];
  setContent: (content: Descendant[]) => void;
}

export const RichTextEditor = ({ textId, savedContent, setContent }: Props) => (
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
    <StyledRichTextEditorElement
      showPlaceholderButton
      key={textId}
      id={textId}
      savedContent={savedContent}
      onChange={setContent}
      canEdit
    />
  </ErrorBoundary>
);

const StyledRichTextEditorElement = styled(RichTextEditorElement)`
  width: 210mm;
  flex-grow: 1;
`;
