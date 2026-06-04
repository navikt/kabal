import { isValid, parse } from 'date-fns';
import { BACKUP_KEY_DATE_FORMAT } from '@/components/smart-editor/tabbed-editors/constants';

const REFERENCE_DATE = new Date(0);

/** Extracts the date segment from a backup localStorage key and parses it. */
export const parseBackupDateFromKey = (key: string): Date | null => {
  const dateString = key.split('/').at(-1);

  if (dateString === undefined) {
    return null;
  }

  const parsedDate = parse(dateString, BACKUP_KEY_DATE_FORMAT, REFERENCE_DATE);

  return isValid(parsedDate) ? parsedDate : null;
};
