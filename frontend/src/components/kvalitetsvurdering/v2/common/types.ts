import { IKvalitetsvurderingBooleans } from '../../../../types/kaka-kvalitetsvurdering/v2';
import { Hjemler } from './hjemler';
import { KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES } from './use-field-name';

export interface ICheckboxParams {
  field: keyof IKvalitetsvurderingBooleans;
  groupErrorField?: keyof typeof KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES;
  label: string;
  helpText?: string;
  hjemler?: Parameters<typeof Hjemler>[0]['field'];
  checkboxes?: ICheckboxParams[];
}
