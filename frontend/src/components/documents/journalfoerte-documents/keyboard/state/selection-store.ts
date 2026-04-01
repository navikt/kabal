import {
  mergeRanges,
  type SelectionRange,
} from '@/components/documents/journalfoerte-documents/select-context/range-utils';
import { Observable } from '@/observable';

export const selectionRangesStore = new Observable<readonly SelectionRange[]>([], mergeRanges);
