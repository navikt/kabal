import type { IDocument } from '@app/types/documents/documents';
import type { ISmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

const DOCUMENT_COUNT_REGEX = /^ \((\d+)\)$/;

export type BaseTemplate = Pick<ISmartEditorTemplate, 'templateId' | 'tittel'>;
export type BaseDocument = Pick<IDocument, 'tittel' | 'parentId'>;

const getDocumentCount = (documents: BaseDocument[], template: BaseTemplate): number => {
  const counts: number[] = [];
  let exactMatchCount = 0;

  for (const document of documents) {
    if (document.parentId !== null) {
      continue;
    }

    const newTitle = getSmartDocumentTitle(template.templateId, template.tittel);

    if (document.tittel === newTitle) {
      exactMatchCount++;

      continue;
    }

    if (document.tittel.startsWith(newTitle)) {
      const match = document.tittel.replace(newTitle, '').match(DOCUMENT_COUNT_REGEX);

      if (match === null) {
        continue;
      }

      const [, countStr] = match;

      if (typeof countStr === 'undefined') {
        continue;
      }

      const parsedCount = Number.parseInt(countStr, 10);

      if (Number.isNaN(parsedCount)) {
        continue;
      }

      counts.push(parsedCount);
    }
  }

  if (counts.length === 0) {
    return exactMatchCount ? 1 : 0;
  }

  for (let i = 1; i <= counts.length; i++) {
    if (!counts.includes(i)) {
      return i;
    }
  }

  return counts.length + 1;
};

export const getTitle = (documents: BaseDocument[], template: BaseTemplate): string => {
  const baseTitle = getSmartDocumentTitle(template.templateId, template.tittel);
  const count = getDocumentCount(documents, template);

  return count === 0 ? baseTitle : `${baseTitle} (${count})`;
};

const getSmartDocumentTitle = (templateId: TemplateIdEnum, fallback: string) => {
  switch (templateId) {
    case TemplateIdEnum.KLAGEVEDTAK_V1:
    case TemplateIdEnum.KLAGEVEDTAK_V2:
      return 'Klagevedtak';
    case TemplateIdEnum.ANKEVEDTAK:
    case TemplateIdEnum.GJENOPPTAKSBEGJÆRING_VEDTAK:
      return 'Omgjøring av klagevedtak';
    default:
      return fallback;
  }
};
