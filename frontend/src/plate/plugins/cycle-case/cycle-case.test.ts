import { describe, expect, it, test } from 'bun:test';
import { cycleCase } from '@app/plate/plugins/cycle-case/cycle-case';
import { saksbehandlerPlugins } from '@app/plate/plugins/plugin-sets/saksbehandler';
import { type KabalValue, type ParagraphElement, TextAlign } from '@app/plate/types';
import { BaseParagraphPlugin } from '@platejs/core';
import { createPlateEditor } from '@platejs/core/react';
import type { Point, Selection } from 'slate';

const createP = (children: ParagraphElement['children']): ParagraphElement => ({
  type: BaseParagraphPlugin.key,
  align: TextAlign.LEFT,
  children,
});

const createText = (text: string, bold = false) => ({ text, bold });

const createEditor = (value: KabalValue, selection: Selection) =>
  createPlateEditor({ plugins: saksbehandlerPlugins, selection, value });

const createSelection = (anchor: Point, focus: Point): Selection => ({ anchor, focus });

describe('cycleCase', () => {
  it('should cycle lower case to capital case', () => {
    const children = [createP([createText('just a simple node')])];
    const selection = createSelection({ path: [0, 0], offset: 0 }, { path: [0, 0], offset: 18 });
    const editor = createEditor(children, selection);

    cycleCase(editor);

    expect(editor.children).toStrictEqual([createP([createText('Just A Simple Node')])]);
    expect(editor.selection).toStrictEqual(selection);
  });

  it('should cycle upper case to lower case', () => {
    const children = [createP([createText('JUST A SIMPLE NODE')])];
    const selection = createSelection({ path: [0, 0], offset: 0 }, { path: [0, 0], offset: 18 });
    const editor = createEditor(children, selection);

    cycleCase(editor);

    expect(editor.children).toStrictEqual([createP([createText('just a simple node')])]);
    expect(editor.selection).toStrictEqual(selection);
  });

  it('should cycle capital case to upper case', () => {
    const children = [createP([createText('Just A Simple Node')])];
    const selection = createSelection({ path: [0, 0], offset: 0 }, { path: [0, 0], offset: 18 });
    const editor = createEditor(children, selection);

    cycleCase(editor);

    expect(editor.children).toStrictEqual([createP([createText('JUST A SIMPLE NODE')])]);
    expect(editor.selection).toStrictEqual(selection);
  });

  it('should cycle cases', () => {
    const children = [createP([createText('Just A Simple Node')])];
    const selection = createSelection({ path: [0, 0], offset: 0 }, { path: [0, 0], offset: 18 });
    const editor = createEditor(children, selection);

    cycleCase(editor);
    expect(editor.children).toStrictEqual([createP([createText('JUST A SIMPLE NODE')])]);
    expect(editor.selection).toStrictEqual(selection);
    cycleCase(editor);
    expect(editor.children).toStrictEqual([createP([createText('just a simple node')])]);
    expect(editor.selection).toStrictEqual(selection);
    cycleCase(editor);
    expect(editor.children).toStrictEqual([createP([createText('Just A Simple Node')])]);
    expect(editor.selection).toStrictEqual(selection);
    cycleCase(editor);
    expect(editor.children).toStrictEqual([createP([createText('JUST A SIMPLE NODE')])]);
    expect(editor.selection).toStrictEqual(selection);
  });

  it('should cycle marked text node', () => {
    const children = [createP([createText('just a simple node', true)])];
    const selection = createSelection({ path: [0, 0], offset: 0 }, { path: [0, 0], offset: 18 });
    const editor = createEditor(children, selection);

    cycleCase(editor);

    expect(editor.children).toStrictEqual([createP([createText('Just A Simple Node', true)])]);
    expect(editor.selection).toStrictEqual(selection);
  });

  it('should cycle when whole words have marks', () => {
    const just = createText('just', true);
    const a = createText('a', true);
    const simple = createText('simple', true);
    const node = createText('node', true);
    const space = createText(' ');
    const children = [createP([just, space, a, space, simple, space, node])];

    const selection = createSelection({ path: [0, 0], offset: 0 }, { path: [0, 6], offset: 4 });
    const editor = createEditor(children, selection);

    cycleCase(editor);

    const Just = createText('Just', true);
    const A = createText('A', true);
    const Simple = createText('Simple', true);
    const Node = createText('Node', true);
    const expectedChildren = [createP([Just, space, A, space, Simple, space, Node])];

    expect(editor.children).toStrictEqual(expectedChildren);
    expect(editor.selection).toStrictEqual(selection);
  });

  it('should cycle when words are partially marked', () => {
    const ju = createText('ju', true);
    const st = createText('st ');
    const a = createText('a ', true);
    const sim = createText('sim');
    const ple = createText('ple ', true);
    const no = createText('no');
    const de = createText('de', true);
    const children = [createP([ju, st, a, sim, ple, no, de])];

    const selection = createSelection({ path: [0, 0], offset: 0 }, { path: [0, 6], offset: 4 });
    const editor = createEditor(children, selection);

    cycleCase(editor);

    const Ju = createText('Ju', true);
    const st2 = createText('st ');
    const A = createText('A ', true);
    const Sim = createText('Sim');
    const ple2 = createText('ple ', true);
    const No = createText('No');
    const de2 = createText('de', true);
    const expectedChildren = [createP([Ju, st2, A, Sim, ple2, No, de2])];

    expect(editor.children).toStrictEqual(expectedChildren);
    expect(editor.selection).toStrictEqual(selection);
  });

  it('should cycle selected block', () => {
    const firstParagraph = createP([createText('just a simple node')]);
    const secondParagraph = createP([createText('another block here')]);
    const thirdParagraph = createP([createText('and a third one')]);
    const children = [firstParagraph, secondParagraph, thirdParagraph];

    const selection = createSelection({ path: [1, 0], offset: 0 }, { path: [1, 0], offset: 18 });
    const editor = createEditor(children, selection);

    cycleCase(editor);

    const expectedSecondParagraph = createP([createText('Another Block Here')]);
    const expectedChildren = [firstParagraph, expectedSecondParagraph, thirdParagraph];

    expect(editor.children).toStrictEqual(expectedChildren);
    expect(editor.selection).toStrictEqual(selection);
  });

  it('should cycle across blocks', () => {
    const firstParagraph = createP([createText('just a simple node')]);
    const secondParagraph = createP([createText('another block here')]);
    const children = [firstParagraph, secondParagraph];

    const selection = createSelection({ path: [0, 0], offset: 0 }, { path: [1, 0], offset: 18 });
    const editor = createEditor(children, selection);

    cycleCase(editor);

    const expectedFirstParagraph = createP([createText('Just A Simple Node')]);
    const expectedSecondParagraph = createP([createText('Another Block Here')]);
    const expectedChildren = [expectedFirstParagraph, expectedSecondParagraph];

    expect(editor.children).toStrictEqual(expectedChildren);
    expect(editor.selection).toStrictEqual(selection);
  });

  it('should cycle partially selected text nodes across blocks', () => {
    const firstParagraph = createP([createText('just a simple node')]);
    const secondParagraph = createP([createText('another block here')]);
    const children = [firstParagraph, secondParagraph];

    // First and last word not selected
    const selection = createSelection({ path: [0, 0], offset: 5 }, { path: [1, 0], offset: 14 });
    const editor = createEditor(children, selection);

    cycleCase(editor);

    const expectedFirstParagraph = createP([createText('just A Simple Node')]);
    const expectedSecondParagraph = createP([createText('Another Block here')]);
    const expectedChildren = [expectedFirstParagraph, expectedSecondParagraph];

    expect(editor.children).toStrictEqual(expectedChildren);
    expect(editor.selection).toStrictEqual(selection);
  });

  it('should cycle partially marked nodes across blocks', () => {
    const JU = createText('JU', true);
    const ST = createText('ST ');
    const A = createText('A ', true);
    const SIM = createText('SIM');
    const PLE = createText('PLE ', true);
    const NO = createText('NO');
    const DE = createText('DE', true);
    const firstParagraph = createP([JU, ST, A, SIM, PLE, NO, DE]);

    const ANO = createText('ANO');
    const THER = createText('THER ', true);
    const BLO = createText('BLO');
    const CK = createText('CK ', true);
    const HE = createText('HE');
    const RE = createText('RE', true);
    const secondParagraph = createP([ANO, THER, BLO, CK, HE, RE]);

    const children = [firstParagraph, secondParagraph];

    // First and last char not selected
    const selection = createSelection({ path: [0, 0], offset: 1 }, { path: [1, 5], offset: 1 });
    const editor = createEditor(children, createSelection({ path: [0, 0], offset: 1 }, { path: [1, 5], offset: 1 }));

    cycleCase(editor);

    const Ju = createText('Ju', true); // First char is uppercase
    const st = createText('st ');
    const a = createText('a ', true);
    const sim = createText('sim');
    const ple = createText('ple ', true);
    const no = createText('no');
    const de = createText('de', true);
    const expectedFirstParagraph = createP([Ju, st, a, sim, ple, no, de]);

    const ano = createText('ano');
    const ther = createText('ther ', true);
    const blo = createText('blo');
    const ck = createText('ck ', true);
    const he = createText('he');
    const rE = createText('rE', true); // Last char is uppercase

    const expectedSecondParagraph = createP([ano, ther, blo, ck, he, rE]);
    const expectedChildren = [expectedFirstParagraph, expectedSecondParagraph];

    expect(editor.children).toStrictEqual(expectedChildren);
    expect(editor.selection).toStrictEqual(selection);
  });

  it('should cycle case when selection is collapsed', () => {
    const children = [createP([createText('JUST A SIMPLE NODE')])];
    const point = { path: [0, 0], offset: 10 };
    const selection = createSelection(point, point);
    const editor = createEditor(children, selection);

    cycleCase(editor);

    expect(editor.children).toStrictEqual([createP([createText('JUST A simple NODE')])]);
    expect(editor.selection).toStrictEqual(selection);
  });

  it('should cycle case in selected part of a word', () => {
    const children = [createP([createText('JUSTASIMPLENODE')])];
    const selection = createSelection({ path: [0, 0], offset: 5 }, { path: [0, 0], offset: 11 });
    const editor = createEditor(children, selection);

    cycleCase(editor);
    expect(editor.children).toStrictEqual([createP([createText('JUSTAsimpleNODE')])]);
    expect(editor.selection).toStrictEqual(selection);
    cycleCase(editor);
    expect(editor.children).toStrictEqual([createP([createText('JUSTASimpleNODE')])]);
    expect(editor.selection).toStrictEqual(selection);
    cycleCase(editor);
    expect(editor.children).toStrictEqual([createP([createText('JUSTASIMPLENODE')])]);
    expect(editor.selection).toStrictEqual(selection);
    cycleCase(editor);
    expect(editor.children).toStrictEqual([createP([createText('JUSTAsimpleNODE')])]);
    expect(editor.selection).toStrictEqual(selection);
  });

  describe('should cycle case on partially marked word when selection is collapsed', () => {
    test('alternating bold', () => {
      const JUST_A = createText('JUST A ');
      const S = createText('S', true);
      const I = createText('I');
      const M = createText('M', true);
      const P = createText('P');
      const L = createText('L', true);
      const E = createText('E');
      const NODE = createText(' NODE', true);
      const children = [createP([JUST_A, S, I, M, P, L, E, NODE])];
      const point = { path: [0, 4], offset: 0 };
      const selection = createSelection(point, point);
      const editor = createEditor(children, selection);

      cycleCase(editor);

      const s = createText('s', true);
      const i = createText('i');
      const m = createText('m', true);
      const p = createText('p');
      const l = createText('l', true);
      const e = createText('e');
      const expectedChildren = [createP([JUST_A, s, i, m, p, l, e, NODE])];

      expect(editor.children).toStrictEqual(expectedChildren);
      expect(editor.selection).toStrictEqual(selection);
    });

    test('longer parts with bold', () => {
      const COU = createText('COU', true);
      const NTE = createText('NTE');
      const RRE = createText('RRE', true);
      const VOL = createText('VOL');
      const UTI = createText('UTI', true);
      const ONA = createText('ONA');
      const RIE = createText('RIE', true);
      const S = createText('S');

      const children = [createP([COU, NTE, RRE, VOL, UTI, ONA, RIE, S])];
      const point = { path: [0, 3], offset: 1 };
      const selection = createSelection(point, point);
      const editor = createEditor(children, selection);

      cycleCase(editor);

      const cou = createText('cou', true);
      const nte = createText('nte');
      const rre = createText('rre', true);
      const vol = createText('vol');
      const uti = createText('uti', true);
      const ona = createText('ona');
      const rie = createText('rie', true);
      const s = createText('s');

      const expectedChildren = [createP([cou, nte, rre, vol, uti, ona, rie, s])];

      expect(editor.children).toStrictEqual(expectedChildren);
      expect(editor.selection).toStrictEqual(selection);
    });
  });

  it('should cycle case when selection is collapsed in first word of a block', () => {
    const firstChild = createP([createText('JUST A SIMPLE NODE')]);
    const secondChild = createP([createText('ANOTHER BLOCK HERE')]);
    const point = { path: [1, 0], offset: 4 };
    const selection = createSelection(point, point);
    const children = [firstChild, secondChild];
    const editor = createEditor(children, selection);

    cycleCase(editor);

    const expectedSecondChild = createP([createText('another BLOCK HERE')]);
    const expectedChildren = [firstChild, expectedSecondChild];

    expect(editor.children).toStrictEqual(expectedChildren);
    expect(editor.selection).toStrictEqual(selection);
  });

  it('should cycle case when selection is collapsed in last word of a block', () => {
    const firstChild = createP([createText('JUST A SIMPLE NODE')]);
    const secondChild = createP([createText('ANOTHER BLOCK HERE')]);
    const point = { path: [0, 0], offset: 16 };
    const selection = createSelection(point, point);
    const children = [firstChild, secondChild];
    const editor = createEditor(children, selection);

    cycleCase(editor);

    const expectedFirstChild = createP([createText('JUST A SIMPLE node')]);
    const expectedChildren = [expectedFirstChild, secondChild];

    expect(editor.children).toStrictEqual(expectedChildren);
    expect(editor.selection).toStrictEqual(selection);
  });
});
