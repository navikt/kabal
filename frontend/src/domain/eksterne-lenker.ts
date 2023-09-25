import { ENVIRONMENT } from '@app/environment';

export const EXTERNAL_URL_MODIA = ENVIRONMENT.isProduction
  ? 'https://app.adeo.no/modiapersonoversikt'
  : 'https://app-q1.adeo.no/modiapersonoversikt';
