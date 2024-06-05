import { describe, expect, it } from 'bun:test';
import {
  EXPRESSION_SCORE_FACTOR,
  Expression,
  SPACE_REGEX,
  SplitQuery,
  WORD_SCORE,
  splitQuery,
} from '@app/components/smart-editor/gode-formuleringer/split-query';

describe('split query', () => {
  it('should handle empty queries', () => {
    expect.assertions(1);
    expect(splitQuery('')).toStrictEqual(createResult());
  });

  it('should split a single word query', () => {
    expect.assertions(1);
    expect(splitQuery('test')).toStrictEqual(createResult([w`test`]));
  });

  it('should split a single expression query', () => {
    expect.assertions(1);
    expect(splitQuery('"test"')).toStrictEqual(createResult([e`test`]));
  });

  it('should split queries with three words', () => {
    expect.assertions(1);
    expect(splitQuery('test 123 qwe')).toStrictEqual(createResult([w`test`, w`123`, w`qwe`]));
  });

  it('should split queries with one-word expressiona and words', () => {
    expect.assertions(1);
    expect(splitQuery('test "123" qwe')).toStrictEqual(createResult([w`test`, e`123`, w`qwe`]));
  });

  it('should split queries with a two-word expression and words', () => {
    expect.assertions(1);
    expect(splitQuery('test "123 abc" qwe')).toStrictEqual(createResult([w`test`, e`123 abc`, w`qwe`]));
  });

  it('should split queries with a three-word expression and words', () => {
    expect.assertions(1);
    expect(splitQuery('test "123 abc asd" qwe')).toStrictEqual(createResult([w`test`, e`123 abc asd`, w`qwe`]));
  });

  it('should split queries with an expression at the start and a word', () => {
    expect.assertions(1);
    expect(splitQuery('"123 abc asd" test')).toStrictEqual(createResult([e`123 abc asd`, w`test`]));
  });

  it('should split queries with an expression at the end and a word', () => {
    expect.assertions(1);
    expect(splitQuery('test "123 abc asd"')).toStrictEqual(createResult([w`test`, e`123 abc asd`]));
  });

  it('should preserve spaces at end of expressions', () => {
    expect.assertions(1);
    expect(splitQuery('"123 abc "')).toStrictEqual(createResult([e`123 abc `]));
  });

  it('should preserve spaces at start of expressions', () => {
    expect.assertions(1);
    expect(splitQuery('" 123 abc"')).toStrictEqual(createResult([e` 123 abc`]));
  });

  it('should ignore empty expressions', () => {
    expect.assertions(1);
    expect(splitQuery('""')).toStrictEqual(createResult());
  });

  it('should split multiple expressions and a word', () => {
    expect.assertions(1);
    expect(splitQuery('"quick" "brown" asdf')).toStrictEqual(createResult([e`quick`, e`brown`, w`asdf`]));
  });

  it('should work split multiple words and a complex expression', () => {
    expect.assertions(1);
    expect(splitQuery('dokument rett syk "Høyesteretts dom HR-2018-2344-A"')).toStrictEqual(
      createResult([w`dokument`, w`rett`, w`syk`, e`Høyesteretts dom HR-2018-2344-A`]),
    );
  });

  it('should preserve multiple spaces in the middle of expressions', () => {
    expect.assertions(1);
    expect(splitQuery('"ord  med  to  mellomrom"')).toStrictEqual(createResult([e`ord  med  to  mellomrom`]));
  });

  it('should ignore multiple spaces between and around words', () => {
    expect.assertions(1);
    expect(splitQuery('  ord  med  to  mellomrom  ')).toStrictEqual(
      createResult([w`ord`, w`med`, w`to`, w`mellomrom`]),
    );
  });
});

const createResult = (expressions: Expression[] = []): SplitQuery => ({
  expressions,
  maxScore: expressions.reduce((acc, { score }) => acc + score, 0),
});

/** Create strict expression. */
const e = (exp: TemplateStringsArray): Expression => {
  const expression = exp.toString().toLowerCase();

  return { expression, score: expression.split(SPACE_REGEX).length * WORD_SCORE * EXPRESSION_SCORE_FACTOR };
};

/** Create simple word expression. */
const w = (expression: TemplateStringsArray): Expression => ({ expression: expression.toString(), score: WORD_SCORE });
