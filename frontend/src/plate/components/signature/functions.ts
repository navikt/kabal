import type { ISignatureResponse } from '@app/types/bruker';

const getShortName = ({ customShortName, generatedShortName }: ISignatureResponse): string =>
  customShortName ?? generatedShortName;

const getLongName = ({ customLongName, longName }: ISignatureResponse): string => customLongName ?? longName;

export const getName = (user: ISignatureResponse, useShortName: boolean) =>
  useShortName ? getShortName(user) : getLongName(user);

export const getTitle = (title: string | null, suffix?: string): string | null => {
  if (title === null) {
    return null;
  }

  if (typeof suffix === 'undefined') {
    return title;
  }

  return `${title}/${suffix}`;
};
