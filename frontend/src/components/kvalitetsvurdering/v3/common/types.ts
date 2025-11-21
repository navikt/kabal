import type { SaksbehandlingsregleneErrorFields } from '@app/components/kvalitetsvurdering/v3/saksbehandlingsreglene/data';
import type { SærregelverketErrorFields } from '@app/components/kvalitetsvurdering/v3/særregelverket/data';
import type { TrygdemedisinErrorFields } from '@app/components/kvalitetsvurdering/v3/trygdemedisin/data';
import type {
  KvalitetsvurderingAllRegistreringshjemlerV3,
  KvalitetsvurderingSaksdataHjemlerV3,
  KvalitetsvurderingStrings,
  KvalitetsvurderingV3Boolean,
} from '@app/types/kaka-kvalitetsvurdering/v3';

interface BaseParams {
  label: string;
  helpText?: string;
  groupErrorField?: GroupErrorField;
}

export type GroupErrorField = SærregelverketErrorFields | SaksbehandlingsregleneErrorFields | TrygdemedisinErrorFields;

export interface CheckboxParams extends BaseParams {
  field: keyof KvalitetsvurderingV3Boolean;
  groupErrorField?: GroupErrorField;
  type: TypeEnum.CHECKBOX;
  childList?: InputParams[];
  saksdatahjemler?: keyof KvalitetsvurderingSaksdataHjemlerV3;
  allRegistreringshjemler?: keyof KvalitetsvurderingAllRegistreringshjemlerV3;
}

export interface TextParams extends BaseParams {
  field: keyof KvalitetsvurderingStrings;
  type: TypeEnum.TEXTAREA;
  description?: string;
}

export type InputParams = CheckboxParams | TextParams;

export enum TypeEnum {
  CHECKBOX = 0,
  TEXTAREA = 1,
}
