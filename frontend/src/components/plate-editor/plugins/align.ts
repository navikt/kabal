import { ELEMENT_PARAGRAPH } from '@udecode/plate';
import { EditorPlatePlugin } from '@app/components/plate-editor/types';

export const alignPlugin: Partial<EditorPlatePlugin> = {
  inject: { props: { validTypes: [ELEMENT_PARAGRAPH] } },
};
