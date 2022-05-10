import { Descendant } from 'slate';
import { VERSION } from '../../components/rich-text/version';
import { IDocumentParams } from '../documents/common-params';
import { IOppgavebehandlingBaseParams } from '../oppgavebehandling/params';
import { Immutable } from '../types';
import { TemplateIdEnum } from './template-enums';

interface IMutableCreateSmartDocumentParams extends IOppgavebehandlingBaseParams {
  tittel: string;
  content: Descendant[];
  templateId: TemplateIdEnum | null;
}

export type ICreateSmartDocumentParams = Immutable<IMutableCreateSmartDocumentParams>;

export type IGetSmartEditorParams = IDocumentParams;

export interface IUpdateSmartDocumentParams extends IGetSmartEditorParams {
  content: Descendant[];
  templateId?: TemplateIdEnum;
  version?: typeof VERSION;
}

export type IPatchSmartDocumentParams = IGetSmartEditorParams;
