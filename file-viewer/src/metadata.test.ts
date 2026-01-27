import { afterEach, describe, expect, test } from 'bun:test';
import { getMetadata } from '@app/metadata';

describe('getMetadata', () => {
  afterEach(() => {
    const element = document.getElementById('file-viewer-metadata');

    if (element !== null) {
      element.remove();
    }
  });

  const insertMetadataElement = (content?: string) => {
    const element = document.createElement('script');
    element.id = 'file-viewer-metadata';
    element.type = 'application/json';

    if (content !== undefined) {
      element.textContent = content;
    }

    document.body.appendChild(element);
  };

  test('returns null when element does not exist', () => {
    expect(getMetadata()).toBeNull();
  });

  test('returns null when element has no text content', () => {
    insertMetadataElement();

    expect(getMetadata()).toBeNull();
  });

  test('returns null when element has empty text content', () => {
    insertMetadataElement('');

    expect(getMetadata()).toBeNull();
  });

  test('returns null when element contains invalid JSON', () => {
    insertMetadataElement('not valid json {{{');

    expect(getMetadata()).toBeNull();
  });

  test('returns parsed metadata when element contains valid JSON', () => {
    const metadata = {
      navIdent: 'Z123456',
      files: [{ variants: 'PDF' as const, title: 'test.pdf', url: '/api/files/123' }],
    };

    insertMetadataElement(JSON.stringify(metadata));

    expect(getMetadata()).toEqual(metadata);
  });
});
