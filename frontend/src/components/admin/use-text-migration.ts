import { useCallback } from 'react';
import { ApiHook } from '@app/components/admin/types';
import { GLOBAL, LIST_DELIMITER } from '@app/components/smart-editor-texts/types';
import { toast } from '@app/components/toast/store';
import { getTemplateSections } from '@app/hooks/use-template-sections';
import { ANKEVEDTAK_TEMPLATE } from '@app/plate/templates/ankevedtak';
import { KLAGEVEDTAK_TEMPLATE } from '@app/plate/templates/klagevedtak';
import { TEMPLATE_MAP } from '@app/plate/templates/templates';
import { useLazyGetTextsQuery, useUpdateTextMutation } from '@app/redux-api/texts';
import { useLatestYtelser } from '@app/simple-api-state/use-kodeverk';
import { IYtelse, UtfallEnum } from '@app/types/kodeverk';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { IPlainText, IRichText, IText, PlainTextTypes, RichTextTypes } from '@app/types/texts/texts';

const DEPRECATED = { templates: [], sections: [], ytelser: [], hjemler: [] };

export const useTextMigration: ApiHook = () => {
  const [getTexts, { isLoading, isUninitialized }] = useLazyGetTextsQuery();
  const [update, { isLoading: isMigrating, isSuccess }] = useUpdateTextMutation();
  const { data: ytelser = [] } = useLatestYtelser();

  const migrate = useCallback(async () => {
    const { data } = await getTexts({});

    if (data === undefined) {
      console.error('No data found.');
      toast.error('No texts found.');

      return;
    }

    for (const text of data) {
      const migrated = migrateText(text, ytelser);

      // eslint-disable-next-line no-console
      console.table({
        'type (unchanged)': migrated.textType,
        'title (unchanged)': migrated.title,
        'templates (deprecated)': migrated.templates.join(', '),
        'sections (deprecated)': migrated.sections.join(', '),
        'ytelser (deprecated)': migrated.ytelser.join(', '),
        'hjemler (deprecated)': migrated.hjemler.join(', '),
        'utfall (cleaned)': migrated.utfall.join(', '),
        'enheter (cleaned)': migrated.enheter.join(', '),
        templateSectionList: migrated.templateSectionList.join(', '),
        ytelseHjemmelList: migrated.ytelseHjemmelList.join(', '),
      });

      update({ query: {}, text: migrated });
    }
  }, [getTexts, update, ytelser]);

  return [migrate, { isLoading: isLoading || isMigrating, isSuccess, isUninitialized }];
};

const migrateText = (text: IText, ytelser: IYtelse[]): IText => {
  const base = { id: text.id, modified: text.modified, created: text.created, title: text.title };

  if (isPlainText(text)) {
    return {
      ...DEPRECATED,
      ...base,
      textType: text.textType,
      plainText: text.plainText,
      templateSectionList: [],
      ytelseHjemmelList: [],
      utfall: [],
      enheter: getEnheter(text),
    };
  }

  const richBase = { ...DEPRECATED, ...base, textType: text.textType, content: text.content, enheter: [] };

  if (text.textType === RichTextTypes.REGELVERK) {
    return {
      ...richBase,
      templateSectionList: [],
      ytelseHjemmelList: getYtelseHjemmelList(text, ytelser),
      utfall: getUtfall(text),
    };
  }

  return {
    ...richBase,
    templateSectionList: getTemplateSectionList(text),
    ytelseHjemmelList: getYtelseHjemmelList(text, ytelser),
    utfall: getUtfall(text),
  };
};

const isPlainText = (text: IRichText | IPlainText): text is IPlainText =>
  text.textType === PlainTextTypes.HEADER || text.textType === PlainTextTypes.FOOTER;

const getEnheter = (text: IText) => text.enheter.filter((value) => value !== '');

const getUtfall = (text: IText) =>
  text.utfall.filter((value) => value !== '' && value !== UtfallEnum.HEVET && value !== UtfallEnum.HENVIST);

const getYtelseHjemmelList = (text: IText, ytelser: IYtelse[]): string[] => {
  const ytelseHjemmelSet: Set<string> = new Set(text.ytelseHjemmelList);

  if (text.ytelser.length === 0) {
    for (const hjemmelId of text.hjemler) {
      ytelseHjemmelSet.add(`${GLOBAL}${LIST_DELIMITER}${hjemmelId}`);
    }

    return [...ytelseHjemmelSet];
  }

  for (const ytelseId of text.ytelser) {
    const ytelse = ytelser.find(({ id }) => id === ytelseId);

    if (ytelse === undefined) {
      console.error(`Ytelse with id ${ytelseId} not found.`);
      toast.error(`Ytelse with id ${ytelseId} not found.`);
      continue;
    }

    let hasHjemmel = false;

    for (const hjemmelId of text.hjemler) {
      const hjemmel = findHjemmel(ytelse, hjemmelId);

      if (hjemmel === null) {
        continue;
      }

      ytelseHjemmelSet.add(`${ytelse.id}${LIST_DELIMITER}${hjemmel.id}`);
      hasHjemmel = true;
    }

    if (!hasHjemmel) {
      ytelseHjemmelSet.add(ytelse.id);
    }
  }

  return [...ytelseHjemmelSet];
};

const findHjemmel = (ytelse: IYtelse, hjemmelId: string) => {
  for (const lovKilde of ytelse.lovKildeToRegistreringshjemler) {
    const hjemmel = lovKilde.registreringshjemler.find(({ id }) => id === hjemmelId);

    if (hjemmel) {
      return hjemmel;
    }
  }

  return null;
};

const getTemplateSectionList = ({ textType, templates, sections, templateSectionList }: IText): string[] => {
  const hasFixedLocation =
    textType === RichTextTypes.REGELVERK || textType === PlainTextTypes.FOOTER || textType === PlainTextTypes.HEADER;

  if (hasFixedLocation) {
    return [];
  }

  const templateSectionSet = new Set(templateSectionList);

  const klageTemplateSections = getTemplateSections(KLAGEVEDTAK_TEMPLATE.templateId);

  if (templates.length === 0) {
    for (const sectionId of sections) {
      if (klageTemplateSections.some((id) => id === sectionId)) {
        templateSectionSet.add(`${KLAGEVEDTAK_TEMPLATE.templateId}${LIST_DELIMITER}${sectionId}`);
      }
    }
  } else {
    for (const templateId of templates) {
      if (!isTemplateId(templateId)) {
        console.error(`Template with id ${templateId} not found.`);
        toast.error(`Template with id ${templateId} not found.`);
        continue;
      }

      const isAnkeTemplate = templateId === ANKEVEDTAK_TEMPLATE.templateId;

      for (const sectionId of sections) {
        if (!isAnkeTemplate) {
          templateSectionSet.add(`${templateId}${LIST_DELIMITER}${sectionId}`);
          continue;
        }

        if (klageTemplateSections.some((id) => id === sectionId)) {
          templateSectionSet.add(`${templateId}${LIST_DELIMITER}${sectionId}`);
        }
      }
    }
  }

  return [...templateSectionSet].filter((value) => value.includes(LIST_DELIMITER));
};

const isTemplateId = (templateId: string): templateId is TemplateIdEnum => templateId in TEMPLATE_MAP;
