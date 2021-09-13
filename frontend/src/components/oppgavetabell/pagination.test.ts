import { usePagination } from './pagination';

/*
  [1]
  [1],2
  1,[2],3

  1,2,3,4,[5],6,7,8,9
  1,2,3,4,5,[6],7,8,9
  1,2,3,[4],5,6,7,8,9

  1,2,[3],4,5,6,...,9
  1,2,3,4,[5],6,7,8,...,10
  1,...,3,4,5,[6],7,8,9,10
  1,...,12,13,14,[15],16,17,18,...,100
*/

describe('Pagination', () => {
  test('1 page, 5 items, current 1', () => {
    const expected = [1];
    const actual = usePagination(5, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  test('2 pages, 15 items, current 2', () => {
    const expected = [1, 2];
    const actual = usePagination(15, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  test('1 page, current 1', () => {
    const expected = [1];
    const actual = usePagination(10, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  test('2 pages, current 1', () => {
    const expected = [1, 2];
    const actual = usePagination(20, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  test('3 pages, current 1', () => {
    const expected = [1, 2, 3];
    const actual = usePagination(30, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  test('4 pages, current 1', () => {
    const expected = [1, 2, 3, 4];
    const actual = usePagination(40, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  test('5 pages, current 1', () => {
    const expected = [1, 2, 3, 4, 5];
    const actual = usePagination(50, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  test('6 pages, current 1', () => {
    const expected = [1, 2, 3, 4, '...', 6];
    const actual = usePagination(60, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  test('6 pages, current 6', () => {
    const expected = [1, '...', 3, 4, 5, 6];
    const actual = usePagination(60, 10, 6);
    expect(actual).toStrictEqual(expected);
  });

  test('6 pages, current 3', () => {
    const expected = [1, 2, 3, 4, 5, 6];
    const actual = usePagination(60, 10, 3);
    expect(actual).toStrictEqual(expected);
  });

  test('7 pages, current 1', () => {
    const expected = [1, 2, 3, 4, '...', 7];
    const actual = usePagination(70, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  test('7 pages, current 3', () => {
    const expected = [1, 2, 3, 4, 5, 6, 7];
    const actual = usePagination(70, 10, 3);
    expect(actual).toStrictEqual(expected);
  });

  test('8 pages, current 1', () => {
    const expected = [1, 2, 3, 4, '...', 8];
    const actual = usePagination(80, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  test('8 pages, current 4', () => {
    const expected = [1, 2, 3, 4, 5, 6, 7, 8];
    const actual = usePagination(80, 10, 4);
    expect(actual).toStrictEqual(expected);
  });

  test('9 pages, current 1', () => {
    const expected = [1, 2, 3, 4, '...', 9];
    const actual = usePagination(90, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  test('10 pages, current 1', () => {
    const expected = [1, 2, 3, 4, '...', 10];
    const actual = usePagination(100, 10, 1);
    expect(actual).toStrictEqual(expected);
  });

  test('11 pages, current 5', () => {
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, '...', 11];
    const actual = usePagination(110, 10, 5);
    expect(actual).toStrictEqual(expected);
  });

  test('15 pages, current 8', () => {
    const expected = [1, '...', 5, 6, 7, 8, 9, 10, 11, '...', 15];
    const actual = usePagination(150, 10, 8);
    expect(actual).toStrictEqual(expected);
  });

  test('25 pages, current 25', () => {
    const expected = [1, '...', 22, 23, 24, 25];
    const actual = usePagination(250, 10, 25);
    expect(actual).toStrictEqual(expected);
  });

  test('25 pages, current 20', () => {
    const expected = [1, '...', 17, 18, 19, 20, 21, 22, 23, '...', 25];
    const actual = usePagination(250, 10, 20);
    expect(actual).toStrictEqual(expected);
  });
});
