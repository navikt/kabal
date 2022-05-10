import { DeletableVoidElementsEnum } from './editor-enums';
import { IMarks } from './marks';

export interface IWithThreads {
  threadIds: string[];
}

export interface IBaseVoid {
  children: [{ text: '' }];
}

export enum Flettefelt {
  FNR = 'fnr',
  ENHET_NAME = 'enhet-name',
}

export interface FlettefeltElementType extends IBaseVoid, IMarks, IWithThreads {
  type: DeletableVoidElementsEnum.FLETTEFELT;
  content: string | null;
  field: Flettefelt | null;
}

export type DeletableVoidTypes = FlettefeltElementType;
