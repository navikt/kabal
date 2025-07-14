import type { Language } from '@app/types/texts/language';
import type { Descendant } from 'platejs';
import type { DistribusjonsType } from '../documents/documents';
import type { IOppgavebehandlingBaseParams } from '../oppgavebehandling/params';
import type { Immutable } from '../types';
import type { TemplateIdEnum } from './template-enums';

interface IMutableCreateSmartDocumentParams extends IOppgavebehandlingBaseParams {
  tittel: string;
  content: Descendant[];
  templateId: TemplateIdEnum;
  dokumentTypeId: DistribusjonsType;
  parentId: string | null;
  language: Language;
}

export type ICreateSmartDocumentParams = Immutable<IMutableCreateSmartDocumentParams>;
