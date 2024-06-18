import { register } from 'prom-client';
import { VERSION } from '@app/config/config';
import { NAIS_NAMESPACE } from '@app/config/env';

register.setDefaultLabels({
  app_version: VERSION.substring(0, 7),
  namespace: NAIS_NAMESPACE,
});

export const registers = [register];
