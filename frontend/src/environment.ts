enum EnvString {
  PROD = 'production',
  DEV = 'development',
  LOCAL = 'local',
}

interface EnvironmentVariables {
  readonly environment: EnvString;
  readonly version: string;
  readonly isProduction: boolean;
  readonly isDevelopment: boolean;
  readonly isLocal: boolean;
  readonly isDeployed: boolean;
}

class Environment implements EnvironmentVariables {
  public readonly environment: EnvString;
  public readonly version: string;
  public readonly isProduction: boolean;
  public readonly isDevelopment: boolean;
  public readonly isLocal: boolean;
  public readonly isDeployed: boolean;
  public readonly isAnsattDomain: boolean;

  constructor() {
    this.environment = this.getEnvironment();
    this.version = this.getVersion();
    this.isProduction = this.environment === EnvString.PROD;
    this.isDevelopment = this.environment === EnvString.DEV;
    this.isLocal = this.environment === EnvString.LOCAL;
    this.isDeployed = !this.isLocal;
    this.isAnsattDomain = this.getIsAnsattDomain();
  }

  private getEnvironment(): EnvString {
    const env = document.documentElement.getAttribute('data-environment');

    if (env === EnvString.PROD || env === EnvString.DEV || env === EnvString.LOCAL) {
      return env;
    }

    return EnvString.LOCAL;
  }

  private getVersion(): string {
    const version = document.documentElement.getAttribute('data-version');

    if (version === null || version === '{{VERSION}}') {
      return EnvString.LOCAL;
    }

    return version;
  }

  private getIsAnsattDomain(): boolean {
    if (this.isProduction) {
      return window.location.hostname.endsWith('.ansatt.nav.no');
    }

    if (this.isDevelopment) {
      return window.location.hostname.endsWith('.ansatt.dev.nav.no');
    }

    return false;
  }
}

export const ENVIRONMENT = new Environment();
