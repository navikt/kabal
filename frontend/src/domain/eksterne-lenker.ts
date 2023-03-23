import { ENVIRONMENT } from '@app/environment';

export const EXTERNAL_URL_GOSYS = ENVIRONMENT.isProduction
  ? 'https://gosys.intern.nav.no/gosys'
  : 'https://gosys.dev.intern.nav.no/gosys';

export const EXTERNAL_URL_MODIA = ENVIRONMENT.isProduction
  ? 'https://app.adeo.no/modiapersonoversikt'
  : 'https://app-q1.adeo.no/modiapersonoversikt';
