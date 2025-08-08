import { DateTime } from '@app/components/datetime/datetime';
import { AddButton } from '@app/components/smart-editor/gode-formuleringer/add-button';
import { GodeFormuleringerExpandState } from '@app/hooks/settings/use-setting';
import { SPELL_CHECK_LANGUAGES, useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { KabalPlateEditor } from '@app/plate/plate-editor';
import { previewComponents, previewPlugins } from '@app/plate/plugins/plugin-sets/preview';
import { type KabalValue, type RichTextEditor, useMyPlateEditorRef } from '@app/plate/types';
import type { NonNullableGodFormulering } from '@app/types/texts/consumer';
import { LANGUAGE_NAMES } from '@app/types/texts/language';
import { CalendarIcon, ChevronDownDoubleIcon, ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { BoxNew, Button, Heading, HStack, Tag, VStack } from '@navikt/ds-react';
import { Plate, usePlateEditor } from '@platejs/core/react';
import { useEffect, useRef } from 'react';

type Props = NonNullableGodFormulering & {
  isFocused: boolean;
  onClick: () => void;
  setExpandState: (state: GodeFormuleringerExpandState) => void;
  expandState: GodeFormuleringerExpandState;
};

export const GodFormulering = ({
  title,
  richText,
  publishedDateTime,
  isFocused,
  onClick,
  id,
  language,
  expandState,
  setExpandState,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  // const [showPreview, setShowPreview] = useState(false);
  const mainEditor = useMyPlateEditorRef();
  const primaryLanguage = useSmartEditorLanguage();

  const editor = usePlateEditor<KabalValue, (typeof previewPlugins)[0]>({
    id,
    plugins: previewPlugins,
    override: { components: previewComponents },
    value: richText,
  });

  useEffect(() => {
    if (isFocused && ref.current !== null) {
      ref.current.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
  }, [isFocused]);

  const isFullRichText = expandState === GodeFormuleringerExpandState.FULL_RICH_TEXT;

  return (
    <BoxNew
      asChild
      background="neutral-soft"
      borderWidth="4"
      className={`last:mb-96 ${isFocused ? 'border-ax-border-focus' : 'border-transparent'}`}
      borderRadius="medium"
      shadow="dialog"
      flexShrink="0"
    >
      <VStack ref={ref} onClick={onClick} tabIndex={0} padding="2">
        <HStack wrap={false} align="start" justify="space-between">
          <Heading title={title} level="1" size="xsmall">
            {title}
          </Heading>

          <Button
            size="small"
            variant="tertiary-neutral"
            title={nextTitle(expandState)}
            icon={<NextExpandStateIcon state={expandState} />}
            onClick={() => setExpandState(nextExpandState(expandState))}
          />
        </HStack>

        <HStack align="center" justify="space-between" wrap={false}>
          <HStack gap="1">
            <DateTime dateTime={publishedDateTime} title="Sist endret" icon={<CalendarIcon aria-hidden />} />
            {primaryLanguage === language ? null : (
              <Tag size="xsmall" variant="warning">
                {LANGUAGE_NAMES[language]}
              </Tag>
            )}
          </HStack>
          <AddButton
            editor={mainEditor}
            content={richText}
            title="Sett inn god formulering i markert område"
            disabledTitle="Mangler markert område å sette inn god formulering i"
          >
            Sett inn
          </AddButton>
        </HStack>

        {expandState === GodeFormuleringerExpandState.COLLAPSED ? null : (
          <VStack gap="1" className="mt-2">
            <BoxNew
              position="relative"
              background="default"
              borderRadius="medium"
              paddingInline="2"
              overflow="hidden"
              maxHeight={isFullRichText ? 'unset' : '200px'}
              className={`after:absolute after:bottom-0 after:left-0 after:h-10 after:w-full after:bg-linear-to-t after:from-ax-bg-neutral-soft after:via-20% after:via-ax-bg-neutral-soft after:to-transparent [&>:first-child]:mt-0 ${isFullRichText ? 'after:hidden' : 'after:block'}`}
            >
              <Plate<RichTextEditor> editor={editor} readOnly>
                <KabalPlateEditor id={id} readOnly lang={SPELL_CHECK_LANGUAGES[language]} />
              </Plate>
            </BoxNew>
            <ShowMore
              isExpanded={isFullRichText}
              setIsExpanded={() =>
                setExpandState(
                  isFullRichText ? GodeFormuleringerExpandState.PREVIEW : GodeFormuleringerExpandState.FULL_RICH_TEXT,
                )
              }
            />
          </VStack>
        )}
      </VStack>
    </BoxNew>
  );
};

interface ShowMoreProps {
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}

const ShowMore = ({ isExpanded, setIsExpanded }: ShowMoreProps) => (
  <Button
    onClick={() => setIsExpanded(!isExpanded)}
    size="xsmall"
    variant="tertiary-neutral"
    iconPosition="right"
    icon={isExpanded ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
  >
    {isExpanded ? 'Vis mindre' : 'Vis mer'}
  </Button>
);

export const nextExpandState = (state: GodeFormuleringerExpandState): GodeFormuleringerExpandState => {
  switch (state) {
    case GodeFormuleringerExpandState.COLLAPSED:
      return GodeFormuleringerExpandState.PREVIEW;
    case GodeFormuleringerExpandState.PREVIEW:
      return GodeFormuleringerExpandState.FULL_RICH_TEXT;
    case GodeFormuleringerExpandState.FULL_RICH_TEXT:
      return GodeFormuleringerExpandState.COLLAPSED;
  }
};

export const NextExpandStateIcon = ({ state }: { state: GodeFormuleringerExpandState }) => {
  switch (state) {
    case GodeFormuleringerExpandState.COLLAPSED:
      return <ChevronDownIcon aria-hidden />;
    case GodeFormuleringerExpandState.PREVIEW:
      return <ChevronDownDoubleIcon aria-hidden />;
    case GodeFormuleringerExpandState.FULL_RICH_TEXT:
      return <ChevronUpIcon aria-hidden />;
  }
};

const nextTitle = (state: GodeFormuleringerExpandState) => {
  switch (state) {
    case GodeFormuleringerExpandState.COLLAPSED:
      return 'Vis overskrift og forhåndsvisning';
    case GodeFormuleringerExpandState.PREVIEW:
      return 'Vis god formulering i sin helhet';
    case GodeFormuleringerExpandState.FULL_RICH_TEXT:
      return 'Vis kun overskrift';
  }
};
