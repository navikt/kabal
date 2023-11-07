import { PlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useCallback } from 'react';
import { styled } from 'styled-components';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { isPlainTextType } from '@app/functions/is-rich-plain-text';
import { useAddTextMutation } from '@app/redux-api/texts/mutations';
import { TextTypes } from '@app/types/common-text-types';
import { LoadText } from './edit/load-text';
import { FilteredTextList } from './filtered-text-list';
import { getNewPlainText, getNewRichText } from './functions/new-text';
import { useTextNavigate } from './hooks/use-text-navigate';

interface Props {
  textType: TextTypes;
}

export const SmartEditorTexts = ({ textType }: Props) => {
  const query = useTextQuery();
  const navigate = useTextNavigate();
  const [addText, { isLoading }] = useAddTextMutation();

  const onClick = useCallback(async () => {
    const text = isPlainTextType(textType) ? getNewPlainText(textType) : getNewRichText(textType);
    const { id } = await addText({ text, query }).unwrap();
    navigate(id);
  }, [addText, navigate, query, textType]);

  return (
    <Container>
      <Header>
        <Button size="small" variant="secondary" loading={isLoading} onClick={onClick} icon={<PlusIcon aria-hidden />}>
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
  height: 100%;
  min-height: 100%;
`;

const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 16px;
`;

const Content = styled.div`
  display: flex;
  column-gap: 16px;
  padding-bottom: 16px;
  padding-top: 8px;
  padding-right: 8px;
  overflow-y: hidden;
  flex-grow: 1;
`;
