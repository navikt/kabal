import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export const hasPaaanketVedtaksdato = (templateId: TemplateIdEnum | undefined) =>
  templateId === TemplateIdEnum.EKSPEDISJONSBREV_TIL_TRYGDERETTEN;

export const hasLovhenvisning = (templateId: TemplateIdEnum | undefined) =>
  templateId === TemplateIdEnum.EKSPEDISJONSBREV_TIL_TRYGDERETTEN ||
  templateId === TemplateIdEnum.GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR;

export const hasForsterketRett = (templateId: TemplateIdEnum | undefined) =>
  templateId === TemplateIdEnum.EKSPEDISJONSBREV_TIL_TRYGDERETTEN ||
  templateId === TemplateIdEnum.GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR ||
  templateId === TemplateIdEnum.ETTERSENDING_TIL_TRYGDERETTEN ||
  templateId === TemplateIdEnum.GJENOPPTAKSBEGJÆRING_ETTERSENDING_TIL_TR;
