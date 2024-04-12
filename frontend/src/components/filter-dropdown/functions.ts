import { IKodeverkSimpleValue, IKodeverkValue } from '@app/types/kodeverk';
import { IOption } from './props';

export const kodeverkValuesToDropdownOptions = <T extends string = string>(
  kodeverkValues: IKodeverkValue<T>[],
  labelKey: keyof IKodeverkValue<T> = 'beskrivelse',
): IOption<T>[] => kodeverkValues.map(({ id, [labelKey]: label }) => ({ value: id, label }));

export const valuesToDropdownOptions = <T extends string = string>(
  values: T[],
  kodeverk: IKodeverkSimpleValue[],
): IOption<T>[] => values.map((value) => ({ value, label: kodeverk.find((k) => k.id === value)?.navn ?? value }));
