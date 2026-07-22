import type { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export interface BaseFieldProps {
  templateId: TemplateIdEnum | undefined;
  dokumentId: string;
  disabled?: boolean;
}
