import { PlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { SetStandaloneTextLanguage } from '@app/components/set-redaktoer-language/set-standalone-text-language';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { ShowDepublished } from '@app/components/smart-editor-texts/show-depublished';
import {
  isGodFormuleringType,
  isPlainTextType,
  isRegelverkType,
  isRichTextType,
} from '@app/functions/is-rich-plain-text';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { useAddTextMutation } from '@app/redux-api/texts/mutations';
import { TextTypes } from '@app/types/common-text-types';
import { Language } from '@app/types/texts/language';
import { LoadText } from './edit/load-text';
import { FilteredTextList } from './filtered-text-list';
import { getNewGodFormulering, getNewPlainText, getNewRegelverk, getNewRichText } from './functions/new-text';
import { useTextNavigate } from './hooks/use-text-navigate';

interface Props {
  textType: TextTypes;
}

export const SmartEditorTexts = ({ textType }: Props) => {
  const query = useTextQuery();
  const navigate = useTextNavigate();
  const [addText, { isLoading }] = useAddTextMutation();
  const lang = useRedaktoerLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const onClick = useCallback(async () => {
    const text = getNewText(textType, lang);
    const { id } = await addText({ text, query }).unwrap();
    navigate(id);
    searchParams.delete('trash');
    setSearchParams(searchParams);
  }, [addText, lang, navigate, query, searchParams, setSearchParams, textType]);

  return (
    <Container>
      <Header>
        <Button size="small" variant="secondary" loading={isLoading} onClick={onClick} icon={<PlusIcon aria-hidden />}>
          Legg til ny
        </Button>
        <SetStandaloneTextLanguage textType={textType} />
        <ShowDepublished />
      </Header>
      <Content>
        <FilteredTextList textType={textType} />
        <LoadText />
      </Content>
    </Container>
  );
};

const getNewText = (textType: TextTypes, lang: Language) => {
  if (isPlainTextType(textType)) {
    return getNewPlainText(textType, lang);
  }

  if (isRegelverkType(textType)) {
    return getNewRegelverk();
  }

  if (isRichTextType(textType)) {
    return getNewRichText(textType, lang);
  }

  if (isGodFormuleringType(textType)) {
    return getNewGodFormulering(lang);
  }

  throw new Error(`Unknown text type`);
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
  justify-content: flex-start;
  column-gap: 16px;
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
