// Preloaded before tests (see bunfig.toml). Several production modules read
// required env vars at import time, and importing the access service also
// constructs a Kafka Consumer object for its singleton. Unit tests never
// connect to Kafka or call these endpoints — they inject fakes — so the values
// below are deliberately non-functional placeholders that exist only to satisfy
// the module-load `requiredEnvString` checks. The `.invalid` TLD (RFC 6761)
// guarantees they can never resolve.

const PLACEHOLDER_ENV: Record<string, string> = {
  NAIS_TOKEN_ENDPOINT: 'https://token-endpoint.invalid',
  KAFKA_BROKERS: 'broker.kafka.invalid:9092',
  KAFKA_PRIVATE_KEY: 'placeholder-not-used-in-tests',
  KAFKA_CERTIFICATE: 'placeholder-not-used-in-tests',
  KAFKA_CA: 'placeholder-not-used-in-tests',
};

for (const [key, value] of Object.entries(PLACEHOLDER_ENV)) {
  const existing = process.env[key];

  if (existing === undefined || existing.length === 0) {
    process.env[key] = value;
  }
}
