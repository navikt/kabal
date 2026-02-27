import { describe, expect, it, mock } from 'bun:test';
import { sendStateless } from '@app/plugins/crdt/send-stateless';

// biome-ignore lint/suspicious/noEmptyBlockStatements: only a mock
const getSendStateless = () => mock(() => {});

describe('send-stateless', () => {
  it('should send plain string for old client versions', () => {
    const client_version = '2026-02-25T09:43:48';
    const send = getSendStateless();

    sendStateless(send, client_version, 'test-type', { trace_id: 'trace-id', span_id: 'span-id', tab_id: 'tab-id' });

    expect(send).toHaveBeenCalledWith('test-type');
    expect(send).not.toHaveBeenCalledWith(
      JSON.stringify({ type: 'test-type', trace_id: 'trace-id', span_id: 'span-id', tab_id: 'tab-id' }),
    );
  });

  it('should send JSON string for new client versions', () => {
    const client_version = '2026-03-25T09:43:48';
    const send = getSendStateless();

    sendStateless(send, client_version, 'test-type', {
      trace_id: 'trace-id',
      span_id: 'span-id',
      tab_id: 'tab-id',
    });

    expect(send).toHaveBeenCalledWith(
      JSON.stringify({ type: 'test-type', trace_id: 'trace-id', span_id: 'span-id', tab_id: 'tab-id' }),
    );
    expect(send).not.toHaveBeenCalledWith('test-type');
  });
});
