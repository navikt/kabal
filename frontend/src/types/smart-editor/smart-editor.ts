import { EditorValue } from '@app/plate/types';
import { GenericObject, Immutable } from '../types';
import { INewSmartEditorMetadata } from './metadata';

interface INewSmartEditor extends INewSmartEditorMetadata {
  richText: EditorValue;
}

export interface IMutableSmartEditorTemplate extends INewSmartEditor, GenericObject {}

export type ISmartEditorTemplate = Immutable<IMutableSmartEditorTemplate>;
