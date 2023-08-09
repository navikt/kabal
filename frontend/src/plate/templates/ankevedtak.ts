import { deepFreeze } from '@app/functions/deep-freeze';
import {
  createCurrentDate,
  createFooter,
  createHeader,
  createRegelverk,
  createSignature,
  createSimpleParagraph,
} from '@app/plate/templates/helpers';
import { DistribusjonsType } from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const ANKEVEDTAK_TEMPLATE = deepFreeze<IMutableSmartEditorTemplate>({
  templateId: TemplateIdEnum.ANKEVEDTAK,
  type: SaksTypeEnum.ANKE,
  tittel: 'Ankevedtak',
  content: [
    createCurrentDate(),
    createHeader(),
    createSimpleParagraph(),
    createSignature(),
    createFooter(),
    createRegelverk(),
  ],
  dokumentTypeId: DistribusjonsType.VEDTAKSBREV,
});
