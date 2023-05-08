import { addDays, format } from 'date-fns';
import { ISO_FORMAT } from '@app/components/date-picker/constants';
import { IVenteperiode } from '@app/types/oppgaver';

const VENTEPERIODE_DAYS = 30;

const TODAY = new Date();

export const getVenteperiode = (): IVenteperiode => ({
  from: format(TODAY, ISO_FORMAT),
  to: format(addDays(TODAY, VENTEPERIODE_DAYS), ISO_FORMAT),
  isExpired: false,
});
