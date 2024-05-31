import { cleanHtml, htmlToString } from '@app/plate/drag-start-handler/helpers';

const PARSER = new DOMParser();

export const onPlateContainerDragStart = (e: React.DragEvent) => {
  const html = e.dataTransfer.getData('text/html');
  const doc = PARSER.parseFromString(html, 'text/html');

  const cleaned = cleanHtml(doc.body);

  if (cleaned === null) {
    e.preventDefault();
    e.stopPropagation();

    return;
  }

  const htmlString = htmlToString(cleaned instanceof HTMLCollection ? cleaned : cleaned.children);
  e.dataTransfer.setData('text/html', htmlString);
};
