export interface RedisOptions {
  /**
   * The URL of the Redis server.
   * @example 'redis://localhost:6379'
   */
  readonly url: string;
  /**
   * The username for the Redis server.
   * @example 'username'
   */
  readonly username?: string;
  /**
   * The password for the Redis server.
   * @example 'password'
   */
  readonly password?: string;
}
