import { Type } from 'typebox';
import { Compile } from 'typebox/compile';
import { getLogger } from '@/logger';

const log = getLogger('document-write-access-kafka-parser');

const PayloadType = Type.Array(Type.String());
const PayloadTypeChecked = Compile(PayloadType);

export const parseKafkaMessageValue = (value: string): string[] => {
  try {
    const parsed = JSON.parse(value);

    if (!PayloadTypeChecked.Check(parsed)) {
      log.warn({
        msg: 'Invalid Kafka message value',
        data: { parsed: JSON.stringify(parsed), value },
      });

      // Default to empty list for invalid message values.
      return [];
    }

    log.debug({
      msg: 'Deserialized Kafka message value',
      data: { parsed, value },
    });

    return parsed;
  } catch (error) {
    log.error({
      msg: 'Failed to deserialize Kafka message value',
      error,
      data: { value },
    });

    // Default to empty list for invalid message values.
    return [];
  }
};
