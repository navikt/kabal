import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useMemo } from 'react';
import { NONE, NONE_TYPE } from '@app/components/smart-editor-texts/types';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useUser } from '@app/simple-api-state/use-user';
import { NoTemplateIdEnum, TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { ApiQuery, TemplateSections, TextTypes } from '@app/types/texts/texts';

interface Params {
  textType: TextTypes;
  section?: TemplateSections;
  requiredSection?: TemplateSections;
  templateId?: TemplateIdEnum | NoTemplateIdEnum;
}

const NONE_QUERY: [NONE_TYPE] = [NONE];
const EMPTY_QUERY: NONE_TYPE[] = [];

export const useQuery = ({ textType, templateId, section, requiredSection }: Params) => {
  const { data, isLoading } = useOppgave();
  const { data: bruker, isLoading: brukerIsLoading } = useUser();

  return useMemo<ApiQuery | typeof skipToken>(() => {
    if (isLoading || brukerIsLoading || typeof data === 'undefined' || typeof bruker === 'undefined') {
      return skipToken;
    }

    const { utfall } = data.resultat;

    const query: ApiQuery = {
      sections: getSections(requiredSection, section),
      hjemler: [...data.resultat.hjemler, NONE],
      ytelser: [data.ytelse, NONE],
      utfall: getQuery(utfall),
      enheter: [bruker.ansattEnhet.id, NONE],
      templates: getQuery(templateId),
      textType,
      requiredSection,
    };

    return query;
  }, [bruker, brukerIsLoading, data, isLoading, requiredSection, section, templateId, textType]);
};

const getSections = (
  requiredSection: TemplateSections | undefined,
  section: TemplateSections | undefined
): (TemplateSections | NONE_TYPE)[] => {
  if (typeof requiredSection === 'undefined') {
    return section === undefined ? NONE_QUERY : [section, NONE];
  }

  return EMPTY_QUERY;
};

const getQuery = <T>(query: T | null | undefined): (T | NONE_TYPE)[] => {
  if (query === null || query === undefined) {
    return NONE_QUERY;
  }

  return [query, NONE];
};
