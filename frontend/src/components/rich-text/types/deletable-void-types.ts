import { DeletableVoidElementsEnum } from './editor-enums';
import { IMarks } from './marks';

interface IWithThreads {
  threadIds: string[];
}

interface IBaseVoid {
  children: [{ text: '' }];
}

enum Flettefelt {
  FNR = 'fnr',
  ENHET_NAME = 'enhet-name',
}

export interface FlettefeltElementType extends IBaseVoid, IMarks, IWithThreads {
  type: DeletableVoidElementsEnum.FLETTEFELT;
  content: string | null;
  field: Flettefelt | null;
}
