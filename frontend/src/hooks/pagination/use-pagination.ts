const PAGES: { [key: number]: number[] } = {
  0: [1],
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  4: [1, 2, 3, 4],
};

const PREDEFINED = Object.keys(PAGES).length - 1;
const ELLIPSIS = '...';

export const usePagination = (total: number, pageSize = 10, currentPage = 1): (number | string)[] => {
  if (total === 0) {
    return PAGES[0];
  }

  const totalPages = Math.ceil(total / pageSize);

  // No point in calculating the array for low numbers of pages.
  if (totalPages <= PREDEFINED) {
    return PAGES[totalPages];
  }

  const startPage = 1;

  const pages: (number | string)[] = [startPage];

  const endPage = totalPages;

  // Calculate current page distance from start (always 1).
  const startDiff = currentPage - startPage;

  if (startDiff === 2) {
    // If current page is one away from start.
    const previous = currentPage - 1;
    pages.push(previous); // Add the previous page.
  } else if (startDiff === 3) {
    // If current page is two away from start.
    const previous = currentPage - 1;
    pages.push(previous - 1, previous); // Add the two previous pages.
  } else if (startDiff >= 4) {
    // If current page is 4 or more away from start.
    const previous = currentPage - 1;
    pages.push(ELLIPSIS, previous); // Add ellipsis and the previous page.
  }

  if (currentPage !== startPage && currentPage !== endPage) {
    // Do not add the current page if it is equal to start or end.
    pages.push(currentPage);
  }

  const endDiff = endPage - currentPage;

  if (endDiff === 2) {
    // If current page is one away from end.
    const next = currentPage + 1;
    pages.push(next); // Add the next page.
  } else if (endDiff === 3) {
    // If current page is two away from end.
    const next = currentPage + 1;
    pages.push(next, next + 1); // Add the two next pages.
  } else if (endDiff >= 4) {
    // If current page is 4 or more away from end.
    const next = currentPage + 1;
    pages.push(next, ELLIPSIS); // Add ellipsis and the next page.
  }

  pages.push(endPage);

  return pages;
};
