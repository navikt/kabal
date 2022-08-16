import { Descendant } from 'slate';
import { deepFreeze } from '../../../functions/deep-freeze';
import { DocumentType } from '../../../types/documents/documents';
import { OppgaveType } from '../../../types/kodeverk';
import { ISmartEditorTemplate } from '../../../types/smart-editor/smart-editor';
import { TemplateIdEnum } from '../../../types/smart-editor/template-enums';
import { VERSION } from '../../rich-text/version';

const INITIAL_SLATE_VALUE: Descendant[] = [];

export const ANKEVEDTAK_TEMPLATE = deepFreeze<ISmartEditorTemplate>({
  templateId: TemplateIdEnum.ANKEVEDTAK,
  type: OppgaveType.ANKE,
  tittel: 'Ankevedtak (test)',
  content: INITIAL_SLATE_VALUE,
  version: VERSION,
  dokumentTypeId: DocumentType.VEDTAKSBREV,
});
