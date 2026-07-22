import { DistribusjonsType, type IParentDocument } from '@/types/documents/documents';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

export const hasTrFields = ({ dokumentTypeId, templateId }: IParentDocument) => {
  if (dokumentTypeId !== DistribusjonsType.EKSPEDISJONSBREV_TIL_TRYGDERETTEN) {
    return false;
  }

  return (
    templateId === TemplateIdEnum.EKSPEDISJONSBREV_TIL_TRYGDERETTEN ||
    templateId === TemplateIdEnum.GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR
  );
};
