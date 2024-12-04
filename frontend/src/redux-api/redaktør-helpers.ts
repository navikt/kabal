import { GLOBAL, LIST_DELIMITER, WILDCARD } from '@app/components/smart-editor-texts/types';
import type { IGetMaltekstseksjonParams, IGetTextsParams } from '@app/types/common-text-types';

type Params = IGetMaltekstseksjonParams | IGetTextsParams;

export const getListWithGlobal = (list: string[]) => {
  const newList = [...list];

  for (const item of list) {
    const [, lastPart] = item.split(LIST_DELIMITER);

    if (lastPart === WILDCARD || lastPart === undefined) {
      if (!newList.includes(GLOBAL)) {
        newList.push(GLOBAL);
      }

      continue;
    }

    const withGlobal = `${GLOBAL}${LIST_DELIMITER}${lastPart}`;

    if (!newList.includes(withGlobal)) {
      newList.push(withGlobal);
    }
  }

  return newList.toSorted((a, b) => a.localeCompare(b));
};

export const paramsWithGlobalQueries = <T extends Params>(params: T): T => {
  const templateSectionIdList =
    params.templateSectionIdList === undefined ? undefined : getListWithGlobal(params.templateSectionIdList);

  const ytelseHjemmelIdList =
    params.ytelseHjemmelIdList === undefined ? undefined : getListWithGlobal(params.ytelseHjemmelIdList);

  return { ...params, templateSectionIdList, ytelseHjemmelIdList };
};
