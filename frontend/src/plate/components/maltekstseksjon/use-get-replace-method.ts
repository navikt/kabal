import { useCallback } from 'react';
import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { usePrevious } from '@app/hooks/use-previous';
import { useSmartEditorLanguage } from '@app/hooks/use-smart-editor-language';
import { containsEditedPlaceholder } from '@app/plate/components/maltekstseksjon/get-children';
import { ELEMENT_EMPTY_VOID, ELEMENT_MALTEKST } from '@app/plate/plugins/element-types';
import { EmptyVoidElement, MaltekstseksjonElement } from '@app/plate/types';
import { isOfElementType } from '@app/plate/utils/queries';
import { useLazyGetMaltekstseksjonTextsQuery } from '@app/redux-api/maltekstseksjoner/consumer';
import { Language } from '@app/types/texts/language';

export enum ReplaceMethod {
  AUTO,
  MANUAL,
  NO_CHANGE,
}

type GetReplaceMethodFn = (
  previousMaltekstseksjonElement: MaltekstseksjonElement,
  newMaltekstseksjonId: string | null,
) => Promise<ReplaceMethod>;

const useGetIsChanged = () => {
  const [getOriginalTexts] = useLazyGetMaltekstseksjonTextsQuery();
  const language = useSmartEditorLanguage();
  const previousLanguage = usePrevious(language);

  return useCallback(
    async (previousMaltekstseksjonElement: MaltekstseksjonElement): Promise<boolean> => {
      const id = previousMaltekstseksjonElement.id ?? null;

      if (id === null) {
        return false;
      }

      if (previousLanguage === undefined) {
        return false;
      }

      const originalTexts = await getOriginalTexts({ id, language: previousLanguage }, true).unwrap();

      if (originalTexts.length !== previousMaltekstseksjonElement.children.length) {
        return true;
      }

      for (const text of previousMaltekstseksjonElement.children) {
        if (!originalTexts.some((ot) => ot.id === text.id)) {
          return true;
        }
      }

      return !areDescendantsEqual(
        previousMaltekstseksjonElement.children.flatMap((t) => (t.type === ELEMENT_EMPTY_VOID ? [] : t.children)),
        originalTexts.flatMap((t) => t.richText),
      );
    },
    [getOriginalTexts, previousLanguage],
  );
};

export const useGetReplaceMethod = (oppgaveIsLoaded: boolean) => {
  const language = useSmartEditorLanguage();

  const getIsChanged = useGetIsChanged();

  return useCallback<GetReplaceMethodFn>(
    async (previousMaltekstseksjonElement, newMaltekstseksjonId) => {
      if (!oppgaveIsLoaded) {
        return ReplaceMethod.NO_CHANGE;
      }

      const previousId = previousMaltekstseksjonElement.id ?? null;

      const { children } = previousMaltekstseksjonElement;

      if (previousId === newMaltekstseksjonId) {
        if (children.every((c) => (c.language ?? Language.NB) === language)) {
          return ReplaceMethod.NO_CHANGE;
        }

        if (children.every((e) => e.type === ELEMENT_MALTEKST && !containsEditedPlaceholder(e))) {
          return ReplaceMethod.AUTO;
        }

        const isChanged = await getIsChanged(previousMaltekstseksjonElement);

        return isChanged ? ReplaceMethod.MANUAL : ReplaceMethod.AUTO;
      }

      if (previousId === null) {
        return ReplaceMethod.AUTO;
      }

      const [firstChild] = children;

      if (isOfElementType<EmptyVoidElement>(firstChild, ELEMENT_EMPTY_VOID)) {
        return ReplaceMethod.AUTO;
      }

      const isChanged = await getIsChanged(previousMaltekstseksjonElement);

      return isChanged ? ReplaceMethod.MANUAL : ReplaceMethod.AUTO;
    },
    [oppgaveIsLoaded, getIsChanged, language],
  );
};
