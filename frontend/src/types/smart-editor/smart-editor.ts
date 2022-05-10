import { Descendant } from 'slate';
import { OppgaveType } from '../kodeverk';
import { Immutable } from '../types';
import { INewSmartEditorMetadata, ISmartEditorMetadata } from './metadata';

export interface INewSmartEditor extends INewSmartEditorMetadata {
  content: Descendant[];
}

export interface ISmartEditor extends Omit<INewSmartEditor, 'templateId'>, ISmartEditorMetadata {}

export enum TemplateTypeEnum {
  GENERELL = 'GENERELL',
}

interface IMutableSmartEditorTemplate extends INewSmartEditor {
  type: OppgaveType | TemplateTypeEnum;
}

export type ISmartEditorTemplate = Immutable<IMutableSmartEditorTemplate>;
