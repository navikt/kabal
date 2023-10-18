import { ClockDashedIcon } from '@navikt/aksel-icons';
import React, { useRef } from 'react';
import { styled } from 'styled-components';
import { ErrorBoundary } from '@app/error-boundary/error-boundary';
import { PlateEditor, PlateEditorContextComponent } from '@app/plate/plate-editor';
import { redaktoerPlugins } from '@app/plate/plugins/plugins-redaktoer';
import { Sheet } from '@app/plate/sheet';
import { FloatingRedaktoerToolbar } from '@app/plate/toolbar/toolbars/floating-toolbar';
import { RedaktoerToolbar } from '@app/plate/toolbar/toolbars/redaktoer-toolbar';
import { RedaktoerTableToolbar } from '@app/plate/toolbar/toolbars/table-toolbar';
import { EditorValue } from '@app/plate/types';
import { ErrorComponent } from '../error-component';

interface Props {
  textId: string;
  savedContent: EditorValue;
  setContent: (content: EditorValue) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

export const RichText = ({ textId, savedContent, setContent, onKeyDown }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <ErrorBoundary
      errorComponent={() => <ErrorComponent textId={textId} />}
      actionButton={{
        onClick: async () => setContent(savedContent),
        buttonText: 'Gjenopprett tekst',
        buttonIcon: <ClockDashedIcon aria-hidden />,
        variant: 'primary',
        size: 'small',
      }}
    >
      <PlateEditorContextComponent
        initialValue={savedContent}
        id={textId}
        onChange={setContent}
        plugins={redaktoerPlugins}
      >
        <Content onKeyDown={onKeyDown}>
          <RedaktoerToolbar />

          <Sheet ref={ref} $minHeight={false}>
            <FloatingRedaktoerToolbar container={ref.current} editorId={textId} />
            <RedaktoerTableToolbar container={ref.current} editorId={textId} />

            <PlateEditor id={textId} />
          </Sheet>
        </Content>
      </PlateEditorContextComponent>
    </ErrorBoundary>
  );
};

const Content = styled.div`
  padding: 16px;
  background: var(--a-surface-subtle);
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;
