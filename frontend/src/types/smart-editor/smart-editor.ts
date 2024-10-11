import type { EditorValue } from '@app/plate/types';
import type { GenericObject, Immutable } from '../types';
import type { INewSmartEditorMetadata } from './metadata';

interface INewSmartEditor extends INewSmartEditorMetadata {
  richText: EditorValue;
}

export interface IMutableSmartEditorTemplate extends INewSmartEditor, GenericObject {}

export type ISmartEditorTemplate = Immutable<IMutableSmartEditorTemplate>;
