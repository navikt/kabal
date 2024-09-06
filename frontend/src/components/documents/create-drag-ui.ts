const MAX_DOCUMENT_LINES = 3;
const MORE_THRESHOLD = MAX_DOCUMENT_LINES + 2;

export const createDragUI = (documentTitleList: string[], e: React.DragEvent<HTMLDivElement>): (() => void) => {
  const dragElement = window.document.createElement('section');

  dragElement.style.backgroundColor = 'var(--a-bg-default)';
  dragElement.style.border = 'var(--a-spacing-05) solid var(--a-surface-action-hover)';
  dragElement.style.padding = 'var(--a-spacing-1)';
  dragElement.style.paddingLeft = 'var(--a-spacing-4)';
  dragElement.style.borderTopRightRadius = 'var(--a-spacing-4)';
  dragElement.style.borderBottomRightRadius = 'var(--a-spacing-4)';
  dragElement.style.borderBottomLeftRadius = 'var(--a-spacing-4)';
  dragElement.style.boxShadow = 'var(--a-shadow-medium)';

  const documentsCount = documentTitleList.length;

  if (documentsCount > 1) {
    const title = window.document.createElement('h1');
    title.style.margin = '0';
    title.style.fontSize = '1em';
    title.innerText = `${documentsCount} Dokumenter:`;
    dragElement.appendChild(title);
  }

  if (documentsCount > 1) {
    const list = window.document.createElement('ul');
    list.style.margin = '0';
    list.style.paddingLeft = 'var(--a-spacing-4)';
    list.style.paddingTop = '0';
    list.style.paddingBottom = '0';

    const lessThanOrEqualToMax = documentsCount <= MAX_DOCUMENT_LINES;
    const max = lessThanOrEqualToMax ? documentsCount : MAX_DOCUMENT_LINES;
    const shouldShowMore = documentsCount >= MORE_THRESHOLD;
    const listItemCount = shouldShowMore || lessThanOrEqualToMax ? max : max + 1;

    for (let i = 0; i < listItemCount; i++) {
      const p = window.document.createElement('li');
      p.innerText = documentTitleList[i] ?? '';

      list.appendChild(p);
    }

    dragElement.appendChild(list);

    // If there are at least two more documents than the max, add a "more" element.
    if (shouldShowMore) {
      const more = window.document.createElement('p');
      more.style.margin = '0';
      more.innerText = `... ${documentsCount - MAX_DOCUMENT_LINES} dokumenter til.`;

      dragElement.appendChild(more);
    }
  } else {
    const p = window.document.createElement('p');
    p.style.padding = '0';
    p.style.margin = '0';
    p.innerText = documentTitleList.join(', ');

    dragElement.appendChild(p);
  }

  // Hide the element.
  dragElement.style.position = 'fixed';
  dragElement.style.top = '-1000px';
  dragElement.style.left = '-1000px';

  // Drag element must be in the DOM.
  window.document.body.appendChild(dragElement);

  e.dataTransfer.setDragImage(dragElement, 0, 0);

  // Return a function that removes the element from the DOM.
  return () => setTimeout(() => dragElement.remove(), 0);
};
