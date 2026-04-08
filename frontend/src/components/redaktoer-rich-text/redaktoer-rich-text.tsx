import { ClockDashedIcon } from '@navikt/aksel-icons';
import { Box, VStack } from '@navikt/ds-react';
import { Plate, usePlateEditor } from 'platejs/react';
import { useContext, useImperativeHandle, useRef } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { SavedStatus, type SavedStatusProps } from '@/components/saved-status/saved-status';
import { ErrorComponent } from '@/components/smart-editor-texts/error-component';
import { ErrorBoundary } from '@/error-boundary/error-boundary';
import { ScalingGroup } from '@/hooks/settings/use-setting';
import type { SpellCheckLanguage } from '@/hooks/use-smart-editor-language';
import { KabalPlateEditor } from '@/plate/plate-editor';
import { redaktørComponents, redaktørPlugins } from '@/plate/plugins/plugin-sets/redaktoer';
import { Sheet } from '@/plate/sheet';
import { getScaleVarName } from '@/plate/status-bar/scale-context';
import { StatusBar } from '@/plate/status-bar/status-bar';
import { RedaktoerToolbar } from '@/plate/toolbar/toolbars/redaktoer-toolbar';
import { RedaktoerTableToolbar } from '@/plate/toolbar/toolbars/table-toolbar';
import type { KabalValue, RichTextEditor } from '@/plate/types';

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
    value: structuredClone(savedContent),
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
        <VStack asChild padding="space-16" minWidth="calc(210mm + var(--ax-space-32))" onKeyDown={onKeyDown}>
          <Box background="neutral-soft" position="relative" overflowX="hidden" overflowY="auto" flexGrow="1">
            {readOnly === true ? null : <RedaktoerToolbar />}

            <Sheet ref={ref} minHeight={false} scaleCssVar={getScaleVarName(ScalingGroup.REDAKTØR)}>
              <RedaktoerTableToolbar container={ref.current} editorId={editorId} />

              <KabalPlateEditor id={editorId} onFocus={onFocus} lang={lang} />
            </Sheet>
          </Box>
        </VStack>

        <StatusBar>{status === undefined ? null : <SavedStatus {...status} />}</StatusBar>
      </Plate>
    </ErrorBoundary>
  );
};
