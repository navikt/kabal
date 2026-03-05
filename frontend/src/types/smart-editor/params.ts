import type { DistribusjonsType } from '@app/types/documents/documents';
import type { IOppgavebehandlingBaseParams } from '@app/types/oppgavebehandling/params';
import type { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import type { Language } from '@app/types/texts/language';
import type { Immutable } from '@app/types/types';
import type { Descendant } from 'platejs';

interface IMutableCreateSmartDocumentParams extends IOppgavebehandlingBaseParams {
  tittel: string;
  content: Descendant[];
  templateId: TemplateIdEnum;
  dokumentTypeId: DistribusjonsType;
  parentId: string | null;
  language: Language;
}

export type ICreateSmartDocumentParams = Immutable<IMutableCreateSmartDocumentParams>;
