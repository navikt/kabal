import { register } from 'prom-client';
import { PROXY_VERSION } from '@/config/config';
import { NAIS_NAMESPACE, POD_NAME } from '@/config/env';

register.setDefaultLabels({
  app_version: PROXY_VERSION.substring(0, 7),
  namespace: NAIS_NAMESPACE,
  pod_name: POD_NAME,
});

export const proxyRegister = register;
