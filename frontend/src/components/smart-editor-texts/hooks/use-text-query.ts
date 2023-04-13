import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isUtfallOrNone } from '@app/functions/is-utfall';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { ApiQuery, TemplateSections } from '@app/types/texts/texts';
import { TEMPLATE_IDS } from '../../smart-editor/templates/templates';
import { useTextType } from './use-text-type';

type Query = Partial<ApiQuery>;

export const useTextQuery = (): Query => {
  const [params] = useSearchParams();
  const textType = useTextType();

  const hjemler = params.get('hjemler');
  const ytelser = params.get('ytelser');
  const utfall = params.get('utfall');
  const enheter = params.get('enheter');
  const sections = params.get('sections');
  const templates = params.get('templates');

  const query: Query = useMemo(
    () => ({
      hjemler: hjemler?.split(','),
      ytelser: ytelser?.split(','),
      utfall: utfall?.split(',')?.filter(isUtfallOrNone),
      enheter: enheter?.split(','),
      sections: sections?.split(',')?.filter(isSectionOrNone),
      templates: templates?.split(',')?.filter(isTemplateOrNone),
      textType,
    }),
    [enheter, hjemler, sections, templates, textType, utfall, ytelser]
  );

  return query;
};

const SECTIONS = Object.values(TemplateSections);

const isSectionOrNone = (section: string): section is TemplateSections =>
  section === 'NONE' || SECTIONS.some((s) => s === section);
const isTemplateOrNone = (template: string): template is TemplateIdEnum =>
  template === 'NONE' || TEMPLATE_IDS.some((id) => id === template);
