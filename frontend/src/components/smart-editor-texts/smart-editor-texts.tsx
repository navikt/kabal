import { Add } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useAddTextMutation } from '@app/redux-api/texts';
import { TextTypes, isPlainTextType } from '@app/types/texts/texts';
import { LoadText } from './edit/load-text';
import { FilteredTextList } from './filtered-text-list';
import { getNewPlainText, getNewRichText } from './functions/new-text';
import { useTextNavigate } from './hooks/use-text-navigate';

interface Props {
  textType: TextTypes;
}

export const SmartEditorTexts = ({ textType }: Props) => {
  const navigate = useTextNavigate();
  const [addText, { isLoading }] = useAddTextMutation();

  const onClick = async () => {
    const text = isPlainTextType(textType) ? getNewPlainText(textType) : getNewRichText(textType);
    const { id } = await addText({ text, query: { textType } }).unwrap();
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
  grid-template-rows: 100%;
  column-gap: 16px;
  padding-bottom: 16px;
  padding-top: 8px;
  padding-right: 8px;
  overflow-y: hidden;
  flex-grow: 1;
`;
