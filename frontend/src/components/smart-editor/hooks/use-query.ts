import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useMemo } from 'react';
import { NONE, NONE_TYPE } from '@app/components/smart-editor-texts/types';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useUser } from '@app/simple-api-state/use-user';
import { NoTemplateIdEnum, TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { ApiQuery, TemplateSections, TextTypes } from '@app/types/texts/texts';

interface Params {
  textType: TextTypes;
  templateId?: TemplateIdEnum | NoTemplateIdEnum | null;
  sections?: (TemplateSections | NONE_TYPE)[];
}

const EMPTY_QUERY: NONE_TYPE[] = [];

export const useQuery = ({ textType, templateId = null, sections = EMPTY_QUERY }: Params) => {
  const { data, isLoading } = useOppgave();
  const { data: bruker, isLoading: brukerIsLoading } = useUser();

  return useMemo<ApiQuery | typeof skipToken>(() => {
    if (isLoading || brukerIsLoading || typeof data === 'undefined' || typeof bruker === 'undefined') {
      return skipToken;
    }

    const { utfallId } = data.resultat;

    const query: ApiQuery = {
      sections,
      hjemler: [...data.resultat.hjemmelIdSet, NONE],
      ytelser: [data.ytelseId, NONE],
      utfall: utfallId === null ? EMPTY_QUERY : [utfallId, NONE],
      enheter: [bruker.ansattEnhet.id, NONE],
      templates: templateId === null ? EMPTY_QUERY : [templateId, NONE],
      textType,
    };

    return query;
  }, [bruker, brukerIsLoading, data, isLoading, sections, templateId, textType]);
};
