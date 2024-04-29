import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';
import { NONE, NONE_TYPE } from '@app/components/smart-editor-texts/types';
import { useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { TemplateSections } from '@app/plate/template-sections';
import { useLazyGetConsumerTextsQuery } from '@app/redux-api/texts/consumer';
import { GOD_FORMULERING_TYPE } from '@app/types/common-text-types';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { NonNullableGodFormulering, isNonNullGodFormulering } from '@app/types/texts/consumer';
import { LANGUAGES } from '@app/types/texts/language';
import { useQuery } from '../hooks/use-query';

interface State {
  isLoading: boolean;
  data: NonNullableGodFormulering[];
}

export const useTranslatedFormuleringer = (
  templateId: TemplateIdEnum | undefined,
  section: TemplateSections | NONE_TYPE,
): State => {
  const [getTexts] = useLazyGetConsumerTextsQuery();
  const primaryLanguage = useSmartEditorLanguage();
  const baseQuery = useQuery({
    textType: GOD_FORMULERING_TYPE,
    templateId,
    section: section === NONE ? undefined : section,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [texts, setTexts] = useState<NonNullableGodFormulering[]>([]);

  useEffect(() => {
    if (baseQuery === skipToken) {
      return;
    }

    setIsLoading(true);

    const sortedLanguageTextsPromises = LANGUAGES.toSorted((a, b) => {
      if (a === primaryLanguage) {
        return -1;
      }

      if (b === primaryLanguage) {
        return 1;
      }

      return 0;
    }).map((language) => getTexts({ ...baseQuery, language }).unwrap());

    Promise.allSettled(sortedLanguageTextsPromises).then((results) => {
      const [uniqueTexts, ...others] = results
        .filter(isFulfilled)
        .map(({ value }) => value.filter(isNonNullGodFormulering));

      if (uniqueTexts === undefined) {
        setTexts([]);
        setIsLoading(false);

        return;
      }

      for (const other of others) {
        for (const text of other) {
          if (!uniqueTexts.some((t) => t.id === text.id)) {
            uniqueTexts.push(text);
          }
        }
      }

      setTexts(uniqueTexts);
      setIsLoading(false);
    });
  }, [baseQuery, primaryLanguage, getTexts]);

  return { data: texts, isLoading };
};

const isFulfilled = <T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> =>
  result.status === 'fulfilled';
