import type { DeprecatedTemplateSections } from '@app/plate/template-sections';
import type { DistribusjonsType } from '@app/types/documents/documents';
import type { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export interface INewSmartEditorMetadata {
  templateId: TemplateIdEnum;
  tittel: string;
  dokumentTypeId: DistribusjonsType;
  deprecatedSections: DeprecatedTemplateSections[];
}
