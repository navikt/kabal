import { describe, expect, it } from 'bun:test';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import { renderHook } from '@testing-library/react';

const getPage = (oppgaver: string[], page: number) =>
  renderHook(() => useOppgavePagination(OppgaveTableRowsPerPage.LEDIGE, oppgaver, page));

const createIds = (count: number) => Array.from({ length: count }, (_, i) => (i + 1).toString());

describe('useOppgavePagination', () => {
  describe('with 9 rows', () => {
    const ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    it('should return correct values for page 1', async () => {
      const { result } = getPage(ids, 1);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(9);
      expect(page).toBe(1);
      expect(from).toBe(1);
      expect(to).toBe(9);
      expect(oppgaver).toEqual(ids);
    });

    it('should return correct values for page 2', async () => {
      const { result } = getPage(ids, 2);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(9);
      expect(page).toBe(1);
      expect(from).toBe(1);
      expect(to).toBe(9);
      expect(oppgaver).toEqual(ids);
    });
  });

  describe('with 10 rows', () => {
    const ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    it('should return correct values for page 1', async () => {
      const { result } = getPage(ids, 1);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(10);
      expect(page).toBe(1);
      expect(from).toBe(1);
      expect(to).toBe(10);
      expect(oppgaver).toEqual(ids);
    });

    it('should clamp page 2 to page 1', async () => {
      const { result } = getPage(ids, 2);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(10);
      expect(page).toBe(1);
      expect(from).toBe(1);
      expect(to).toBe(10);
      expect(oppgaver).toEqual(ids);
    });
  });

  describe('with 11 rows', () => {
    const ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

    it('should return correct values for page 1', async () => {
      const { result } = getPage(ids, 1);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(11);
      expect(page).toBe(1);
      expect(from).toBe(1);
      expect(to).toBe(10);
      expect(oppgaver).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    });

    it('should return correct values for page 2', async () => {
      const { result } = getPage(ids, 2);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(11);
      expect(page).toBe(2);
      expect(from).toBe(11);
      expect(to).toBe(11);
      expect(oppgaver).toEqual(['11']);
    });

    it('should clamp page 3 to page 2', async () => {
      const { result } = getPage(ids, 3);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(11);
      expect(page).toBe(2);
      expect(from).toBe(11);
      expect(to).toBe(11);
      expect(oppgaver).toEqual(['11']);
    });
  });

  describe('with 19 rows', () => {
    const ids = createIds(19);

    it('should return correct values for page 1', async () => {
      const { result } = getPage(ids, 1);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(19);
      expect(page).toBe(1);
      expect(from).toBe(1);
      expect(to).toBe(10);
      expect(oppgaver).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    });

    it('should return correct values for page 2', async () => {
      const { result } = getPage(ids, 2);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(19);
      expect(page).toBe(2);
      expect(from).toBe(11);
      expect(to).toBe(19);
      expect(oppgaver).toEqual(['11', '12', '13', '14', '15', '16', '17', '18', '19']);
    });

    it('should clamp page 3 to page 2', async () => {
      const { result } = getPage(ids, 3);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(19);
      expect(page).toBe(2);
      expect(from).toBe(11);
      expect(to).toBe(19);
      expect(oppgaver).toEqual(['11', '12', '13', '14', '15', '16', '17', '18', '19']);
    });
  });

  describe('with 20 rows', () => {
    const ids = createIds(20);

    it('should return correct values for page 1', async () => {
      const { result } = getPage(ids, 1);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(20);
      expect(page).toBe(1);
      expect(from).toBe(1);
      expect(to).toBe(10);
      expect(oppgaver).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    });

    it('should return correct values for page 2', async () => {
      const { result } = getPage(ids, 2);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(20);
      expect(page).toBe(2);
      expect(from).toBe(11);
      expect(to).toBe(20);
      expect(oppgaver).toEqual(['11', '12', '13', '14', '15', '16', '17', '18', '19', '20']);
    });

    it('should clamp page 3 to page 2', async () => {
      const { result } = getPage(ids, 3);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(20);
      expect(page).toBe(2);
      expect(from).toBe(11);
      expect(to).toBe(20);
      expect(oppgaver).toEqual(['11', '12', '13', '14', '15', '16', '17', '18', '19', '20']);
    });
  });

  describe('with 21 rows', () => {
    const ids = createIds(21);

    it('should return correct values for page 1', async () => {
      const { result } = getPage(ids, 1);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(21);
      expect(page).toBe(1);
      expect(from).toBe(1);
      expect(to).toBe(10);
      expect(oppgaver).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
    });

    it('should return correct values for page 2', async () => {
      const { result } = getPage(ids, 2);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(21);
      expect(page).toBe(2);
      expect(from).toBe(11);
      expect(to).toBe(20);
      expect(oppgaver).toEqual(['11', '12', '13', '14', '15', '16', '17', '18', '19', '20']);
    });

    it('should return correct values for page 3', async () => {
      const { result } = getPage(ids, 3);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(21);
      expect(page).toBe(3);
      expect(from).toBe(21);
      expect(to).toBe(21);
      expect(oppgaver).toEqual(['21']);
    });

    it('should clamp page 4 to page 3', async () => {
      const { result } = getPage(ids, 4);
      const { page, from, to, total, pageSize, oppgaver } = result.current;

      expect(pageSize).toBe(10);
      expect(total).toBe(21);
      expect(page).toBe(3);
      expect(from).toBe(21);
      expect(to).toBe(21);
      expect(oppgaver).toEqual(['21']);
    });
  });
});
