import type { DeprecatedTemplateSections } from '@app/plate/template-sections';
import type { DistribusjonsType } from '../documents/documents';
import type { TemplateIdEnum } from './template-enums';

export interface INewSmartEditorMetadata {
  templateId: TemplateIdEnum;
  tittel: string;
  dokumentTypeId: DistribusjonsType;
  deprecatedSections: DeprecatedTemplateSections[];
}
