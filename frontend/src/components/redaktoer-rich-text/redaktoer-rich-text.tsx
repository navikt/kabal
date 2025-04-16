import { StaticDataContext } from '@app/components/app/static-data-context';
import { SavedStatus, type SavedStatusProps } from '@app/components/saved-status/saved-status';
import { ErrorComponent } from '@app/components/smart-editor-texts/error-component';
import { ErrorBoundary } from '@app/error-boundary/error-boundary';
import type { SpellCheckLanguage } from '@app/hooks/use-smart-editor-language';
import { KabalPlateEditor } from '@app/plate/plate-editor';
import { redaktørComponents, redaktørPlugins } from '@app/plate/plugins/plugin-sets/redaktoer';
import { Sheet } from '@app/plate/sheet';
import { StatusBar } from '@app/plate/status-bar/status-bar';
import { FloatingRedaktoerToolbar } from '@app/plate/toolbar/toolbars/floating-toolbar';
import { RedaktoerToolbar } from '@app/plate/toolbar/toolbars/redaktoer-toolbar';
import { RedaktoerTableToolbar } from '@app/plate/toolbar/toolbars/table-toolbar';
import type { KabalValue, RichTextEditor } from '@app/plate/types';
import { ClockDashedIcon } from '@navikt/aksel-icons';
import { Box, VStack } from '@navikt/ds-react';
import { Plate, usePlateEditor } from '@udecode/plate-core/react';
import { useContext, useImperativeHandle, useRef } from 'react';

interface Props {
  editorId: string;
  savedContent: KabalValue;
  onChange?: (data: { editor: RichTextEditor; value: KabalValue }) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  readOnly?: boolean;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  lang: SpellCheckLanguage;
  status?: SavedStatusProps;
  ref?: React.Ref<RichTextEditor>;
}

export const RedaktoerRichText = ({
  editorId,
  savedContent,
  onChange,
  onKeyDown,
  readOnly,
  onFocus,
  lang,
  status,
  ref: editorRef,
}: Props) => {
  const { user } = useContext(StaticDataContext);
  const ref = useRef<HTMLDivElement>(null);

  const editor = usePlateEditor<KabalValue, ReturnType<typeof redaktørPlugins>[0]>({
    id: editorId,
    plugins: redaktørPlugins(user),
    override: {
      components: redaktørComponents,
    },
    value: savedContent,
  });

  useImperativeHandle(editorRef, () => editor);

  return (
    <ErrorBoundary
      errorComponent={() => <ErrorComponent textId={editorId} />}
      actionButton={{
        onClick: async () => onChange?.({ editor, value: savedContent }),
        buttonText: 'Gjenopprett tekst',
        buttonIcon: <ClockDashedIcon aria-hidden />,
        variant: 'primary',
        size: 'small',
      }}
    >
      <Plate<RichTextEditor> editor={editor} onValueChange={onChange} readOnly={readOnly}>
        <VStack asChild padding="4" minWidth="calc(210mm + var(--a-spacing-8))" onKeyDown={onKeyDown}>
          <Box background="surface-subtle" position="relative" overflowX="hidden" overflowY="auto" flexGrow="1">
            {readOnly === true ? null : <RedaktoerToolbar />}

            <Sheet ref={ref} $minHeight={false}>
              <FloatingRedaktoerToolbar container={ref.current} editorId={editorId} />

              <RedaktoerTableToolbar container={ref.current} editorId={editorId} />

              <KabalPlateEditor id={editorId} readOnly={readOnly} onFocus={onFocus} lang={lang} />
            </Sheet>
          </Box>
        </VStack>

        <StatusBar>{status === undefined ? null : <SavedStatus {...status} />}</StatusBar>
      </Plate>
    </ErrorBoundary>
  );
};
