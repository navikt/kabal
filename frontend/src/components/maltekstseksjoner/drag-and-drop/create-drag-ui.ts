type cleanFn = () => void;

// eslint-disable-next-line import/no-unused-modules
export const createDragUI = (dragElementRef: React.RefObject<HTMLAnchorElement>, e: React.DragEvent): cleanFn => {
  if (dragElementRef.current === null) {
    return () => {};
  }

  const width = dragElementRef.current.offsetWidth;
  const dragElement = dragElementRef.current.cloneNode(true) as HTMLAnchorElement;
  dragElement.style.width = `${width}px`;
  dragElement.style.backgroundColor = 'var(--a-blue-100)';
  dragElement.style.opacity = '0.5';
  dragElement.style.transform = 'rotate(3deg)';

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
