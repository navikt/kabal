import { MAX_MONTHS_FROM_TODAY } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/constants';
import type { IForlengetBehandlingstid } from '@app/redux-api/forlenget-behandlingstid';
import { BehandlingstidUnitType } from '@app/types/svarbrev';
import { addMonths, addWeeks, isAfter, startOfDay } from 'date-fns';

const NOW = startOfDay(new Date());
const MAX_DATE = addMonths(NOW, MAX_MONTHS_FROM_TODAY);

const NO_PREV_FRIST_ERROR = 'Fristen kan ikke være mer enn fire måneder frem i tid';
const PREV_FRIST_ERROR = 'Ny frist må være senere enn forrige varslet frist';

export const validateBehandlingstid = (
  {
    varsletBehandlingstidUnitTypeId,
    varsletBehandlingstidUnits,
    varsletFrist,
  }: IForlengetBehandlingstid['behandlingstid'],
  prevVarsletFrist: string | null,
  varselTypeIsOriginal: boolean,
): string | undefined => {
  if (varsletFrist !== null) {
    return validateDate(varsletFrist, prevVarsletFrist);
  }

  if (varsletBehandlingstidUnits !== null) {
    return validateUnits(
      varsletBehandlingstidUnits,
      varsletBehandlingstidUnitTypeId,
      prevVarsletFrist,
      varselTypeIsOriginal,
    );
  }

  return undefined;
};

export const validateUnits = (
  units: number | null,
  typeId: BehandlingstidUnitType,
  prevVarsletFrist: string | null,
  varselTypeIsOriginal: boolean,
): string | undefined => {
  if (units === null) {
    return undefined;
  }

  if (prevVarsletFrist !== null) {
    const prevVarsletFristDate = new Date(prevVarsletFrist);

    if (typeId === BehandlingstidUnitType.WEEKS && !isAfter(addWeeks(NOW, units), prevVarsletFristDate)) {
      return PREV_FRIST_ERROR;
    }

    if (typeId === BehandlingstidUnitType.MONTHS && !isAfter(addMonths(NOW, units), prevVarsletFristDate)) {
      return PREV_FRIST_ERROR;
    }
  }

  if (varselTypeIsOriginal) {
    return undefined;
  }

  if (typeId === BehandlingstidUnitType.WEEKS && isAfter(addWeeks(NOW, units), MAX_DATE)) {
    return NO_PREV_FRIST_ERROR;
  }

  if (typeId === BehandlingstidUnitType.MONTHS && isAfter(addMonths(NOW, units), MAX_DATE)) {
    return NO_PREV_FRIST_ERROR;
  }

  return undefined;
};

export const validateDate = (varsletFrist: string | null, prevVarsletFrist: string | null): string | undefined => {
  if (varsletFrist === null) {
    return undefined;
  }

  if (prevVarsletFrist !== null && !isAfter(new Date(varsletFrist), new Date(prevVarsletFrist))) {
    return PREV_FRIST_ERROR;
  }

  if (isAfter(new Date(varsletFrist), MAX_DATE)) {
    return NO_PREV_FRIST_ERROR;
  }

  return undefined;
};
