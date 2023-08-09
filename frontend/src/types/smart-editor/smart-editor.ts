import { EditorValue } from '@app/plate/types';
import { SaksTypeEnum } from '../kodeverk';
import { GenericObject, Immutable } from '../types';
import { INewSmartEditorMetadata, ISmartEditorMetadata } from './metadata';

interface INewSmartEditor extends INewSmartEditorMetadata {
  content: EditorValue;
}

export interface ISmartEditor extends Omit<INewSmartEditor, 'templateId'>, ISmartEditorMetadata {}

export enum TemplateTypeEnum {
  NOTAT = 'NOTAT',
  GENERELL = 'GENERELL',
}

export interface IMutableSmartEditorTemplate extends INewSmartEditor, GenericObject {
  type: SaksTypeEnum | TemplateTypeEnum;
}

export type ISmartEditorTemplate = Immutable<IMutableSmartEditorTemplate>;
