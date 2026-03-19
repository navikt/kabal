import { HandlingEnum } from '@/types/documents/receivers';
import { Brevmottakertype } from '@/types/kodeverk';
import { type IFullmektig, type IPart, PartStatusEnum } from '@/types/oppgave-common';
import { TemplateIdEnum } from '@/types/smart-editor/template-enums';

const getTypeName = (type: Brevmottakertype): string => {
  switch (type) {
    case Brevmottakertype.KLAGER:
      return 'Klager';
    case Brevmottakertype.PROSESSFULLMEKTIG:
      return 'Fullmektig';
    case Brevmottakertype.SAKEN_GJELDER:
      return 'Saken gjelder';
    default:
      return '';
  }
};

export const getTypeNames = (types: Brevmottakertype[]): string => {
  const [first, second, third] = types;

  if (first === undefined) {
    return 'Ingen saksrolle funnet';
  }

  if (types.length === 1 || second === undefined) {
    return getTypeName(first);
  }

  if (types.length === 2 || third === undefined) {
    return `${getTypeName(first)} og ${getTypeName(second).toLowerCase()}`;
  }

  return `${getTypeName(first)}, ${getTypeName(second).toLowerCase()} og ${getTypeName(third).toLowerCase()}`;
};

export const getInitalHandling = (part: IPart | IFullmektig, templateId: TemplateIdEnum | undefined) =>
  templateId === TemplateIdEnum.OVERSENDELSESBREV &&
  part.statusList !== null &&
  part.statusList.some((s) => s.status === PartStatusEnum.RESERVERT_I_KRR || s.status === PartStatusEnum.DELT_ANSVAR)
    ? HandlingEnum.LOCAL_PRINT
    : HandlingEnum.AUTO;
