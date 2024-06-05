import { describe, expect, it } from 'bun:test';
import { normalizePath } from './normalize-path';

describe('normalizePath', () => {
  it('should normalize path', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/kabal-api/api/behandlinger/12345/detaljer');
    const expected = '/kabal-api/api/behandlinger/:id/detaljer';
    expect(actual).toBe(expected);
  });

  it('should normalize path with UUID ID and subpath', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/kabal-api/api/behandlinger/123e4588-e89b-12d3-a456-426655440000/detaljer');
    const expected = '/kabal-api/api/behandlinger/:id/detaljer';
    expect(actual).toBe(expected);
  });

  it('should normalize path with UUID ID', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/kabal-api/api/behandlinger/123e4588-e89b-12d3-a456-426655440000');
    const expected = '/kabal-api/api/behandlinger/:id';
    expect(actual).toBe(expected);
  });

  it('should normalize path with numeric ID, without second api prefix', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/some-other-api/behandlinger/12345/detaljer');
    const expected = '/some-other-api/behandlinger/:id/detaljer';
    expect(actual).toBe(expected);
  });

  it('should normalize path UUID but without second api prefix', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/some-other-api/behandlinger/123e4588-e89b-12d3-a456-426655440000/detaljer');
    const expected = '/some-other-api/behandlinger/:id/detaljer';
    expect(actual).toBe(expected);
  });

  it('should normalize query params with NAV-ident', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/kabal-search/ansatte/oppgaver?sortering=FRIST&some-query=A123456');
    const expected = '/kabal-search/ansatte/oppgaver?sortering=FRIST&some-query=NAVIDENT';
    expect(actual).toBe(expected);
  });

  it('should normalize query params with 2 NAV-idents', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/kabal-search/ansatte/oppgaver?sortering=FRIST&some-query=A123456,B098765');
    const expected = '/kabal-search/ansatte/oppgaver?sortering=FRIST&some-query=NAVIDENT,NAVIDENT';
    expect(actual).toBe(expected);
  });

  it('should normalize path with NAV-ident', () => {
    expect.assertions(1);
    const actual = normalizePath('/api/kabal-search/ansatte/A123456');
    const expected = '/kabal-search/ansatte/:id';
    expect(actual).toBe(expected);
  });
});
