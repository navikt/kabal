import { Editor, Range } from 'slate';
import { FeatureToggles } from '../../../../hooks/use-feature-toggle';
import { ISmartEditorContext } from '../../../smart-editor/context/smart-editor-context';

export interface SafeEditor extends Editor {
  selection: Range;
}

export type FeatureFlags = Record<FeatureToggles, boolean>;

export interface HandlerFnArg {
  editor: SafeEditor;
  event: React.KeyboardEvent<HTMLDivElement>;
  context: ISmartEditorContext;
  featureFlags: FeatureFlags;
}

export type HandlerFn = (arg: HandlerFnArg) => void;
