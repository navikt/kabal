import { IKvalitetsvurderingBooleans } from '../../../../types/kaka-kvalitetsvurdering/v2';
import { Hjemler } from './hjemler';

export interface ICheckboxParams {
  field: keyof IKvalitetsvurderingBooleans;
  label: string;
  helpText?: string;
  hjemler?: Parameters<typeof Hjemler>[0]['field'];
  checkboxes?: ICheckboxParams[];
}
