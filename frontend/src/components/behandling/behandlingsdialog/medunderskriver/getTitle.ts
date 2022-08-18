import { OppgaveType } from '../../../../types/kodeverk';

export const getTitleLowercase = (type: OppgaveType) =>
  type === OppgaveType.ANKE_I_TRYGDERETTEN ? 'fagansvarlig' : 'medunderskriver';

export const getTitleCapitalized = (type: OppgaveType) =>
  type === OppgaveType.ANKE_I_TRYGDERETTEN ? 'Fagansvarlig' : 'Medunderskriver';

export const getTitlePlural = (type: OppgaveType) =>
  type === OppgaveType.ANKE_I_TRYGDERETTEN ? 'fagansvarlige' : 'medunderskrivere';
