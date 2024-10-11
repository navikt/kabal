import type { IKodeverkSimpleValue, IKodeverkValue } from '@app/types/kodeverk';
import type { IOption } from './props';

export const kodeverkValuesToDropdownOptions = <T extends string = string>(
  kodeverkValues: IKodeverkValue<T>[],
  labelKey: keyof IKodeverkValue<T> = 'beskrivelse',
): IOption<T>[] => kodeverkValues.map(({ id, [labelKey]: label }) => ({ value: id, label }));

export const kodeverkSimpleValuesToDropdownOptions = <T extends string = string>(
  kodeverkValues: IKodeverkSimpleValue<T>[],
  labelKey: keyof IKodeverkSimpleValue<T> = 'navn',
): IOption<T>[] => kodeverkValues.map(({ id, [labelKey]: label }) => ({ value: id, label }));
