import type { DeprecatedTemplateSections } from '@/plate/template-sections';
import type { DistribusjonsType } from '@/types/documents/documents';
import type { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export interface INewSmartEditorMetadata {
  templateId: TemplateIdEnum;
  tittel: string;
  dokumentTypeId: DistribusjonsType;
  deprecatedSections: DeprecatedTemplateSections[];
}
