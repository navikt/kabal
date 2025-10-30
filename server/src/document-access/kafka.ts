import { getLogger } from '@app/logger';
import { Type } from 'typebox';
import { Compile } from 'typebox/compile';

const log = getLogger('document-write-access-kafka-parser');

const PayloadType = Type.Array(Type.String());
const PayloadTypeChecked = Compile(PayloadType);

export const parseKafkaMessageValue = (value: string, trace_id: string): string[] | null => {
  if (value.length === 0) {
    log.debug({
      msg: 'Received empty Kafka message value - interpreting as tombstone',
      trace_id,
      data: { value, parsed: null },
    });
    /**
     * Workaround for a bug in the Kafka library; it does not differentiate between empty string and tombstone (null) values.
     * Since we need tombstones, we treat empty strings as tombstones.
     * The producer will send null values for tombstones and never send empty strings.
     */
    return null;
  }

  try {
    const parsed = JSON.parse(value);

    if (!PayloadTypeChecked.Check(parsed)) {
      log.warn({
        msg: 'Invalid Kafka message value',
        trace_id,
        data: { parsed: JSON.stringify(parsed), value },
      });

      // Default to empty list for invalid message values.
      return [];
    }

    log.debug({
      msg: 'Deserialized Kafka message value',
      trace_id,
      data: { parsed, value },
    });

    return parsed;
  } catch (error) {
    log.error({
      msg: 'Failed to deserialize Kafka message value',
      trace_id,
      error,
      data: { value },
    });

    // Default to empty list for invalid message values.
    return [];
  }
};
