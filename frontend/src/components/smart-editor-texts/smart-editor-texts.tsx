import { Add } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useAddTextMutation } from '../../redux-api/texts';
import { TextTypes } from '../../types/texts/texts';
import { LoadText } from './edit/load-text';
import { getNewText } from './functions/new-text';
import { useTextNavigate } from './hooks/use-text-navigate';
import { FilteredTextList } from './smart-editor-texts-list';

interface Props {
  textType: TextTypes;
}

export const SmartEditorTexts = ({ textType }: Props) => {
  const navigate = useTextNavigate();
  const [addText, { isLoading }] = useAddTextMutation();

  const onClick = async () => {
    const { id } = await addText({ text: getNewText(textType), query: { textType } }).unwrap();
    navigate(id);
  };

  return (
    <Container>
      <Header>
        <Button size="small" variant="secondary" loading={isLoading} onClick={onClick} icon={<Add aria-hidden />}>
          Legg til ny
        </Button>
      </Header>
      <Content>
        <FilteredTextList textType={textType} />
        <LoadText />
      </Content>
    </Container>
  );
};

const Container = styled.article`
  display: flex;
  flex-direction: column;
  max-width: 1920px;
  width: 100%;
  height: 100%;
  min-height: 100%;
`;

const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 16px;
  padding-top: 16px;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 650px 1fr;
  column-gap: 16px;
  padding-bottom: 16px;
  padding-top: 8px;
  padding-right: 8px;
  overflow-y: hidden;
  flex-grow: 1;
`;
