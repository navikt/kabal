import React, { useEffect, useRef } from 'react';
import { Editor } from 'slate';
import styled from 'styled-components';
import { IText } from '../../../types/texts/texts';
import { DateTime } from '../../datetime/datetime';
import { renderElement } from '../../rich-text/slate-elements/maltekst/render';
import { AddButton } from './add-button';

interface Props extends IText {
  editor: Editor;
  isFocused: boolean;
  onClick: () => void;
}

export const GodFormulering = ({ title, content, modified, created, editor, isFocused, onClick }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocused && ref.current !== null) {
      ref.current.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
  }, [isFocused]);

  return (
    <StyledGodFormulering $isFocused={isFocused} ref={ref} onClick={onClick} tabIndex={0}>
      <Header>
        <StyledTitle title={title}>{title}</StyledTitle>
        <AddButton
          editor={editor}
          content={content}
          title="Sett inn god formulering i markert område"
          disabledTitle="En god formulering kan kun settes inn i et tomt avsnitt"
        >
          Sett inn
        </AddButton>
      </Header>
      <DateTime modified={modified} created={created} />
      <StyledContent>{content.map((e, i) => renderElement(e, `${i}`))}</StyledContent>
    </StyledGodFormulering>
  );
};

const StyledGodFormulering = styled.section<{ $isFocused: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
  padding: 8px;
  border-radius: 4px;
  width: 100%;
  background-color: #f5f5f5;
  outline: 3px solid ${({ $isFocused }) => ($isFocused ? 'var(--navds-semantic-color-focus)' : 'transparent')};
  transition: outline 0.2s ease-in-out;
  white-space: normal;
`;

const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
`;

const StyledTitle = styled.h1`
  font-size: 18px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledContent = styled.div`
  background-color: #fff;
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);

  > :first-child {
    margin-top: 0;
  }
`;
