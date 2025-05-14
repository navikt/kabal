import { expect, it } from 'bun:test';
import { describe } from 'bun:test';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { type BaseDocument, type BaseTemplate, getTitle } from './get-title';

describe('getTitle', () => {
  it('should use default title when there are no other documents', () => {
    expect.assertions(1);
    const result = getTitle([], getTemplate('bar'));
    expect(result).toBe('bar');
  });

  it('should use default title for no matches', () => {
    expect.assertions(1);
    const result = getTitle([d`foo`, d`baz`], getTemplate('bar'));
    expect(result).toBe('bar');
  });

  it('should add (1) in title for one exact match', () => {
    expect.assertions(1);
    const result = getTitle([d`foo`, d`bar`, d`baz`], getTemplate('bar'));
    expect(result).toBe('bar (1)');
  });

  it('should add (1) for multiple exact match', () => {
    expect.assertions(1);
    const result = getTitle([d`foo`, d`bar`, d`bar`], getTemplate('bar'));
    expect(result).toBe('bar (1)');
  });

  it('should add (2) in title when (1) is the higest number in existing documents', () => {
    expect.assertions(1);
    const result = getTitle([d`foo`, d`bar (1)`, d`bar`], getTemplate('bar'));
    expect(result).toBe('bar (2)');
  });

  it('should add (1) in title when other titles consist of (2) and (3)', () => {
    expect.assertions(1);
    const result = getTitle([d`bar`, d`bar (2)`, d`bar (3)`], getTemplate('bar'));
    expect(result).toBe('bar (1)');
  });

  it('should add (3) in title when other titles consist of (1), (2), (4) and (5)', () => {
    expect.assertions(1);
    const result = getTitle([d`bar (2)`, d`bar (5)`, d`bar (1)`, d`bar (4)`], getTemplate('bar'));
    expect(result).toBe('bar (3)');
  });

  it('should return use default title for no complete matches', () => {
    expect.assertions(1);
    const result = getTitle([d`bartest`, d`bartest (1)`], getTemplate('bar'));
    expect(result).toBe('bar');
  });

  it('should enforce "Klagevedtak" as document name for KLAGEVEDTAK templates', () => {
    expect.assertions(1);
    const result = getTitle([], getTemplate('foo', TemplateIdEnum.KLAGEVEDTAK_V2));
    expect(result).toBe('Klagevedtak');
  });

  it('should enforce "Omgjøring av klagevedtak" as document name for ANKEVEDTAK templates', () => {
    expect.assertions(1);
    const result = getTitle([], getTemplate('foo', TemplateIdEnum.ANKEVEDTAK));
    expect(result).toBe('Omgjøring av klagevedtak');
  });

  it('should only count with enforced names for KLAGEVEDTAK templates', () => {
    expect.assertions(1);
    const result = getTitle(
      [d`foo`, d`Klagevedtak (1)`, d`Klagevedtak`],
      getTemplate('foo', TemplateIdEnum.KLAGEVEDTAK_V2),
    );
    expect(result).toBe('Klagevedtak (2)');
  });

  it('should only count with enforced names for ANKEVEDTAK templates', () => {
    expect.assertions(1);
    const result = getTitle(
      [d`foo`, d`Omgjøring av klagevedtak (1)`, d`Omgjøring av klagevedtak`],
      getTemplate('foo', TemplateIdEnum.ANKEVEDTAK),
    );
    expect(result).toBe('Omgjøring av klagevedtak (2)');
  });
});

const d = (tittel: TemplateStringsArray): BaseDocument => ({ tittel: tittel.toString(), parentId: null });

const getTemplate = (tittel: string, templateId = TemplateIdEnum.GENERELT_BREV): BaseTemplate => ({
  templateId,
  tittel,
});
