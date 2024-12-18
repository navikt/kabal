import { deepFreeze } from '@app/functions/deep-freeze';
import { ELEMENT_WRAPPER } from '@app/plate/plugins/element-types';
import { DistribusjonsType } from '@app/types/documents/documents';
import type { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { Value } from '@udecode/plate-common';
import { createSimpleParagraph } from './helpers';

const INITIAL_SLATE_VALUE: Value = [
  // createMaltekstseksjon(TemplateSections.VURDERINGEN),
  {
    type: ELEMENT_WRAPPER,
    children: [createSimpleParagraph('this is wrapper')],
  },
  createSimpleParagraph('her funker det'),
];

export const KLAGEVEDTAK_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.KLAGEVEDTAK_V2,
  tittel: 'Vedtak/beslutning (klage)',
  richText: INITIAL_SLATE_VALUE,
  dokumentTypeId: DistribusjonsType.VEDTAKSBREV,
});
