export const EXTERNAL_URL_GOSYS =
  process.env.NODE_ENV === 'development'
    ? 'https://gosys.dev.intern.nav.no/gosys'
    : 'https://gosys.intern.nav.no/gosys';

export const EXTERNAL_URL_MODIA =
  process.env.NODE_ENV === 'development'
    ? 'https://app-q1.adeo.no/modiapersonoversikt'
    : 'https://app.adeo.no/modiapersonoversikt';
