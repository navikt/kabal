import type { Language } from '@app/types/texts/language';
import type { TDescendant } from '@udecode/plate-common';
import type { Role } from '../bruker';
import type { DistribusjonsType } from '../documents/documents';
import type { IOppgavebehandlingBaseParams } from '../oppgavebehandling/params';
import type { Immutable } from '../types';
import type { TemplateIdEnum } from './template-enums';

interface IMutableCreateSmartDocumentParams extends IOppgavebehandlingBaseParams {
  tittel: string;
  content: TDescendant[];
  templateId: TemplateIdEnum;
  dokumentTypeId: DistribusjonsType;
  parentId: string | null;
  creatorIdent: string;
  creatorRole: Role.KABAL_SAKSBEHANDLING | Role.KABAL_ROL;
  language: Language;
}

export type ICreateSmartDocumentParams = Immutable<IMutableCreateSmartDocumentParams>;
