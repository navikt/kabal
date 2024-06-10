import { getLogger } from '@app/logger';

const log = getLogger('env-var');

const optionalEnvString = (name: string): string | undefined => {
  const envVariable = process.env[name];

  if (typeof envVariable === 'string') {
    return envVariable;
  }

  return undefined;
};

export const requiredEnvString = (name: string, defaultValue?: string): string => {
  const envVariable = process.env[name];

  if (typeof envVariable === 'string' && envVariable.length !== 0) {
    return envVariable;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  log.error({ msg: `Missing required environment variable '${name}'.` });
  process.exit(1);
};

export const requiredEnvJson = <T>(name: string, defaultValue?: T): T => {
  const json = requiredEnvString(name, '');

  try {
    if (json.length === 0) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }

      throw new Error('Empty string');
    }

    return JSON.parse(json);
  } catch (error) {
    log.error({ msg: `Invalid JSON in environment variable '${name}'.`, error });

    if (typeof defaultValue !== 'undefined') {
      return defaultValue;
    }
    process.exit(1);
  }
};

export const requiredEnvNumber = (name: string, defaultValue?: number): number => {
  const envString = optionalEnvString(name);
  const parsed = typeof envString === 'undefined' ? NaN : Number.parseInt(envString, 10);

  if (Number.isInteger(parsed)) {
    return parsed;
  }

  if (typeof defaultValue === 'number') {
    return defaultValue;
  }

  const env = envString ?? 'undefined';

  log.error({
    msg: `Could not parse environment variable '${name}' as integer/number. Parsed value: '${env}'.`,
  });
  process.exit(1);
};
