import type { IOption } from '@app/components/filter-dropdown/props';
import type { IDraft } from '@app/types/texts/responses';

/** `NONE` means it will match texts with no filters set. The user intent here is for these texts to be general. As in not limited to specific options. */
export const NONE = 'NONE';
export type NONE_TYPE = typeof NONE;
export const NONE_OPTION: IOption<typeof NONE> = { value: NONE, label: 'Ingen spesifisert' };

export const GLOBAL = 'GLOBAL';
export type GLOBAL_TYPE = typeof GLOBAL;

export const WILDCARD = '*';
export type WILDCARD_TYPE = typeof WILDCARD;

export const SET_DELIMITER = ':';
export const LIST_DELIMITER = '>';

export interface DraftVersionProps {
  text: IDraft;
  onDraftDeleted: () => void;
}
