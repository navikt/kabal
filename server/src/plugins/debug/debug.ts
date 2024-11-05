import { isDeployed } from '@app/config/env';
import { formatMessage } from '@app/plugins/debug/formatting';
import { BODY_TYPE } from '@app/plugins/debug/types';
import { NAV_IDENT_PLUGIN_ID } from '@app/plugins/nav-ident';
import { EmojiIcons, sendToSlack } from '@app/slack';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyPlugin from 'fastify-plugin';

export const DEBUG_PLUGIN_ID = 'tab-id';

export const debugPlugin = fastifyPlugin(
  // biome-ignore lint/suspicious/useAwait: Needs to return a promise
  async (app) => {
    app.withTypeProvider<TypeBoxTypeProvider>().post(
      '/debug',
      {
        bodyLimit: 10 * 1024 * 1024,
        schema: {
          tags: ['debug'],
          body: BODY_TYPE,
          produces: ['application/json'],
        },
      },
      async (req, reply) => {
        if (isDeployed && req.body.reporter.navIdent !== req.navIdent) {
          return reply.status(403).send('Provided navIdent does not match the authenticated user.');
        }

        const { url, version, reporter, data } = req.body;

        const message = formatMessage(url, version, reporter, data);

        try {
          const sent = await sendToSlack(message, EmojiIcons.Kabal);

          if (!sent) {
            return reply.status(500).send('Failed to send debug info to Slack.');
          }

          return reply.status(200).send();
        } catch {
          return reply.status(500).send();
        }
      },
    );
  },
  { fastify: '5', name: DEBUG_PLUGIN_ID, dependencies: [NAV_IDENT_PLUGIN_ID] },
);
