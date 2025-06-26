import { describe, expect, it } from 'bun:test';
import { OppgaveTableRowsPerPage } from '@app/hooks/settings/use-setting';
import { useOppgavePagination } from '@app/hooks/use-oppgave-pagination';
import { renderHook, waitFor } from '@testing-library/react';

const getPagination = (oppgaver: string[]) =>
  renderHook(() => useOppgavePagination(OppgaveTableRowsPerPage.LEDIGE, oppgaver));

const createIds = (count: number) => Array.from({ length: count }, (_, i) => (i + 1).toString());

describe('useOppgavePagination', () => {
  it('should return correct values for 9 rows', async () => {
    const ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const { result } = getPagination(ids);
    const { page, from, to, setPage, total, pageSize, oppgaver } = result.current;

    expect(pageSize).toBe(10);
    expect(total).toBe(9);
    expect(page).toBe(1);
    expect(from).toBe(1);
    expect(to).toBe(9);
    expect(oppgaver).toEqual(ids);

    setPage(2);

    await waitFor(() => expect(page).toBe(1));
    await waitFor(() => expect(from).toBe(1));
    await waitFor(() => expect(to).toBe(9));
    await waitFor(() => expect(result.current.oppgaver).toEqual(ids));
  });

  it('should return correct values for 10 rows', async () => {
    const ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const { result } = getPagination(ids);
    const { page, from, to, setPage, total, pageSize, oppgaver } = result.current;

    expect(pageSize).toBe(10);
    expect(total).toBe(10);
    expect(page).toBe(1);
    expect(from).toBe(1);
    expect(to).toBe(10);
    expect(oppgaver).toEqual(ids);

    setPage(2);

    await waitFor(() => expect(page).toBe(1));
    await waitFor(() => expect(from).toBe(1));
    await waitFor(() => expect(to).toBe(10));
    await waitFor(() => expect(result.current.oppgaver).toEqual(ids));
  });

  it('should return correct values for 11 rows, and allow user to see page 2', async () => {
    const ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
    const { result } = getPagination(ids);
    const { page, from, to, setPage, total, pageSize, oppgaver } = result.current;

    expect(pageSize).toBe(10);
    expect(total).toBe(11);
    expect(page).toBe(1);
    expect(from).toBe(1);
    expect(to).toBe(10);
    expect(oppgaver).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

    setPage(2);

    await waitFor(() => expect(result.current.page).toBe(2));
    await waitFor(() => expect(result.current.from).toBe(11));
    await waitFor(() => expect(result.current.to).toBe(11));
    await waitFor(() => expect(result.current.oppgaver).toEqual(['11']));
  });

  it('should return correct values for 19 rows, and allow user to see page 2 but not page 3', async () => {
    const ids = createIds(19);
    const { result } = getPagination(ids);
    const { page, from, to, setPage, total, pageSize, oppgaver } = result.current;

    expect(pageSize).toBe(10);
    expect(total).toBe(19);
    expect(page).toBe(1);
    expect(from).toBe(1);
    expect(to).toBe(10);
    expect(oppgaver).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

    setPage(2);

    await waitFor(() => expect(result.current.page).toBe(2));
    await waitFor(() => expect(result.current.from).toBe(11));
    await waitFor(() => expect(result.current.to).toBe(19));
    await waitFor(() =>
      expect(result.current.oppgaver).toEqual(['11', '12', '13', '14', '15', '16', '17', '18', '19']),
    );

    setPage(3);

    await waitFor(() => expect(result.current.page).toBe(2));
    await waitFor(() => expect(result.current.from).toBe(11));
    await waitFor(() => expect(result.current.to).toBe(19));
    await waitFor(() =>
      expect(result.current.oppgaver).toEqual(['11', '12', '13', '14', '15', '16', '17', '18', '19']),
    );

    setPage(1);

    await waitFor(() => expect(result.current.page).toBe(1));
    await waitFor(() => expect(result.current.from).toBe(1));
    await waitFor(() => expect(result.current.to).toBe(10));
    await waitFor(() => expect(result.current.oppgaver).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']));
  });

  it('should return correct values for 20 rows, and allow user to see page 2 but not page 3', async () => {
    const ids = createIds(20);
    const { result } = getPagination(ids);
    const { page, from, to, setPage, total, pageSize, oppgaver } = result.current;

    expect(pageSize).toBe(10);
    expect(total).toBe(20);
    expect(page).toBe(1);
    expect(from).toBe(1);
    expect(to).toBe(10);
    expect(oppgaver).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

    setPage(2);

    await waitFor(() => expect(result.current.page).toBe(2));
    await waitFor(() => expect(result.current.from).toBe(11));
    await waitFor(() => expect(result.current.to).toBe(20));
    await waitFor(() =>
      expect(result.current.oppgaver).toEqual(['11', '12', '13', '14', '15', '16', '17', '18', '19', '20']),
    );

    setPage(3);

    await waitFor(() => expect(result.current.page).toBe(2));
    await waitFor(() => expect(result.current.from).toBe(11));
    await waitFor(() => expect(result.current.to).toBe(20));
    await waitFor(() =>
      expect(result.current.oppgaver).toEqual(['11', '12', '13', '14', '15', '16', '17', '18', '19', '20']),
    );

    setPage(1);

    await waitFor(() => expect(result.current.page).toBe(1));
    await waitFor(() => expect(result.current.from).toBe(1));
    await waitFor(() => expect(result.current.to).toBe(10));
    await waitFor(() => expect(result.current.oppgaver).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']));
  });

  it('should return correct values for 21 rows, and allow user to see page 2 and 3', async () => {
    const ids = createIds(21);
    const { result } = getPagination(ids);
    const { page, from, to, setPage, total, pageSize, oppgaver } = result.current;

    expect(pageSize).toBe(10);
    expect(total).toBe(21);
    expect(page).toBe(1);
    expect(from).toBe(1);
    expect(to).toBe(10);
    expect(oppgaver).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);

    setPage(2);

    await waitFor(() => expect(result.current.page).toBe(2));
    await waitFor(() => expect(result.current.from).toBe(11));
    await waitFor(() => expect(result.current.to).toBe(20));
    await waitFor(() =>
      expect(result.current.oppgaver).toEqual(['11', '12', '13', '14', '15', '16', '17', '18', '19', '20']),
    );

    setPage(3);

    await waitFor(() => expect(result.current.page).toBe(3));
    await waitFor(() => expect(result.current.from).toBe(21));
    await waitFor(() => expect(result.current.to).toBe(21));
    await waitFor(() => expect(result.current.oppgaver).toEqual(['21']));

    setPage(1);

    await waitFor(() => expect(result.current.page).toBe(1));
    await waitFor(() => expect(result.current.from).toBe(1));
    await waitFor(() => expect(result.current.to).toBe(10));
    await waitFor(() => expect(result.current.oppgaver).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']));
  });
});
