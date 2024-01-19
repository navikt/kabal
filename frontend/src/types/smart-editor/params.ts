import { TDescendant } from '@udecode/plate-common';
import { EditorValue } from '@app/plate/types';
import { Role } from '../bruker';
import { IDocumentParams } from '../documents/common-params';
import { DistribusjonsType } from '../documents/documents';
import { IOppgavebehandlingBaseParams } from '../oppgavebehandling/params';
import { Immutable } from '../types';
import { TemplateIdEnum } from './template-enums';

interface IMutableCreateSmartDocumentParams extends IOppgavebehandlingBaseParams {
  tittel: string;
  content: TDescendant[];
  templateId: TemplateIdEnum | null;
  dokumentTypeId: DistribusjonsType;
  parentId: string | null;
  creatorIdent: string;
  creatorRole: Role.KABAL_SAKSBEHANDLING | Role.KABAL_ROL;
}

export type ICreateSmartDocumentParams = Immutable<IMutableCreateSmartDocumentParams>;

export interface IUpdateSmartDocumentParams extends IDocumentParams {
  content: EditorValue;
  templateId?: TemplateIdEnum;
  version: number;
}
