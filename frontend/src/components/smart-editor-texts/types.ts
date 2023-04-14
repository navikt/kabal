import { IOption } from '@app/components/filter-dropdown/props';

export type NONE_TYPE = 'NONE';
export const NONE = 'NONE';
export const NONE_OPTION: IOption<typeof NONE> = { value: NONE, label: 'Ingen spesifisert' };
