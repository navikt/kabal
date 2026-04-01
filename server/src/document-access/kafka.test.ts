import { describe, expect, it } from 'bun:test';
import { parseKafkaMessageValue } from '@/document-access/kafka';

describe('parseKafkaMessageValue', () => {
  it('should parse a valid JSON string array', () => {
    expect.assertions(1);
    const result = parseKafkaMessageValue('["a","b","c"]');
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('should return an empty array for an empty JSON array', () => {
    expect.assertions(1);
    const result = parseKafkaMessageValue('[]');
    expect(result).toEqual([]);
  });

  it('should return an empty array for invalid JSON', () => {
    expect.assertions(1);
    const result = parseKafkaMessageValue('not-json');
    expect(result).toEqual([]);
  });

  it('should return an empty array for an empty string', () => {
    expect.assertions(1);
    const result = parseKafkaMessageValue('');
    expect(result).toEqual([]);
  });

  it('should return an empty array when payload is not a string array', () => {
    expect.assertions(1);
    const result = parseKafkaMessageValue('[1, 2, 3]');
    expect(result).toEqual([]);
  });

  it('should return an empty array when payload is an object', () => {
    expect.assertions(1);
    const result = parseKafkaMessageValue('{"key": "value"}');
    expect(result).toEqual([]);
  });

  it('should return an empty array when payload is a mixed array', () => {
    expect.assertions(1);
    const result = parseKafkaMessageValue('["a", 1, "b"]');
    expect(result).toEqual([]);
  });
});
