import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { getLogger } from '@/logger';
import { BehandlingStatus } from '@/plugins/highlights/behandling-status';
import {
  BehandlingFinishedError,
  getClosedEvent,
  type HighlightRepository,
  type HighlightServerEvent,
} from '@/plugins/highlights/repository';
import {
  HIGHLIGHT_CHANGES_BODY,
  HIGHLIGHT_CHANGES_BODY_LIMIT,
  HIGHLIGHT_EVENTS_PARAMS,
  HIGHLIGHTS_PARAMS,
  HIGHLIGHTS_QUERYSTRING,
} from '@/plugins/highlights/types';
import { registerOpenStream } from '@/shutdown';

const log = getLogger('highlights-routes');

const HEARTBEAT_INTERVAL_MS = 30_000;
/** Makes the client wait 10 seconds before reconnecting, when the behandling's status can't be read. */
const STATUS_RETRY_MESSAGE = 'retry: 10000\n\n';

enum BehandlingCheck {
  /** Stream the user's highlights, or `closed` if the behandling is finished. */
  STREAM = 'stream',
  /** Send only `closed`, without marking the behandling as finished. */
  CLOSE = 'close',
  /** End the stream, so the client reconnects later. */
  RETRY = 'retry',
}

interface Dependencies {
  repository: HighlightRepository;
  /** The NAV-ident of a validated token, or `null`. */
  getNavIdent: (req: FastifyRequest) => Promise<string | null>;
  getBehandlingStatus: (req: FastifyRequest, behandlingId: string) => Promise<BehandlingStatus>;
}

export const registerHighlightRoutes = (
  app: FastifyInstance,
  { repository, getNavIdent, getBehandlingStatus }: Dependencies,
) => {
  app
    .withTypeProvider<TypeBoxTypeProvider>()
    .get(
      '/highlights/:behandlingId/events',
      { schema: { tags: ['highlights'], params: HIGHLIGHT_EVENTS_PARAMS } },
      async (req, reply) => {
        const navIdent = await getNavIdent(req);

        if (navIdent === null) {
          return reply.status(401).send();
        }

        const { behandlingId } = req.params;
        const check = await checkBehandling(repository, await getBehandlingStatus(req, behandlingId), behandlingId);

        reply.hijack();
        reply.raw.writeHead(200, {
          'content-type': 'text/event-stream',
          'cache-control': 'no-cache',
          connection: 'keep-alive',
        });

        // EventSource gives up on error statuses, but reconnects when a stream ends.
        if (check === BehandlingCheck.RETRY) {
          reply.raw.end(STATUS_RETRY_MESSAGE);

          return;
        }

        // Error statuses make Kabal's event manager reconnect, so `closed` stops the client and hides highlighting.
        if (check === BehandlingCheck.CLOSE) {
          reply.raw.end(formatEvent(getClosedEvent()));

          return;
        }

        reply.raw.flushHeaders();

        const unsubscribe = repository.subscribe(
          { navIdent, behandlingId },
          (event) => {
            reply.raw.write(formatEvent(event));

            // The client stops reconnecting after `closed`.
            if (event.name === 'closed') {
              reply.raw.end();
            }
          },
          // The client reconnects and gets a new snapshot.
          (error) => {
            log.warn({ msg: 'Highlights event stream failed', error });
            reply.raw.end();
          },
        );
        const heartbeat = setInterval(() => reply.raw.write(': heartbeat\n\n'), HEARTBEAT_INTERVAL_MS);
        // End the stream cleanly on shutdown. The client reconnects to another pod.
        const unregisterOpenStream = registerOpenStream(() => reply.raw.end());

        reply.raw.once('close', () => {
          unsubscribe();
          clearInterval(heartbeat);
          unregisterOpenStream();
        });
      },
    )
    .post(
      '/highlights/:behandlingId/:documentId',
      {
        bodyLimit: HIGHLIGHT_CHANGES_BODY_LIMIT,
        schema: {
          tags: ['highlights'],
          params: HIGHLIGHTS_PARAMS,
          querystring: HIGHLIGHTS_QUERYSTRING,
          body: HIGHLIGHT_CHANGES_BODY,
        },
      },
      async (req, reply) => {
        const navIdent = await getNavIdent(req);

        if (navIdent === null) {
          return reply.status(401).send();
        }

        try {
          return await repository.save({ navIdent, ...req.params, format: req.query.format }, req.body);
        } catch (error) {
          if (error instanceof BehandlingFinishedError) {
            return reply.status(409).send('Behandlingen er avsluttet. Markeringene er slettet.');
          }

          throw error;
        }
      },
    );
};

const checkBehandling = async (
  repository: HighlightRepository,
  status: BehandlingStatus,
  behandlingId: string,
): Promise<BehandlingCheck> => {
  switch (status) {
    case BehandlingStatus.ACTIVE:
      return BehandlingCheck.STREAM;
    case BehandlingStatus.FORBIDDEN:
      return BehandlingCheck.CLOSE;
    case BehandlingStatus.UNKNOWN:
      return BehandlingCheck.RETRY;
    case BehandlingStatus.FINISHED:
      return markFinished(repository, behandlingId);
  }
};

/**
 * Behandlinger finished before the Kafka consumer started, or longer ago than the finished marker lives, have no
 * marker, so it is set here. Saves are only made after the snapshot, so this also rejects later saves. Safe to repeat.
 */
const markFinished = async (repository: HighlightRepository, behandlingId: string): Promise<BehandlingCheck> => {
  try {
    await repository.deleteBehandling(behandlingId);

    return BehandlingCheck.STREAM;
  } catch (error) {
    log.warn({ msg: 'Failed to mark behandling as finished', error, data: { behandlingId } });

    return BehandlingCheck.RETRY;
  }
};

const formatEvent = ({ name, data }: HighlightServerEvent): string => `event: ${name}\ndata: ${data}\n\n`;
