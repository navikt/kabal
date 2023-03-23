import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useMemo } from 'react';
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

export const useQuery = ({ textType, templateId, section, requiredSection }: Params) => {
  const { data, isLoading } = useOppgave();
  const { data: bruker, isLoading: brukerIsLoading } = useUser();

  return useMemo<ApiQuery | typeof skipToken>(() => {
    if (isLoading || brukerIsLoading || typeof data === 'undefined' || typeof bruker === 'undefined') {
      return skipToken;
    }

    const { utfall } = data.resultat;

    const query: ApiQuery = {
      sections: section === undefined ? [] : [section],
      hjemler: data.resultat.hjemler,
      ytelser: [data.ytelse],
      utfall: utfall === null ? [] : [utfall],
      enheter: [bruker.ansattEnhet.id],
      textType,
      templates: templateId === undefined ? [] : [templateId],
      requiredSection,
    };

    return query;
  }, [bruker, brukerIsLoading, data, isLoading, requiredSection, section, templateId, textType]);
};
