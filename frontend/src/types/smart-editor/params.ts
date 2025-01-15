import type { Language } from '@app/types/texts/language';
import type { Descendant } from '@udecode/plate';
import type { Role } from '../bruker';
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
  creatorIdent: string;
  creatorRole: Role.KABAL_SAKSBEHANDLING | Role.KABAL_ROL;
  language: Language;
}

export type ICreateSmartDocumentParams = Immutable<IMutableCreateSmartDocumentParams>;
