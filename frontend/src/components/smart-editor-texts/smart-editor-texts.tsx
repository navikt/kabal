import { SetStandaloneTextLanguage } from '@app/components/set-redaktoer-language/set-standalone-text-language';
import { Filters } from '@app/components/smart-editor-texts/filters';
import { useTextQuery } from '@app/components/smart-editor-texts/hooks/use-text-query';
import { QueryKey, SortKey } from '@app/components/smart-editor-texts/sortable-header';
import { StandaloneTextList } from '@app/components/smart-editor-texts/text-list/text-list';
import {
  isGodFormuleringType,
  isPlainTextType,
  isRegelverkType,
  isRichTextType,
} from '@app/functions/is-rich-plain-text';
import { useNavigateToStandaloneTextVersion } from '@app/hooks/use-navigate-to-standalone-text-version';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { useAddTextMutation } from '@app/redux-api/texts/mutations';
import { useGetTextsQuery } from '@app/redux-api/texts/queries';
import type { TextTypes } from '@app/types/common-text-types';
import { SortOrder } from '@app/types/sort';
import type { Language } from '@app/types/texts/language';
import { PlusIcon } from '@navikt/aksel-icons';
import { Button, HGrid, HStack, Search } from '@navikt/ds-react';
import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoadText } from './edit/load-text';
import { getNewGodFormulering, getNewPlainText, getNewRegelverk, getNewRichText } from './functions/new-text';

interface Props {
  textType: TextTypes;
}

export const SmartEditorTexts = ({ textType }: Props) => {
  const query = useTextQuery();
  const navigate = useNavigateToStandaloneTextVersion(textType);
  const [addText, { isLoading: isAdding }] = useAddTextMutation();
  const lang = useRedaktoerLanguage();

  const onClick = useCallback(async () => {
    const text = getNewText(textType, lang);
    const { id, versionId } = await addText({ text, query }).unwrap();
    navigate({ id, versionId });
  }, [addText, lang, navigate, query, textType]);

  const [filter, setFilter] = useState<string>('');
  const textQuery = useTextQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data = [], isLoading } = useGetTextsQuery(textQuery);

  return (
    <HGrid
      columns="700px min-content"
      style={{
        gridTemplateRows: 'min-content min-content min-content 1fr',
        gridTemplateAreas: "'header content' 'filters content' 'search content' 'list content'",
      }}
      gap="1 2"
      height="100%"
      overflowY="hidden"
    >
      <HStack gap="4" justify="start" className="[grid-area:header]">
        <Button size="small" variant="secondary" loading={isAdding} onClick={onClick} icon={<PlusIcon aria-hidden />}>
          Legg til ny
        </Button>

        <SetStandaloneTextLanguage textType={textType} />
      </HStack>

      <Filters textType={textType} className="[grid-area:filters]" />

      <Search
        value={filter}
        onChange={(v) => {
          if (filter.length === 0 && v.length > 0) {
            searchParams.set(QueryKey.SORT, SortKey.SCORE);
            searchParams.set(QueryKey.ORDER, SortOrder.DESC);
            setSearchParams(searchParams);
          }

          setFilter(v);
        }}
        placeholder="Filtrer på tittel og innhold"
        label="Filtrer på tittel og innhold"
        size="small"
        variant="simple"
        hideLabel
        spellCheck
        className="[grid-area:search]"
      />

      <StandaloneTextList
        filter={filter}
        data={data}
        isLoading={isLoading}
        textType={textType}
        style={{ gridArea: 'list' }}
      />

      <LoadText />
    </HGrid>
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
