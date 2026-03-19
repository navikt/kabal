import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';
import { useGodFormuleringerQuery } from '@/components/smart-editor/hooks/use-query';
import { NONE, type NONE_TYPE, WILDCARD } from '@/components/smart-editor-texts/types';
import { useSmartEditorLanguage } from '@/hooks/use-smart-editor-language';
import type { TemplateSections } from '@/plate/template-sections';
import { useLazyGetConsumerTextsQuery } from '@/redux-api/texts/consumer';
import type { TemplateIdEnum } from '@/types/smart-editor/template-enums';
import { isNonNullGodFormulering, type NonNullableGodFormulering } from '@/types/texts/consumer';
import { LANGUAGES } from '@/types/texts/language';

interface State {
  isLoading: boolean;
  data: NonNullableGodFormulering[];
}

export const useTranslatedFormuleringer = (
  templateId: TemplateIdEnum,
  section: TemplateSections | NONE_TYPE,
): State => {
  const [getTexts] = useLazyGetConsumerTextsQuery();
  const primaryLanguage = useSmartEditorLanguage();
  const baseQuery = useGodFormuleringerQuery(templateId, section === NONE ? WILDCARD : section);

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

    Promise.allSettled(sortedLanguageTextsPromises)
      .then((results) => {
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
      })
      .catch((error) => {
        console.error('Failed to fetch translated formuleringer:', error);
      });
  }, [baseQuery, primaryLanguage, getTexts]);

  return { data: texts, isLoading };
};

const isFulfilled = <T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> =>
  result.status === 'fulfilled';
