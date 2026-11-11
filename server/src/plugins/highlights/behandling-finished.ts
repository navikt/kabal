import { KafkaConsumer, type KafkaMessage } from '@/kafka/kafka-consumer';
import { getLogger } from '@/logger';
import type { HighlightRepository } from '@/plugins/highlights/repository';

const log = getLogger('highlights-behandling-finished');

/**
 * Deletes highlights when a behandling is finished, feilregistrert or deleted.
 * The group ID is shared by all pods, so each record is handled once and missed records are handled after restarts.
 * Ordered: a failed cleanup is retried before later records are committed. Cleanup is idempotent, so redelivery is harmless.
 * New groups start at the latest offset: highlights didn't exist before, so older records have nothing to clean up.
 */
export const createBehandlingFinishedConsumer = (repository: HighlightRepository) =>
  new KafkaConsumer((message) => onMessage(repository, message), crypto.randomUUID().replaceAll('-', ''), {
    topic: 'klage.behandling-endret.v2',
    groupId: 'kabal-frontend-highlights',
    spanName: 'kafka.process_behandling_endret',
    ordered: true,
  });

const onMessage = async (repository: HighlightRepository, { key: behandlingId, value, trace_id }: KafkaMessage) => {
  if (!isFinished(value)) {
    return;
  }

  await repository.deleteBehandling(behandlingId);
  log.debug({ msg: 'Deleted highlights for finished behandling', trace_id, data: { behandling_id: behandlingId } });
};

/** A missing value is a tombstone: the behandling is deleted. */
export const isFinished = (value: string | undefined): boolean => {
  if (value === undefined) {
    return true;
  }

  const behandling = parseJson(value);

  if (typeof behandling !== 'object' || behandling === null) {
    return false;
  }

  return (
    ('avsluttetAvSaksbehandlerTidspunkt' in behandling && behandling.avsluttetAvSaksbehandlerTidspunkt !== null) ||
    ('feilregistrert' in behandling && behandling.feilregistrert !== null)
  );
};

/** Malformed records are skipped rather than thrown, so they can't block the ordered consumer. */
const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch (error) {
    log.warn({ msg: 'Skipping malformed behandling record', error });

    return null;
  }
};
