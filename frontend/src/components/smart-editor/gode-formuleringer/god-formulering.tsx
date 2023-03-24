import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import React, { useEffect, useRef, useState } from 'react';
import { Editor } from 'slate';
import styled from 'styled-components';
import { IRichText } from '@app/types/texts/texts';
import { DateTime } from '../../datetime/datetime';
import { renderElement } from '../../rich-text/slate-elements/maltekst/render';
import { AddButton } from './add-button';

interface Props extends IRichText {
  editor: Editor;
  isFocused: boolean;
  onClick: () => void;
}

export const GodFormulering = ({ title, content, modified, created, editor, isFocused, onClick }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
        <DateTime modified={modified} created={created} />
        <AddButton
          editor={editor}
          content={content}
          title="Sett inn god formulering i markert område"
          disabledTitle="En god formulering kan kun settes inn i et tomt avsnitt"
        >
          Sett inn
        </AddButton>
      </ActionWrapper>
      <ContentContainer>
        <StyledContent $isExpanded={isExpanded}>{content.map((e, i) => renderElement(e, `${i}`))}</StyledContent>
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
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
  padding: 8px;
  border-radius: 4px;
  width: 100%;
  background-color: #f5f5f5;
  outline: 3px solid ${({ $isFocused }) => ($isFocused ? 'var(--a-border-focus)' : 'transparent')};
  transition: outline 0.2s ease-in-out;
  white-space: normal;
`;

const StyledContent = styled.div<{ $isExpanded: boolean }>`
  background-color: #fff;
  border-radius: 4px;
  padding: 8px;
  padding-bottom: 0;
  max-height: ${({ $isExpanded }) => ($isExpanded ? 'unset' : '200px')};
  overflow: hidden;
  position: relative;

  :after {
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
