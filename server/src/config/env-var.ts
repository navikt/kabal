import { getLogger } from '../logger';

const log = getLogger('env-var');

const optionalEnvString = (name: string): string | undefined => {
  const envVariable = process.env[name];

  if (typeof envVariable === 'string' && envVariable.length !== 0) {
    return envVariable;
  }

  return undefined;
};

export const requiredEnvString = (name: string, defaultValue?: string): string => {
  const envVariable = process.env[name];

  if (typeof envVariable === 'string' && envVariable.length !== 0) {
    return envVariable;
  }

  if (typeof defaultValue === 'string' && defaultValue.length !== 0) {
    return defaultValue;
  }

  log.error({ msg: `Missing required environment variable '${name}'.` });
  process.exit(1);
};

export const requiredEnvJson = <T>(name: string, defaultValue?: T): T => {
  const json = requiredEnvString(name, '');

  try {
    if (json.length === 0) {
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

export const requiredEnvUrl = (name: string, defaultValue?: string): string => {
  const envString = requiredEnvString(name, defaultValue);

  if (envString.startsWith('http://')) {
    return envString.replace('http://', 'https://');
  }

  if (envString.startsWith('https://')) {
    return envString;
  }
  log.error({ msg: `Environment variable '${name}' is not a URL. Value: '${envString}'.` });
  process.exit(1);
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

  log.error({
    msg: `Could not parse environment variable '${name}' as integer/number. Parsed value: '${
      envString ?? 'undefined'
    }'.`,
  });
  process.exit(1);
};
