import type { KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES } from '@app/components/kvalitetsvurdering/v2/common/use-field-name';
import type {
  IKvalitetsvurderingAllRegistreringshjemler,
  IKvalitetsvurderingBooleans,
  IKvalitetsvurderingSaksdataHjemler,
  IKvalitetsvurderingStrings,
} from '@app/types/kaka-kvalitetsvurdering/v2';

interface BaseParams {
  groupErrorField?: keyof typeof KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES;
  label: string;
  helpText?: string;
}

export enum KvalitetsvurderingInput {
  CHECKBOX = 0,
  TEXTAREA = 1,
}

export interface CheckboxParams extends BaseParams {
  field: keyof IKvalitetsvurderingBooleans;
  type: KvalitetsvurderingInput.CHECKBOX;
  checkboxes?: InputParams[];
  saksdatahjemler?: keyof IKvalitetsvurderingSaksdataHjemler;
  allRegistreringshjemler?: keyof IKvalitetsvurderingAllRegistreringshjemler;
}

export interface TextParams extends BaseParams {
  field: keyof IKvalitetsvurderingStrings;
  type: KvalitetsvurderingInput.TEXTAREA;
  description?: string;
}

export type InputParams = CheckboxParams | TextParams;
