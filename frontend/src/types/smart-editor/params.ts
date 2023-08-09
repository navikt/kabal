import { TDescendant } from '@udecode/plate-common';
import { EditorValue } from '@app/plate/types';
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
}

export type ICreateSmartDocumentParams = Immutable<IMutableCreateSmartDocumentParams>;

export type IGetSmartEditorParams = IDocumentParams;

export interface IUpdateSmartDocumentParams extends IGetSmartEditorParams {
  content: EditorValue;
  templateId?: TemplateIdEnum;
}
