import { DateTime } from '@app/components/datetime/datetime';
import { AddButton } from '@app/components/smart-editor/gode-formuleringer/add-button';
import { OUTLINE_WIDTH, godFormuleringBaseStyle } from '@app/components/smart-editor/gode-formuleringer/styles';
import { GodeFormuleringerExpandState } from '@app/hooks/settings/use-setting';
import { SPELL_CHECK_LANGUAGES, useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { KabalPlateEditor } from '@app/plate/plate-editor';
import { previewComponents, previewPlugins } from '@app/plate/plugins/plugin-sets/preview';
import { type KabalValue, type RichTextEditor, useMyPlateEditorRef } from '@app/plate/types';
import type { NonNullableGodFormulering } from '@app/types/texts/consumer';
import { LANGUAGE_NAMES } from '@app/types/texts/language';
import { CalendarIcon, ChevronDownDoubleIcon, ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading, Tag, VStack } from '@navikt/ds-react';
import { Plate, usePlateEditor } from '@platejs/core/react';
import { useEffect, useRef } from 'react';
import { styled } from 'styled-components';

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

  return (
    <StyledGodFormulering $isFocused={isFocused} ref={ref} onClick={onClick} tabIndex={0}>
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
          <StyledContent $isExpanded={expandState === GodeFormuleringerExpandState.FULL_RICH_TEXT}>
            <Plate<RichTextEditor> editor={editor} readOnly>
              <KabalPlateEditor id={id} readOnly lang={SPELL_CHECK_LANGUAGES[language]} />
            </Plate>
          </StyledContent>
          <ShowMore
            isExpanded={expandState === GodeFormuleringerExpandState.FULL_RICH_TEXT}
            setIsExpanded={() =>
              setExpandState(
                expandState === GodeFormuleringerExpandState.FULL_RICH_TEXT
                  ? GodeFormuleringerExpandState.PREVIEW
                  : GodeFormuleringerExpandState.FULL_RICH_TEXT,
              )
            }
          />
        </VStack>
      )}
    </StyledGodFormulering>
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
    variant="tertiary"
    iconPosition="right"
    icon={isExpanded ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
  >
    {isExpanded ? 'Vis mindre' : 'Vis mer'}
  </Button>
);

const StyledGodFormulering = styled.section<{ $isFocused: boolean }>`
  ${godFormuleringBaseStyle}
  display: flex;
  flex-direction: column;
  padding: var(--a-spacing-2);
  background-color: var(--a-bg-subtle);
  outline: ${OUTLINE_WIDTH} solid ${({ $isFocused }) => ($isFocused ? 'var(--a-border-focus)' : 'transparent')};
  white-space: normal;
`;

const StyledContent = styled.div<{ $isExpanded: boolean }>`
  background-color: var(--a-bg-default);
  border-radius: var(--a-border-radius-medium);
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
  max-height: ${({ $isExpanded }) => ($isExpanded ? 'unset' : '200px')};
  overflow: hidden;
  position: relative;

  &::after {
    display: ${({ $isExpanded }) => ($isExpanded ? 'none' : 'block')};
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: var(--a-spacing-10);
    box-shadow: inset 0 -40px var(--a-spacing-5) -5px rgb(245, 245, 245, 0.9);
  }

  > :first-child {
    margin-top: 0;
  }
`;

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
