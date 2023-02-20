import { Descendant } from 'slate';
import { SaksTypeEnum } from '../kodeverk';
import { Immutable } from '../types';
import { INewSmartEditorMetadata, ISmartEditorMetadata } from './metadata';

interface INewSmartEditor extends INewSmartEditorMetadata {
  content: Descendant[];
}

export interface ISmartEditor extends Omit<INewSmartEditor, 'templateId'>, ISmartEditorMetadata {}

export enum TemplateTypeEnum {
  NOTAT = 'NOTAT',
  GENERELL = 'GENERELL',
}

interface IMutableSmartEditorTemplate extends INewSmartEditor {
  type: SaksTypeEnum | TemplateTypeEnum;
}

export type ISmartEditorTemplate = Immutable<IMutableSmartEditorTemplate>;
