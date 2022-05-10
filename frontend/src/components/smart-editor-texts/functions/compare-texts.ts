import { IText } from '../../../types/texts/texts';

export const compareTexts = (text1: IText, text2: IText): boolean => {
  if (text1 === text2) {
    return true;
  }

  if (
    text1.id !== text2.id ||
    text1.textType !== text2.textType ||
    text1.created !== text2.created ||
    text1.title !== text2.title
  ) {
    return false;
  }

  const equalLimits =
    shallowCompareArray(text1.hjemler, text2.hjemler) &&
    shallowCompareArray(text1.ytelser, text2.ytelser) &&
    shallowCompareArray(text1.utfall, text2.utfall) &&
    shallowCompareArray(text1.enheter, text2.enheter) &&
    shallowCompareArray(text1.sections, text2.sections);

  if (!equalLimits) {
    return false;
  }

  if (text1.content.length !== text2.content.length) {
    return false;
  }

  return JSON.stringify(text1.content) === JSON.stringify(text2.content);
};

export const shallowCompareArray = <T>(arr1: T[], arr2: T[]): boolean => {
  if (arr1 === arr2) {
    return true;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((item, index) => item === arr2[index]);
};
