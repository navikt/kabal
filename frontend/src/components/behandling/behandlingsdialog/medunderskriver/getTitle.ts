import { OppgaveType } from '../../../../types/kodeverk';

export const getTitle = (type: OppgaveType, capitalize = false) => {
  if (capitalize) {
    return type === OppgaveType.ANKE_I_TRYGDERETTEN ? 'Fagansvarlig' : 'Medunderskriver';
  }

  return type === OppgaveType.ANKE_I_TRYGDERETTEN ? 'fagansvarlig' : 'medunderskriver';
};
