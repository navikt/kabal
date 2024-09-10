import { isDeployed } from '@app/config/env';

export const KABAL_API_URL = isDeployed ? 'http://kabal-api' : 'https://kabal.intern.dev.nav.no/api/kabal-api';
