import { areDescendantsEqual } from '@app/functions/are-descendants-equal';
import { areFromPlaceholdersSafeToReplaceWithToPlaceholders } from '@app/plate/components/maltekstseksjon/get-children';
import { ELEMENT_EMPTY_VOID, ELEMENT_MALTEKST } from '@app/plate/plugins/element-types';
import type {
  EmptyVoidElement,
  MaltekstElement,
  MaltekstseksjonElement,
  RedigerbarMaltekstElement,
} from '@app/plate/types';
import { isOfElementType } from '@app/plate/utils/queries';
import { useLazyGetConsumerTextByIdQuery } from '@app/redux-api/texts/consumer';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { isConsumerRichText } from '@app/types/texts/consumer';
import { LANGUAGES } from '@app/types/texts/language';
import { useCallback } from 'react';

export enum ReplaceMethod {
  AUTO = 0,
  MANUAL = 1,
  NO_CHANGE = 2,
}

type GetReplaceMethodFn = (
  previousMaltekstseksjonElement: MaltekstseksjonElement,
  newMaltekstseksjon: IMaltekstseksjon | null,
  newChildren?: (MaltekstElement | RedigerbarMaltekstElement)[],
) => Promise<ReplaceMethod>;

/**
 * @returns A function that checks if the given MaltekstseksjonElement has changed by the user.
 */
const useGetIsChanged = () => {
  const [getOriginalText] = useLazyGetConsumerTextByIdQuery();

  return useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
    async (previousMaltekstseksjonElement: MaltekstseksjonElement): Promise<boolean> => {
      if (previousMaltekstseksjonElement.id === undefined) {
        return false;
      }

      for (const element of previousMaltekstseksjonElement.children) {
        if (element.type === ELEMENT_EMPTY_VOID) {
          continue;
        }

        const { id } = element;

        if (id === undefined) {
          console.warn('ID is undefined for element:', element);

          return true;
        }

        if (element.language === undefined) {
          console.warn('Language is undefined for element, checking all languages:', element);
        }

        // If no language is set, check all languages.
        const languages = element.language === undefined ? LANGUAGES : [element.language];

        // Fetch texts for all languages in parallel.
        const originalTextLanguages = await Promise.all(
          languages.map((language) => getOriginalText({ textId: id, language }, true).unwrap()),
        );

        const isAnyLanguageEqual = originalTextLanguages.some((originalTextLanguage) => {
          if (!isConsumerRichText(originalTextLanguage)) {
            console.warn('Original text is not a RichText:', originalTextLanguage);

            return false;
          }

          if (isOfElementType<MaltekstElement>(element, ELEMENT_MALTEKST)) {
            return areFromPlaceholdersSafeToReplaceWithToPlaceholders(element, {
              type: ELEMENT_MALTEKST,
              children: originalTextLanguage.richText,
            });
          }

          return areDescendantsEqual(element.children, originalTextLanguage.richText);
        });

        if (!isAnyLanguageEqual) {
          return true;
        }
      }

      return false;
    },
    [getOriginalText],
  );
};

export const useGetReplaceMethod = (oppgaveIsLoaded: boolean) => {
  const getIsChanged = useGetIsChanged();

  return useCallback<GetReplaceMethodFn>(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
    async (previousMaltekstseksjonElement, newMaltekstseksjon, newChildren = []) => {
      if (!oppgaveIsLoaded) {
        return ReplaceMethod.NO_CHANGE;
      }

      // Empty void can always be replaced.
      if (previousMaltekstseksjonElement.id === undefined) {
        const { children } = previousMaltekstseksjonElement;
        const [firstChild] = children;

        if (isOfElementType<EmptyVoidElement>(firstChild, ELEMENT_EMPTY_VOID)) {
          return newMaltekstseksjon === null ? ReplaceMethod.NO_CHANGE : ReplaceMethod.AUTO;
        }
      }

      if (
        previousMaltekstseksjonElement.id !== newMaltekstseksjon?.id ||
        previousMaltekstseksjonElement.children.length !== newChildren.length ||
        previousMaltekstseksjonElement.children.some((child, index) => {
          const newChild = newChildren[index];

          if (newChild === undefined) {
            return true;
          }

          return child.id !== newChild.id || child.language !== newChild.language;
        })
      ) {
        const isChanged = await getIsChanged(previousMaltekstseksjonElement);

        return isChanged ? ReplaceMethod.MANUAL : ReplaceMethod.AUTO;
      }

      // ID and children are the same.
      return ReplaceMethod.NO_CHANGE;
    },
    [oppgaveIsLoaded, getIsChanged],
  );
};
