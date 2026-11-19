import { ELECTOR_GET_URL, NAIS_POD_NAME } from '@/config/config';
import { isObject } from '@/functions/functions';
import { getLogger, type Logger } from '@/logger';

const TIMEOUT_MS = 5_000;

export enum Leadership {
  LEADER = 'leader',
  FOLLOWER = 'follower',
}

/** Rejects when the elector fails or doesn't answer within 5 seconds, or when the signal is aborted. */
export type GetLeadership = (signal: AbortSignal) => Promise<Leadership>;

/**
 * Asks the Nais elector sidecar once whether this pod is the leader.
 * Without an elector, like when running locally, this pod is the leader.
 * Warns once per run of failures, like before the elector is ready. Logs when this pod becomes or stops being the leader.
 */
export const createGetLeadership = (
  electorUrl: string | undefined,
  podName: string,
  logger: Logger = getLogger('leader-election'),
): GetLeadership => {
  if (electorUrl === undefined) {
    return async () => Leadership.LEADER;
  }

  // Whether the last check failed, so a run of failures warns only once.
  let failing = false;
  // The last answer, so only changes are logged.
  let last: Leadership | null = null;

  return async (signal) => {
    const leader = await fetchLeader(electorUrl, signal).catch((error: unknown) => {
      if (!(signal.aborted || failing)) {
        logger.warn({ msg: 'Leader election failed', error });
        failing = true;
      }

      throw error;
    });

    if (failing) {
      logger.info({ msg: 'Leader election recovered' });
      failing = false;
    }

    const leadership = leader === podName ? Leadership.LEADER : Leadership.FOLLOWER;

    if (leadership !== last) {
      logger.info({
        msg: leadership === Leadership.LEADER ? 'This pod is the leader' : `This pod is not the leader, ${leader} is`,
      });
      last = leadership;
    }

    return leadership;
  };
};

const fetchLeader = async (electorUrl: string, signal: AbortSignal): Promise<string> => {
  const response = await fetch(electorUrl, { signal: AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)]) });

  if (!response.ok) {
    throw new Error(`Elector responded with status ${response.status.toString(10)}`);
  }

  const body: unknown = await response.json();

  if (isObject(body) && 'name' in body && typeof body.name === 'string') {
    return body.name;
  }

  throw new Error('Elector returned no leader name');
};

/** The elector names the leader by its pod name. */
export const getLeadership = createGetLeadership(ELECTOR_GET_URL, NAIS_POD_NAME);
