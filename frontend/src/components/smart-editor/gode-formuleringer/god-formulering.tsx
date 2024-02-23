import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import { Plate } from '@udecode/plate-common';
import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { OUTLINE_WIDTH, godFormuleringBaseStyle } from '@app/components/smart-editor/gode-formuleringer/styles';
import { renderReadOnlyLeaf } from '@app/plate/leaf/render-leaf';
import { PlateEditor } from '@app/plate/plate-editor';
import { previewPlugins } from '@app/plate/plugins/plugin-sets/preview';
import { EditorValue, RichTextEditor, useMyPlateEditorState } from '@app/plate/types';
import { IRichText } from '@app/types/texts/responses';
import { ModifiedCreatedDateTime } from '../../datetime/datetime';
import { AddButton } from './add-button';

type Props = IRichText & {
  isFocused: boolean;
  onClick: () => void;
};

export const GodFormulering = ({ title, content, modified, created, isFocused, onClick, id }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const editor = useMyPlateEditorState();

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
        <ModifiedCreatedDateTime modified={modified} created={created} />
        <AddButton
          editor={editor}
          content={content}
          title="Sett inn god formulering i markert område"
          disabledTitle="Mangler markert område å sette inn god formulering i"
        >
          Sett inn
        </AddButton>
      </ActionWrapper>
      <ContentContainer>
        <StyledContent $isExpanded={isExpanded}>
          <Plate<EditorValue, RichTextEditor> initialValue={content} id={id} readOnly plugins={previewPlugins}>
            <PlateEditor id={id} readOnly renderLeaf={renderReadOnlyLeaf} />
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
  gap: 8px;
  padding: 8px;
  background-color: var(--a-bg-subtle);
  outline: ${OUTLINE_WIDTH} solid ${({ $isFocused }) => ($isFocused ? 'var(--a-border-focus)' : 'transparent')};
  transition: outline 0.2s ease-in-out;
  white-space: normal;
`;

const StyledContent = styled.div<{ $isExpanded: boolean }>`
  background-color: white;
  border-radius: var(--a-border-radius-medium);
  padding-left: 8px;
  padding-right: 8px;
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
    height: 40px;
    box-shadow: inset 0 -40px 20px -5px rgb(245, 245, 245, 0.9);
  }

  > :first-child {
    margin-top: 0;
  }
`;
