import type { Value } from '@udecode/plate';
import type { GenericObject, Immutable } from '../types';
import type { INewSmartEditorMetadata } from './metadata';

interface INewSmartEditor extends INewSmartEditorMetadata {
  richText: Value;
}

export interface IMutableSmartEditorTemplate extends INewSmartEditor, GenericObject {}

export type ISmartEditorTemplate = Immutable<IMutableSmartEditorTemplate>;
