import { ClockDashedIcon } from '@navikt/aksel-icons';
import { Plate } from '@udecode/plate-common';
import { forwardRef, useRef } from 'react';
import { styled } from 'styled-components';
import { ErrorBoundary } from '@app/error-boundary/error-boundary';
import { SpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { PlateEditor } from '@app/plate/plate-editor';
import { redaktoerPlugins } from '@app/plate/plugins/plugin-sets/redaktoer';
import { Sheet } from '@app/plate/sheet';
import { FloatingRedaktoerToolbar } from '@app/plate/toolbar/toolbars/floating-toolbar';
import { RedaktoerToolbar } from '@app/plate/toolbar/toolbars/redaktoer-toolbar';
import { RedaktoerTableToolbar } from '@app/plate/toolbar/toolbars/table-toolbar';
import { EditorValue, RichTextEditor } from '@app/plate/types';
import { ErrorComponent } from '../smart-editor-texts/error-component';

interface Props {
  editorId: string;
  savedContent: EditorValue;
  onChange?: (content: EditorValue) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  readOnly?: boolean;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  lang: SpellCheckLanguage;
}

export const RedaktoerRichText = forwardRef<RichTextEditor, Props>(
  ({ editorId, savedContent, onChange, onKeyDown, readOnly, onFocus, lang }, editorRef) => {
    const ref = useRef<HTMLDivElement>(null);

    return (
      <ErrorBoundary
        errorComponent={() => <ErrorComponent textId={editorId} />}
        actionButton={{
          onClick: async () => onChange?.(savedContent),
          buttonText: 'Gjenopprett tekst',
          buttonIcon: <ClockDashedIcon aria-hidden />,
          variant: 'primary',
          size: 'small',
        }}
      >
        <Plate<EditorValue, RichTextEditor>
          editorRef={editorRef}
          initialValue={savedContent}
          id={editorId}
          onChange={onChange}
          plugins={redaktoerPlugins}
          readOnly={readOnly}
        >
          <Content onKeyDown={onKeyDown}>
            {readOnly === true ? null : <RedaktoerToolbar />}

            <Sheet ref={ref} $minHeight={false}>
              <FloatingRedaktoerToolbar container={ref.current} editorId={editorId} />

              <RedaktoerTableToolbar container={ref.current} editorId={editorId} />

              <PlateEditor id={editorId} readOnly={readOnly} onFocus={onFocus} lang={lang} />
            </Sheet>
          </Content>
        </Plate>
      </ErrorBoundary>
    );
  },
);

RedaktoerRichText.displayName = 'RedaktoerRichText';

const Content = styled.div`
  padding: 16px;
  background: var(--a-surface-subtle);
  flex-grow: 1;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
`;
