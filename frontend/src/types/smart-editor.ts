import { Descendant } from 'slate';
import { Immutable } from './types';

export interface INewSmartEditor {
  tittel: string; // ex. "Vedtak om klagebehandling 123".
  children: Descendant[];
}

export interface ISmartEditor extends INewSmartEditor {
  id: string; // UUID from backend.
}

interface IMutableSmartEditorTemplate extends INewSmartEditor {
  templateId: string;
}

export type ISmartEditorTemplate = Immutable<IMutableSmartEditorTemplate>;
