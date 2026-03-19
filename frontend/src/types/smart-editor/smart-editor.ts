import type { Value } from 'platejs';
import type { INewSmartEditorMetadata } from '@/types/smart-editor/metadata';
import type { GenericObject, Immutable } from '@/types/types';

interface INewSmartEditor extends INewSmartEditorMetadata {
  richText: Value;
}

export interface IMutableSmartEditorTemplate extends INewSmartEditor, GenericObject {}

export type ISmartEditorTemplate = Immutable<IMutableSmartEditorTemplate>;
