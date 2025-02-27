import { DateTime } from '@app/components/datetime/datetime';
import { AddButton } from '@app/components/smart-editor/gode-formuleringer/add-button';
import { OUTLINE_WIDTH, godFormuleringBaseStyle } from '@app/components/smart-editor/gode-formuleringer/styles';
import { SPELL_CHECK_LANGUAGES, useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { KabalPlateEditor } from '@app/plate/plate-editor';
import { previewComponents, previewPlugins } from '@app/plate/plugins/plugin-sets/preview';
import { type KabalValue, type RichTextEditor, useMyPlateEditorRef } from '@app/plate/types';
import type { NonNullableGodFormulering } from '@app/types/texts/consumer';
import { LANGUAGE_NAMES } from '@app/types/texts/language';
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, HStack, Heading, Tag, VStack } from '@navikt/ds-react';
import { Plate, usePlateEditor } from '@udecode/plate-core/react';
import { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

type Props = NonNullableGodFormulering & {
  isFocused: boolean;
  onClick: () => void;
};

export const GodFormulering = ({ title, richText, publishedDateTime, isFocused, onClick, id, language }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
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
      <Heading title={title} level="1" size="small">
        {title}
      </Heading>
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
      <VStack gap="1">
        <StyledContent $isExpanded={isExpanded}>
          <Plate<RichTextEditor> editor={editor} readOnly>
            <KabalPlateEditor id={id} readOnly lang={SPELL_CHECK_LANGUAGES[language]} />
          </Plate>
        </StyledContent>
        <ShowMore isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      </VStack>
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
  gap: var(--a-spacing-2);
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
