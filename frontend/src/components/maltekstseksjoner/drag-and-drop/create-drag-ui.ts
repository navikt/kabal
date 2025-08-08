type cleanFn = () => void;

export const createDragUI = (
  dragElementRef: React.RefObject<HTMLAnchorElement | null>,
  e: React.DragEvent,
): cleanFn => {
  if (dragElementRef.current === null) {
    return () => undefined;
  }

  const width = dragElementRef.current.offsetWidth;
  const dragElement = dragElementRef.current.cloneNode(true) as HTMLAnchorElement;
  dragElement.classList.add('aksel-theme', 'dark');
  dragElement.style.backgroundColor = 'var(--ax-bg-accent-moderate)';
  dragElement.style.color = 'var(--ax-text-neutral)';
  dragElement.style.width = `${width}px`;
  dragElement.style.whiteSpace = 'nowrap';
  dragElement.style.opacity = '0.5';

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
