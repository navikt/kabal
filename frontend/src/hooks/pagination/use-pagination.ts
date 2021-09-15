const PAGES: { [key: number]: number[] } = {
  0: [1],
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  4: [1, 2, 3, 4],
};

const predefined = Object.keys(PAGES).length - 1;

export const usePagination = (total: number, pageSize = 10, currentPage = 1): (number | string)[] => {
  if (total === 0) {
    return PAGES[0];
  }

  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= predefined) {
    return PAGES[totalPages];
  }

  const startPage = 1;

  const items: (number | string)[] = [startPage];

  const endPage = totalPages;

  const startDiff = currentPage - startPage;

  if (startDiff === 2) {
    const previous = currentPage - 1;
    items.push(previous);
  } else if (startDiff === 3) {
    const previous = currentPage - 1;
    items.push(previous - 1, previous);
  } else if (startDiff >= 4) {
    const previous = currentPage - 1;
    items.push('...', previous);
  }

  if (currentPage !== startPage && currentPage !== endPage) {
    items.push(currentPage);
  }

  const endDiff = endPage - currentPage;

  if (endDiff === 2) {
    const next = currentPage + 1;
    items.push(next);
  } else if (endDiff === 3) {
    const next = currentPage + 1;
    items.push(next, next + 1);
  } else if (endDiff >= 4) {
    const next = currentPage + 1;
    items.push(next, '...');
  }

  items.push(endPage);

  return items;
};
