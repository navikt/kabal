export const optionalEnvString = (name: string): string | undefined => {
  const envVariable = process.env[name];

  if (typeof envVariable === 'string' && envVariable.length > 0) {
    return envVariable;
  }

  return undefined;
};

export const requiredEnvString = (name: string, defaultValue?: string): string => {
  const envVariable = process.env[name];

  if (typeof envVariable === 'string' && envVariable.length > 0) {
    return envVariable;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Missing required environment variable '${name}'.`);
};

export const requiredEnvNumber = (name: string, defaultValue?: number): number => {
  const envString = optionalEnvString(name);
  const parsed = typeof envString === 'undefined' ? Number.NaN : Number.parseInt(envString, 10);

  if (Number.isInteger(parsed)) {
    return parsed;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  const env = envString ?? 'undefined';

  throw new Error(`Could not parse environment variable '${name}' as integer/number. Parsed value: '${env}'.`);
};
