import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';
import { areDescendantsEqual } from '@/functions/are-descendants-equal';
import { ELEMENT_MALTEKST, ELEMENT_REDIGERBAR_MALTEKST } from '@/plate/plugins/element-types';
import type { MaltekstseksjonElement } from '@/plate/types';
import { useGetMaltekstseksjonTextsQuery } from '@/redux-api/maltekstseksjoner/consumer';
import type { IConsumerRichText } from '@/types/texts/consumer';
import type { Language } from '@/types/texts/language';

const getIsChanged = (element: MaltekstseksjonElement, texts: IConsumerRichText[]): boolean => {
  for (const child of element.children) {
    if (child.type === ELEMENT_REDIGERBAR_MALTEKST || child.type === ELEMENT_MALTEKST) {
      const maltekst = texts.find((text) => text.id === child.id);

      if (maltekst === undefined) {
        return false;
      }

      if (!areDescendantsEqual(child.children, maltekst.richText)) {
        return true;
      }
    }
  }

  return false;
};

export const useIsChanged = (element: MaltekstseksjonElement, language: Language): [boolean, boolean] => {
  const { id } = element;
  const { data: texts } = useGetMaltekstseksjonTextsQuery(id === undefined ? skipToken : { id, language });

  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (texts === undefined) {
      return;
    }

    setIsLoading(true);

    const timeout = setTimeout(() => {
      requestIdleCallback(() => setIsChanged(getIsChanged(element, texts)));
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [element, texts]);

  return [isLoading, isChanged];
};
