import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isUtfall } from '../../../functions/is-utfall';
import { TemplateIdEnum } from '../../../types/smart-editor/template-enums';
import { ApiQuery, TemplateSections } from '../../../types/texts/texts';
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
      utfall: utfall?.split(',')?.filter(isUtfall),
      enheter: enheter?.split(','),
      sections: sections?.split(',')?.filter(isSection),
      templates: templates?.split(',')?.filter(isTemplate),
      textType,
    }),
    [enheter, hjemler, sections, templates, textType, utfall, ytelser]
  );

  return query;
};

const SECTIONS = Object.values(TemplateSections);

const isSection = (section: string): section is TemplateSections => SECTIONS.some((s) => s === section);
const isTemplate = (template: string): template is TemplateIdEnum => TEMPLATE_IDS.some((id) => id === template);
