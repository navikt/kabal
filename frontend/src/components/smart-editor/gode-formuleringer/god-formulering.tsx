import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Heading, Tag } from '@navikt/ds-react';
import { Plate } from '@udecode/plate-common';
import { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { OUTLINE_WIDTH, godFormuleringBaseStyle } from '@app/components/smart-editor/gode-formuleringer/styles';
import { SPELL_CHECK_LANGUAGES, useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { renderReadOnlyLeaf } from '@app/plate/leaf/render-leaf';
import { PlateEditor } from '@app/plate/plate-editor';
import { previewPlugins } from '@app/plate/plugins/plugin-sets/preview';
import { EditorValue, RichTextEditor, useMyPlateEditorState } from '@app/plate/types';
import { NonNullableGodFormulering } from '@app/types/texts/consumer';
import { LANGUAGE_NAMES } from '@app/types/texts/language';
import { DateTime } from '../../datetime/datetime';
import { AddButton } from './add-button';

type Props = NonNullableGodFormulering & {
  isFocused: boolean;
  onClick: () => void;
};

export const GodFormulering = ({ title, richText, publishedDateTime, isFocused, onClick, id, language }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const editor = useMyPlateEditorState();
  const primaryLanguage = useSmartEditorLanguage();

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
      <ActionWrapper>
        <Left>
          <DateTime dateTime={publishedDateTime} title="Sist endret" icon={<CalendarIcon aria-hidden />} />
          {primaryLanguage === language ? null : (
            <Tag size="xsmall" variant="warning">
              {LANGUAGE_NAMES[language]}
            </Tag>
          )}
        </Left>
        <AddButton
          editor={editor}
          content={richText}
          title="Sett inn god formulering i markert område"
          disabledTitle="Mangler markert område å sette inn god formulering i"
        >
          Sett inn
        </AddButton>
      </ActionWrapper>
      <ContentContainer>
        <StyledContent $isExpanded={isExpanded}>
          <Plate<EditorValue, RichTextEditor> initialValue={richText} id={id} readOnly plugins={previewPlugins}>
            <PlateEditor id={id} readOnly renderLeaf={renderReadOnlyLeaf} lang={SPELL_CHECK_LANGUAGES[language]} />
          </Plate>
        </StyledContent>
        <ShowMore isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      </ContentContainer>
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

const Left = styled.div`
  display: flex;
  gap: var(--a-spacing-1);
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

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
