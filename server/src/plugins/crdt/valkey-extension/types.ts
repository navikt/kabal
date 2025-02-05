export interface ValkeyOptions {
  /**
   * The URL of the Valkey server.
   * @example 'redis://localhost:6379'
   */
  readonly url: string;
  /**
   * The username for the Valkey server.
   * @example 'username'
   */
  readonly username?: string;
  /**
   * The password for the Valkey server.
   * @example 'password'
   */
  readonly password?: string;
}
