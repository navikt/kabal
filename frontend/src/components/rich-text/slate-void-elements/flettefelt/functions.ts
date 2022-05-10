import { FLETTEFELT_NAMES } from '../../../smart-editor/constants';
import { Flettefelt } from '../../types/editor-void-types';

export const getFlettefeltName = (flettefelt: Flettefelt | null) => {
  if (flettefelt === null) {
    return undefined;
  }

  return FLETTEFELT_NAMES[flettefelt];
};
