import { describe, expect, it, mock } from 'bun:test';
import { sendStateless } from '@app/plugins/crdt/send-stateless';
import type { Connection } from '@hocuspocus/server';

const getConnection = () =>
  ({
    // biome-ignore lint/suspicious/noEmptyBlockStatements: only a mock
    sendStateless: mock(() => {}),
  }) as unknown as Connection;

describe('send-stateless', () => {
  it('should send plain string for old client versions', () => {
    const client_version = '2026-02-25T09:43:48';
    const connection = getConnection();

    sendStateless(connection, client_version, 'test-type', {
      trace_id: 'trace-id',
      span_id: 'span-id',
      tab_id: 'tab-id',
    });

    expect(connection.sendStateless).toHaveBeenCalledWith('test-type');
    expect(connection.sendStateless).not.toHaveBeenCalledWith(
      JSON.stringify({ type: 'test-type', trace_id: 'trace-id', span_id: 'span-id', tab_id: 'tab-id' }),
    );
  });

  it('should send JSON string for new client versions', () => {
    const client_version = '2026-03-25T09:43:48';
    const connection = getConnection();

    sendStateless(connection, client_version, 'test-type', {
      trace_id: 'trace-id',
      span_id: 'span-id',
      tab_id: 'tab-id',
    });

    expect(connection.sendStateless).toHaveBeenCalledWith(
      JSON.stringify({ type: 'test-type', trace_id: 'trace-id', span_id: 'span-id', tab_id: 'tab-id' }),
    );
    expect(connection.sendStateless).not.toHaveBeenCalledWith('test-type');
  });
});
