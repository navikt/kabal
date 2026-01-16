import { afterAll, beforeAll, describe, expect, it, mock } from 'bun:test';
import { createCapitalisePlugin } from '@app/plate/plugins/capitalise/capitalise';
import { ELEMENT_FOOTER, ELEMENT_HEADER, ELEMENT_SAKSNUMMER } from '@app/plate/plugins/element-types';
import { saksbehandlerPlugins } from '@app/plate/plugins/plugin-sets/saksbehandler';
import { replaceText, SearchReplacePlugin } from '@app/plate/plugins/search-replace/search-replace';
import { TemplateSections } from '@app/plate/template-sections';
import {
  createLabelContent,
  createMaltekst,
  createMaltekstseksjon,
  createPlaceHolder,
  createRedigerbarMaltekst,
  createSignature,
} from '@app/plate/templates/helpers';
import {
  type KabalValue,
  LabelContentSource,
  type ParagraphElement,
  type PlaceholderElement,
  TextAlign,
} from '@app/plate/types';
import { BaseParagraphPlugin, type Point, type TText } from 'platejs';
import { createPlateEditor, getEditorPlugin, type PlateEditor } from 'platejs/react';
import type { Selection } from 'slate';

const createP = (children: ParagraphElement['children']): ParagraphElement => ({
  type: BaseParagraphPlugin.key,
  align: TextAlign.LEFT,
  children,
});

type Marks = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  autoCapitalised?: boolean;
};

const createText = (text: string, marks?: Marks) => ({ text, ...marks });

const createSelection = (point: Point): Selection => ({ anchor: point, focus: point });

const createEditor = (value: KabalValue, selection?: Selection) =>
  createPlateEditor({ plugins: [...saksbehandlerPlugins, createCapitalisePlugin('some user')], value, selection });

const doSearchReplace = (editor: PlateEditor, search: string, replace: string) => {
  const { setOption } = getEditorPlugin(editor, SearchReplacePlugin);
  setOption('search', search);
  replaceText(editor, search, replace);
};

const createSeksjon = (children: (TText | PlaceholderElement)[], redigerbar = false) =>
  createMaltekstseksjon(
    TemplateSections.ANFOERSLER,
    'id',
    [],
    redigerbar
      ? [createRedigerbarMaltekst(TemplateSections.ANFOERSLER, [createP(children)])]
      : [createMaltekst(TemplateSections.ANFOERSLER, [createP(children)])],
  );

const type = (editor: PlateEditor, text: string) => {
  for (const char of text) {
    editor.tf.insertText(char);
  }
};

describe('search-replace', () => {
  beforeAll(() => {
    mock.module('@app/hooks/settings/manager', () => ({
      SETTINGS_MANAGER: {
        get: () => 'true',
      },
    }));
  });

  afterAll(async () => {
    const originalSettingsManager = await import('@app/hooks/settings/manager');
    mock.module('@app/hooks/settings/manager', () => originalSettingsManager);
  });

  it('should replace simple text correctly', () => {
    const text = createText('replace keep replace keep replace keep');
    const editor = createEditor([createP([text])]);

    doSearchReplace(editor, 'replace', 'REPLACED');
    expect(editor.api.string([])).toBe('REPLACED keep REPLACED keep REPLACED keep');
    expect(editor.children).toEqual([createP([createText('REPLACED keep REPLACED keep REPLACED keep')])]);
  });

  it('should replace text spanning multiple text nodes', () => {
    const a = createText('re', { bold: true });
    const b = createText('pl', { underline: true });
    const c = createText('ace', { italic: true });
    const d = createText(' keep ');
    const e = createText('re', { bold: true });
    const f = createText('pl', { underline: true });
    const g = createText('ace', { italic: true });
    const h = createText(' keep');

    const editor = createEditor([createP([a, b, c, d, e, f, g, h])]);

    doSearchReplace(editor, 'replace', 'REPLACED');

    expect(editor.api.string([])).toBe('REPLACED keep REPLACED keep');

    expect(editor.children).toEqual([
      createP([
        createText('REPLACED', { bold: true }),
        createText(' keep '),
        createText('REPLACED', { bold: true }),
        createText(' keep'),
      ]),
    ]);
  });

  it('should work with auto-capitalised text', () => {
    const editor = createEditor([createP([{ text: '' }])], createSelection({ path: [0, 0], offset: 0 }));
    type(editor, 'test. test.');

    expect(editor.api.string([])).toBe('Test. Test.');

    doSearchReplace(editor, 'test', 'replaced');
    expect(editor.api.string([])).toBe('Replaced. Replaced.');
    expect(editor.children).toEqual([
      createP([
        createText('R', { autoCapitalised: true }),
        createText('eplaced. '),
        createText('R', { autoCapitalised: true }),
        createText('eplaced.'),
      ]),
    ]);
  });

  it('should replace text in redigerbar maltekst', () => {
    const maltekstseksjon = createSeksjon([createText('replace keep replace keep replace keep')], true);
    const editor = createEditor([maltekstseksjon]);

    doSearchReplace(editor, 'replace', 'REPLACED');

    expect(editor.api.string([])).toBe('REPLACED keep REPLACED keep REPLACED keep');
    expect(editor.children).toEqual([createSeksjon([createText('REPLACED keep REPLACED keep REPLACED keep')], true)]);
  });

  it('should not replace text in (non-redigerbar) maltekst', () => {
    const editor = createEditor([createSeksjon([createText('dont replace this')])]);

    doSearchReplace(editor, 'dont replace this', 'REPLACED');

    expect(editor.api.string([])).toBe('dont replace this');
    expect(editor.children).toEqual([createSeksjon([createText('dont replace this')])]);
  });

  it('should not replace text in header', () => {
    const editor = createEditor([{ type: ELEMENT_HEADER, children: [{ text: '' }], content: 'dont replace this' }]);

    doSearchReplace(editor, 'dont replace this', 'REPLACED');

    expect(editor.children).toEqual([{ type: ELEMENT_HEADER, children: [{ text: '' }], content: 'dont replace this' }]);
  });

  it('should not replace text in footer', () => {
    const editor = createEditor([{ type: ELEMENT_FOOTER, children: [{ text: '' }], content: 'dont replace this' }]);

    doSearchReplace(editor, 'dont replace this', 'REPLACED');

    expect(editor.children).toEqual([{ type: ELEMENT_FOOTER, children: [{ text: '' }], content: 'dont replace this' }]);
  });

  it('should not replace text in date field', () => {
    const editor = createEditor([{ ...createSignature(), saksbehandler: { name: 'dont replace this' } }]);

    doSearchReplace(editor, 'dont replace this', 'REPLACED');

    expect(editor.children).toEqual([{ ...createSignature(), saksbehandler: { name: 'dont replace this' } }]);
  });

  it('should not replace text in label-content', () => {
    const editor = createEditor([
      { ...createLabelContent(LabelContentSource.SAKEN_GJELDER_NAME), label: 'Saken gjelder', result: '1337' },
    ]);

    doSearchReplace(editor, 'Saken gjelder', 'REPLACED');

    expect(editor.children).toEqual([
      { ...createLabelContent(LabelContentSource.SAKEN_GJELDER_NAME), label: 'Saken gjelder', result: '1337' },
    ]);
  });

  it('should only replace value (not label) in saksnummer', () => {
    const editor = createEditor([
      {
        type: ELEMENT_SAKSNUMMER,
        isInitialized: true,
        children: [{ text: '' }, createPlaceHolder('Saksnummer', false, [{ text: 'replace me' }]), { text: '1234' }],
      },
    ]);

    doSearchReplace(editor, 'Saksnummer', 'REPLACED LABEL');
    doSearchReplace(editor, 'replace me', 'REPLACED VALUE');

    expect(editor.children).toEqual([
      {
        type: ELEMENT_SAKSNUMMER,
        isInitialized: true,
        children: [
          { text: '' },
          createPlaceHolder('Saksnummer', false, [{ text: 'REPLACED VALUE' }]),
          { text: '1234' },
        ],
      },
    ]);
  });

  it('should replace text in placeholder inside non-redigerbar maltekst', () => {
    const editor = createEditor([
      createSeksjon([
        createText('keep keep keep '),
        createPlaceHolder('Placeholder', false, [{ text: 'replace me' }]),
        createText(' keep keep keep'),
      ]),
    ]);

    doSearchReplace(editor, 'keep', 'REPLACED');
    doSearchReplace(editor, 'replace me', 'REPLACED');

    expect(editor.api.string([])).toBe('keep keep keep REPLACED keep keep keep');

    expect(editor.children).toEqual([
      createSeksjon([
        createText('keep keep keep '),
        createPlaceHolder('Placeholder', false, [{ text: 'REPLACED' }]),
        createText(' keep keep keep'),
      ]),
    ]);
  });

  it('should not replace maltekst hits that are only partly inside placeholder', () => {
    const editor = createEditor([
      createSeksjon([
        createText('keep this, '),
        createPlaceHolder('Placeholder', false, [{ text: 'replace this' }]),
        createText(' and keep this. ', { bold: true }),

        createText('dont r'),
        createPlaceHolder('Placeholder', false, [{ text: 'eplace this' }]),
        createText(', but keep this. ', { italic: true }),

        createText('keep this, dont '),
        createPlaceHolder('Placeholder', false, [{ text: 'replace thi' }]),
        createText('s, and keep this.'),
      ]),
    ]);

    doSearchReplace(editor, 'keep', 'REPLACED');
    doSearchReplace(editor, 'replace this', 'REPLACED');

    expect(editor.api.string([])).toBe(
      'keep this, REPLACED and keep this. dont replace this, but keep this. keep this, dont replace this, and keep this.',
    );

    expect(editor.children).toEqual([
      createSeksjon([
        createText('keep this, '),
        createPlaceHolder('Placeholder', false, [{ text: 'REPLACED' }]),
        createText(' and keep this. ', { bold: true }),

        createText('dont r'),
        createPlaceHolder('Placeholder', false, [{ text: 'eplace this' }]),
        createText(', but keep this. ', { italic: true }),

        createText('keep this, dont '),
        createPlaceHolder('Placeholder', false, [{ text: 'replace thi' }]),
        createText('s, and keep this.'),
      ]),
    ]);
  });
});
