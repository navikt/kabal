import { getSuggestions } from '@app/components/documents/journalfoerte-documents/document/logiske-vedlegg/editable/suggestions';
import { useTemaName } from '@app/hooks/use-tema-name';
import type { LogiskVedlegg } from '@app/types/arkiverte-documents';
import { useMemo } from 'react';

interface State {
  suggestions: string[];
  lastIndex: number;
}

interface Props {
  logiskeVedlegg: LogiskVedlegg[];
  customValue: string;
  temaId: string;
}

export const useSuggestions = ({ logiskeVedlegg, customValue, temaId }: Props): State => {
  const [temaName, temaIsLoading] = useTemaName(temaId);

  const lowerLogiskeVedlegg = useMemo(() => logiskeVedlegg.map((la) => la.tittel.toLowerCase()), [logiskeVedlegg]);

  const allSuggestions = useMemo(() => {
    if (temaIsLoading || temaName === undefined) {
      return [];
    }

    return getSuggestions(temaName);
  }, [temaIsLoading, temaName]);

  const suggestions = useMemo(() => {
    const lowerCustomValue = customValue.toLowerCase();

    return allSuggestions.filter((option) => {
      const lowerOption = option.toLowerCase();

      return lowerOption.includes(lowerCustomValue) && !lowerLogiskeVedlegg.includes(lowerOption);
    });
  }, [customValue, allSuggestions, lowerLogiskeVedlegg]);

  const lastIndex = suggestions.length - 1;

  return { suggestions, lastIndex };
};
