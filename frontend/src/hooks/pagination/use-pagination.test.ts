import { usePagination } from '../../hooks/pagination/use-pagination';

describe('pagination', () => {
  it('1 page, 5 items, current 1', () => {
    expect.assertions(1);
    const expected = [1];
    const actual = usePagination(5, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  it('2 pages, 15 items, current 2', () => {
    expect.assertions(1);
    const expected = [1, 2];
    const actual = usePagination(15, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  it('1 page, current 1', () => {
    expect.assertions(1);
    const expected = [1];
    const actual = usePagination(10, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  it('2 pages, current 1', () => {
    expect.assertions(1);
    const expected = [1, 2];
    const actual = usePagination(20, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  it('3 pages, current 1', () => {
    expect.assertions(1);
    const expected = [1, 2, 3];
    const actual = usePagination(30, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  it('4 pages, current 1', () => {
    expect.assertions(1);
    const expected = [1, 2, 3, 4];
    const actual = usePagination(40, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  it('5 pages, current 1', () => {
    expect.assertions(1);
    const expected = [1, 2, '...', 5];
    const actual = usePagination(50, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  it('6 pages, current 1', () => {
    expect.assertions(1);
    const expected = [1, 2, '...', 6];
    const actual = usePagination(60, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  it('6 pages, current 6', () => {
    expect.assertions(1);
    const expected = [1, '...', 5, 6];
    const actual = usePagination(60, 10, 6);
    expect(actual).toStrictEqual(expected);
  });

  it('6 pages, current 3', () => {
    expect.assertions(1);
    const expected = [1, 2, 3, 4, 5, 6];
    const actual = usePagination(60, 10, 3);
    expect(actual).toStrictEqual(expected);
  });

  it('7 pages, current 1', () => {
    expect.assertions(1);
    const expected = [1, 2, '...', 7];
    const actual = usePagination(70, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  it('7 pages, current 3', () => {
    expect.assertions(1);
    const expected = [1, 2, 3, 4, '...', 7];
    const actual = usePagination(70, 10, 3);
    expect(actual).toStrictEqual(expected);
  });

  it('8 pages, current 1', () => {
    expect.assertions(1);
    const expected = [1, 2, '...', 8];
    const actual = usePagination(80, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  it('8 pages, current 4', () => {
    expect.assertions(1);
    const expected = [1, 2, 3, 4, 5, '...', 8];
    const actual = usePagination(80, 10, 4);
    expect(actual).toStrictEqual(expected);
  });

  it('9 pages, current 1', () => {
    expect.assertions(1);
    const expected = [1, 2, '...', 9];
    const actual = usePagination(90, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  it('10 pages, current 1', () => {
    expect.assertions(1);
    const expected = [1, 2, '...', 10];
    const actual = usePagination(100, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  it('11 pages, current 5', () => {
    expect.assertions(1);
    const expected = [1, '...', 4, 5, 6, '...', 11];
    const actual = usePagination(110, 10, 5);
    expect(actual).toStrictEqual(expected);
  });

  it('15 pages, current 8', () => {
    expect.assertions(1);
    const expected = [1, '...', 7, 8, 9, '...', 15];
    const actual = usePagination(150, 10, 8);
    expect(actual).toStrictEqual(expected);
  });

  it('25 pages, current 25', () => {
    expect.assertions(1);
    const expected = [1, '...', 24, 25];
    const actual = usePagination(250, 10, 25);
    expect(actual).toStrictEqual(expected);
  });

  it('25 pages, current 20', () => {
    expect.assertions(1);
    const expected = [1, '...', 19, 20, 21, '...', 25];
    const actual = usePagination(250, 10, 20);
    expect(actual).toStrictEqual(expected);
  });
});
