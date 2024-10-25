import { SetStandaloneTextLanguage } from '@app/components/set-redaktoer-language/set-standalone-text-language';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import {
  isGodFormuleringType,
  isPlainTextType,
  isRegelverkType,
  isRichTextType,
} from '@app/functions/is-rich-plain-text';
import { useNavigateToStandaloneTextVersion } from '@app/hooks/use-navigate-to-standalone-text-version';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { useAddTextMutation } from '@app/redux-api/texts/mutations';
import { REGELVERK_TYPE, type TextTypes } from '@app/types/common-text-types';
import type { Language } from '@app/types/texts/language';
import { PlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useCallback } from 'react';
import { styled } from 'styled-components';
import { LoadText } from './edit/load-text';
import { FilteredTextList } from './filtered-text-list';
import { getNewGodFormulering, getNewPlainText, getNewRegelverk, getNewRichText } from './functions/new-text';

interface Props {
  textType: TextTypes;
}

export const SmartEditorTexts = ({ textType }: Props) => {
  const query = useTextQuery();
  const navigate = useNavigateToStandaloneTextVersion(textType !== REGELVERK_TYPE);
  const [addText, { isLoading }] = useAddTextMutation();
  const lang = useRedaktoerLanguage();

  const onClick = useCallback(async () => {
    const text = getNewText(textType, lang);
    const { id, versionId } = await addText({ text, query }).unwrap();
    navigate({ id, versionId });
  }, [addText, lang, navigate, query, textType]);

  return (
    <Container>
      <Header>
        <Button size="small" variant="secondary" loading={isLoading} onClick={onClick} icon={<PlusIcon aria-hidden />}>
          Legg til ny
        </Button>
        <SetStandaloneTextLanguage textType={textType} />
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

  throw new Error('Unknown text type');
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
  column-gap: var(--a-spacing-4);
  padding-bottom: var(--a-spacing-4);
`;

const Content = styled.div`
  display: flex;
  column-gap: var(--a-spacing-4);
  padding-bottom: var(--a-spacing-4);
  padding-top: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);
  overflow-y: hidden;
  flex-grow: 1;
`;
