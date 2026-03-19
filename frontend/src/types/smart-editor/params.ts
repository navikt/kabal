import type { Descendant } from 'platejs';
import type { DistribusjonsType } from '@/types/documents/documents';
import type { IOppgavebehandlingBaseParams } from '@/types/oppgavebehandling/params';
import type { TemplateIdEnum } from '@/types/smart-editor/template-enums';
import type { Language } from '@/types/texts/language';
import type { Immutable } from '@/types/types';

interface IMutableCreateSmartDocumentParams extends IOppgavebehandlingBaseParams {
  tittel: string;
  content: Descendant[];
  templateId: TemplateIdEnum;
  dokumentTypeId: DistribusjonsType;
  parentId: string | null;
  language: Language;
}

export type ICreateSmartDocumentParams = Immutable<IMutableCreateSmartDocumentParams>;
