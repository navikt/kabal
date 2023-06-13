import { Descendant } from 'slate';
import { deepFreeze } from '@app/functions/deep-freeze';
import { DistribusjonsType } from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { ISmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { VERSION } from '../../rich-text/version';

const INITIAL_SLATE_VALUE: Descendant[] = [];

export const ANKEVEDTAK_TEMPLATE = deepFreeze<ISmartEditorTemplate>({
  templateId: TemplateIdEnum.ANKEVEDTAK,
  type: SaksTypeEnum.ANKE,
  tittel: 'Ankevedtak',
  content: INITIAL_SLATE_VALUE,
  version: VERSION,
  dokumentTypeId: DistribusjonsType.VEDTAKSBREV,
});
