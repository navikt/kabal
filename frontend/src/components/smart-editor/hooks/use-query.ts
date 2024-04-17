import { skipToken } from '@reduxjs/toolkit/query';
import { useContext, useMemo } from 'react';
import { StaticDataContext } from '@app/components/app/static-data-context';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { GLOBAL, LIST_DELIMITER, SET_DELIMITER } from '@app/components/smart-editor-texts/types';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { ApiQuery, ConsumerQuery, TextTypes } from '@app/types/common-text-types';
import { UtfallEnum } from '@app/types/kodeverk';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

interface Params {
  textType: TextTypes;
  templateId?: TemplateIdEnum;
  section?: string;
}

export const useQuery = ({ textType, templateId, section }: Params) => {
  const { data: oppgave, isLoading } = useOppgave();
  const { user } = useContext(StaticDataContext);
  const { language } = useContext(SmartEditorContext);

  return useMemo<ConsumerQuery | typeof skipToken>(() => {
    if (isLoading || oppgave === undefined) {
      return skipToken;
    }

    const { extraUtfallIdSet, utfallId } = oppgave.resultat;

    const templateSectionList =
      templateId !== undefined && section !== undefined
        ? [`${templateId}${LIST_DELIMITER}${section}`, `${GLOBAL}${LIST_DELIMITER}${section}`]
        : [];

    const query: ConsumerQuery = {
      ytelseHjemmelIdList: getYtelseHjemmelList(oppgave.ytelseId, oppgave.resultat.hjemmelIdSet),
      utfallIdList: getUtfallList(extraUtfallIdSet, utfallId),
      enhetIdList: [user.ansattEnhet.id],
      templateSectionIdList: templateSectionList,
      textType,
      language,
    };

    return query;
  }, [isLoading, oppgave, templateId, section, user.ansattEnhet.id, textType, language]);
};

const getYtelseHjemmelList = (ytelse: string, hjemmelList: string[]): string[] => {
  const result: string[] = [ytelse];

  for (const hjemmel of hjemmelList) {
    result.push(`${ytelse}${LIST_DELIMITER}${hjemmel}`, `${GLOBAL}${LIST_DELIMITER}${hjemmel}`);
  }

  return result;
};

const getUtfallList = (extraUtfallIdSet: UtfallEnum[], utfallId: UtfallEnum | null): ApiQuery['utfallIdList'] => {
  const utfallSet: Set<UtfallEnum> = utfallId === null ? new Set([]) : new Set([utfallId]);

  for (const item of extraUtfallIdSet) {
    utfallSet.add(item);
  }

  if (utfallSet.size === 0) {
    return '';
  }

  return Array.from(utfallSet).sort().join(SET_DELIMITER);
};
