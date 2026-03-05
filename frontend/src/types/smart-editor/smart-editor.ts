import type { INewSmartEditorMetadata } from '@app/types/smart-editor/metadata';
import type { GenericObject, Immutable } from '@app/types/types';
import type { Value } from 'platejs';

interface INewSmartEditor extends INewSmartEditorMetadata {
  richText: Value;
}

export interface IMutableSmartEditorTemplate extends INewSmartEditor, GenericObject {}

export type ISmartEditorTemplate = Immutable<IMutableSmartEditorTemplate>;
