import { Historic } from '@navikt/ds-icons';
import React, { useMemo } from 'react';
import { Descendant, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact } from 'slate-react';
import styled from 'styled-components';
import { ErrorBoundary } from '@app/error-boundary/error-boundary';
import { RichTextEditorElement } from '../../rich-text/rich-text-editor/rich-text-editor';
import { withCopy } from '../../rich-text/rich-text-editor/with-copy';
import { withNormalization } from '../../rich-text/rich-text-editor/with-normalization';
import { withTables } from '../../rich-text/rich-text-editor/with-tables';
import { withEditableVoids } from '../../rich-text/rich-text-editor/with-voids';
import { ErrorComponent } from '../error-component';

interface Props {
  textId: string;
  savedContent: Descendant[];
  setContent: (content: Descendant[]) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

export const RichTextEditor = ({ textId, savedContent, setContent, onKeyDown }: Props) => {
  const editor = useMemo(
    () => withTables(withCopy(withEditableVoids(withHistory(withNormalization(withReact(createEditor())))))),
    []
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
      <Slate editor={editor} value={savedContent} onChange={setContent}>
        <StyledRichTextEditorElement key={textId} showPlaceholderButton onKeyDown={onKeyDown} />
      </Slate>
    </ErrorBoundary>
  );
};

const StyledRichTextEditorElement = styled(RichTextEditorElement)`
  width: 210mm;
  flex-grow: 1;
`;
