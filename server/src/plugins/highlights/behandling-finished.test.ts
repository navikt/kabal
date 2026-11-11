import { describe, expect, it } from 'bun:test';
import { isFinished } from '@/plugins/highlights/behandling-finished';

describe('isFinished', () => {
  it('is finished when avsluttet, feilregistrert or deleted', () => {
    expect(isFinished(JSON.stringify({ avsluttetAvSaksbehandlerTidspunkt: '2026-01-01T12:00:00' }))).toBe(true);
    expect(isFinished(JSON.stringify({ avsluttetAvSaksbehandlerTidspunkt: null, feilregistrert: '2026-01-01' }))).toBe(
      true,
    );
    expect(isFinished(undefined)).toBe(true);
  });

  it('is not finished while in progress', () => {
    expect(isFinished(JSON.stringify({ avsluttetAvSaksbehandlerTidspunkt: null, feilregistrert: null }))).toBe(false);
  });

  it('skips malformed records instead of throwing', () => {
    expect(isFinished('{')).toBe(false);
  });
});
