import type { DistribusjonsType } from '#shared/documents';
import type { DeprecatedTemplateSections } from '@/plate/template-sections';
import type { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export interface INewSmartEditorMetadata {
  templateId: TemplateIdEnum;
  tittel: string;
  dokumentTypeId: DistribusjonsType;
  deprecatedSections: DeprecatedTemplateSections[];
}
