import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export const hasPaaanketVedtaksdato = (templateId: TemplateIdEnum | undefined) =>
  templateId === TemplateIdEnum.EKSPEDISJONSBREV_TIL_TRYGDERETTEN ||
  templateId === TemplateIdEnum.TILSVAR_TIL_TRYGDERETTEN;

export const hasLovhenvisning = (templateId: TemplateIdEnum | undefined) =>
  templateId === TemplateIdEnum.EKSPEDISJONSBREV_TIL_TRYGDERETTEN ||
  templateId === TemplateIdEnum.GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR ||
  templateId === TemplateIdEnum.TILSVAR_TIL_TRYGDERETTEN;

export const hasForsterketRett = (templateId: TemplateIdEnum | undefined) =>
  templateId === TemplateIdEnum.EKSPEDISJONSBREV_TIL_TRYGDERETTEN ||
  templateId === TemplateIdEnum.GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR ||
  templateId === TemplateIdEnum.TILSVAR_TIL_TRYGDERETTEN;
