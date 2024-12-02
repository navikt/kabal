import { GLOBAL, LIST_DELIMITER } from '@app/components/smart-editor-texts/types';
import type { IGetMaltekstseksjonParams, IGetTextsParams } from '@app/types/common-text-types';

type Params = IGetMaltekstseksjonParams | IGetTextsParams;

export const paramsWithGlobalSections = <T extends Params>(params: T): T => {
  if (params.templateSectionIdList === undefined) {
    return params;
  }

  const list = [...params.templateSectionIdList];

  for (const templateSectionId of list) {
    const [, sectionId] = templateSectionId.split(LIST_DELIMITER);
    const globalSection = `${GLOBAL}${LIST_DELIMITER}${sectionId}`;

    if (!list.includes(globalSection)) {
      list.push(globalSection);
    }
  }

  return { ...params, templateSectionIdList: list.toSorted((a, b) => a.localeCompare(b)) };
};
