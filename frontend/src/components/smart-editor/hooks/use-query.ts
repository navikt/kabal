import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useMemo } from 'react';
import { GLOBAL, LIST_DELIMITER, SET_DELIMITER } from '@app/components/smart-editor-texts/types';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useUser } from '@app/simple-api-state/use-user';
import { UtfallEnum } from '@app/types/kodeverk';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { ApiQuery, TextTypes } from '@app/types/texts/texts';

interface Params {
  textType: TextTypes;
  templateId?: TemplateIdEnum;
  section?: string;
}

export const useQuery = ({ textType, templateId, section }: Params) => {
  const { data: oppgave, isLoading } = useOppgave();
  const { data: bruker, isLoading: brukerIsLoading } = useUser();

  return useMemo<ApiQuery | typeof skipToken>(() => {
    if (isLoading || brukerIsLoading || typeof oppgave === 'undefined' || typeof bruker === 'undefined') {
      return skipToken;
    }

    const { extraUtfallIdSet, utfallId } = oppgave.resultat;

    const templateSectionList =
      templateId !== undefined && section !== undefined
        ? [`${templateId}${LIST_DELIMITER}${section}`, `${GLOBAL}${LIST_DELIMITER}${section}`]
        : [];

    const query: ApiQuery = {
      ytelseHjemmelList: getYtelseHjemmelList(oppgave.ytelseId, oppgave.resultat.hjemmelIdSet),
      utfall: getUtfallList(extraUtfallIdSet, utfallId),
      enheter: [bruker.ansattEnhet.id],
      templateSectionList,
      textType,
    };

    return query;
  }, [bruker, brukerIsLoading, oppgave, isLoading, section, templateId, textType]);
};

export const getYtelseHjemmelList = (ytelse: string, hjemmelList: string[]): string[] => {
  const result: string[] = [ytelse];

  for (const hjemmel of hjemmelList) {
    result.push(`${ytelse}${LIST_DELIMITER}${hjemmel}`, `${GLOBAL}${LIST_DELIMITER}${hjemmel}`);
  }

  return result;
};

const getUtfallList = (extraUtfallIdSet: UtfallEnum[], utfallId: UtfallEnum | null): ApiQuery['utfall'] => {
  const utfallSet: Set<UtfallEnum> = utfallId === null ? new Set([]) : new Set([utfallId]);

  for (const item of extraUtfallIdSet) {
    utfallSet.add(item);
  }

  if (utfallSet.size === 0) {
    return '';
  }

  return Array.from(utfallSet).sort().join(SET_DELIMITER);
};
