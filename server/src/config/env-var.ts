import { getLogger } from '../logger';

const log = getLogger('env-var');

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
