import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export const hasPaaanketVedtaksdato = (templateId: TemplateIdEnum | undefined) =>
  templateId === TemplateIdEnum.EKSPEDISJONSBREV_TIL_TRYGDERETTEN ||
  templateId === TemplateIdEnum.SVAR_PÅ_PÅLEGG_OM_TILSVAR_I_ANKESAK;

export const hasLovhenvisning = (templateId: TemplateIdEnum | undefined) =>
  templateId === TemplateIdEnum.EKSPEDISJONSBREV_TIL_TRYGDERETTEN ||
  templateId === TemplateIdEnum.GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR ||
  templateId === TemplateIdEnum.SVAR_PÅ_PÅLEGG_OM_TILSVAR_I_ANKESAK;

export const hasForsterketRett = (templateId: TemplateIdEnum | undefined) =>
  templateId === TemplateIdEnum.EKSPEDISJONSBREV_TIL_TRYGDERETTEN ||
  templateId === TemplateIdEnum.GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR ||
  templateId === TemplateIdEnum.SVAR_PÅ_PÅLEGG_OM_TILSVAR_I_ANKESAK;
