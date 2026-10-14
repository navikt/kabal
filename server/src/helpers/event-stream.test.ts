import { afterEach, describe, expect, it, mock } from 'bun:test';
import { PassThrough } from 'node:stream';
import Fastify from 'fastify';

const logger = await import('@/logger');
const noop = () => undefined;

mock.module('@/logger', () => ({
  ...logger,
  getLogger: () => ({ debug: noop, info: noop, warn: noop, error: noop }),
}));

const { createGracefulEventStream, isEventStream } = await import('@/helpers/event-stream');
const { closeServer, resetShutdownState } = await import('@/shutdown');

afterEach(() => resetShutdownState());

const buildApp = (upstream: PassThrough, onUpstreamError: (error: Error) => void = () => undefined) => {
  const app = Fastify();
  app.get('/events', (_, reply) =>
    reply.type('text/event-stream').send(createGracefulEventStream(upstream, onUpstreamError)),
  );
  return app;
};

const tick = () => new Promise((resolve) => setTimeout(resolve, 10));

describe('isEventStream', () => {
  it('should detect event stream content types', () => {
    expect(isEventStream('text/event-stream')).toBe(true);
    expect(isEventStream('text/event-stream;charset=UTF-8')).toBe(true);
    expect(isEventStream('application/json')).toBe(false);
    expect(isEventStream('text/event-streaming')).toBe(false);
    expect(isEventStream(undefined)).toBe(false);
  });
});

describe('createGracefulEventStream', () => {
  it('should pass through events and end when upstream ends', async () => {
    const upstream = new PassThrough();
    const response = buildApp(upstream).inject({ method: 'GET', url: '/events' });

    upstream.write('data: 1\n\n');
    upstream.end('data: 2\n\n');

    const res = await response;
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('data: 1\n\ndata: 2\n\n');
  });

  it('should end the response cleanly when upstream fails', async () => {
    const upstream = new PassThrough();
    const errors: Error[] = [];
    const response = buildApp(upstream, (error) => errors.push(error)).inject({ method: 'GET', url: '/events' });

    upstream.write('data: 1\n\n');
    await tick();
    upstream.destroy(new Error('other side closed'));

    const res = await response;
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('data: 1\n\n');
    expect(errors.map((e) => e.message)).toEqual(['other side closed']);
  });

  it('should end the response cleanly when upstream closes without ending', async () => {
    const upstream = new PassThrough();
    const errors: Error[] = [];
    const response = buildApp(upstream, (error) => errors.push(error)).inject({ method: 'GET', url: '/events' });

    upstream.write('data: 1\n\n');
    await tick();
    upstream.destroy();

    const res = await response;
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('data: 1\n\n');
    expect(errors.map((e) => 'code' in e && e.code)).toEqual(['ERR_STREAM_PREMATURE_CLOSE']);
  });

  it('should destroy upstream when the client disconnects', async () => {
    const upstream = new PassThrough();
    const errors: Error[] = [];
    const downstream = createGracefulEventStream(upstream, (error) => errors.push(error));

    downstream.destroy();
    await tick();

    expect(upstream.destroyed).toBe(true);
    expect(errors).toEqual([]);
  });

  it('should end open streams cleanly on shutdown', async () => {
    const upstream = new PassThrough();
    const errors: Error[] = [];
    const response = buildApp(upstream, (error) => errors.push(error)).inject({ method: 'GET', url: '/events' });

    upstream.write('data: 1\n\n');
    await tick();
    await closeServer();

    const res = await response;
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('data: 1\n\n');
    expect(upstream.destroyed).toBe(true);
    expect(errors).toEqual([]);
  });

  it('should end streams opened after shutdown immediately', async () => {
    await closeServer();

    const upstream = new PassThrough();
    const res = await buildApp(upstream).inject({ method: 'GET', url: '/events' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('');
    expect(upstream.destroyed).toBe(true);
  });
});
