/* eslint-disable no-restricted-globals */
import { pushError } from '@app/observability';
import {
  ELEMENT_CURRENT_DATE,
  ELEMENT_FOOTER,
  ELEMENT_HEADER,
  ELEMENT_LABEL_CONTENT,
  ELEMENT_MALTEKST,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
  ELEMENT_REGELVERK_CONTAINER,
  ELEMENT_SIGNATURE,
} from '@app/plate/plugins/element-types';

const NOOP_ELEMENTS = [
  ELEMENT_CURRENT_DATE,
  ELEMENT_SIGNATURE,
  ELEMENT_HEADER,
  ELEMENT_FOOTER,
  ELEMENT_LABEL_CONTENT,
  ELEMENT_MALTEKST,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_REGELVERK,
];

const UNWRAP_ELEMENTS = [ELEMENT_REDIGERBAR_MALTEKST, ELEMENT_REGELVERK_CONTAINER];

type HTML = HTMLElement | HTMLCollection | ChildNode;

export const containsNoopElements = (element: HTMLElement): boolean => {
  const type = element.getAttribute('data-element');
  const noop = type !== null && NOOP_ELEMENTS.includes(type);

  return noop || Array.from(element.children).some((c) => c instanceof HTMLElement && containsNoopElements(c));
};

export const cleanHtml = (e: HTMLElement): HTMLElement | HTMLCollection | null => {
  const element = e.cloneNode(true) as HTMLElement;

  if (containsNoopElements(element)) {
    return null;
  }

  const type = element.getAttribute('data-element');

  for (const child of element.children) {
    if (child instanceof HTMLElement) {
      cleanHtml(child);
    }
  }

  if (type !== null && UNWRAP_ELEMENTS.includes(type)) {
    return element.children;
  }

  return element;
};

const htmlToStringInternal = (html: HTML): string => {
  if (html instanceof HTMLElement) {
    return html.outerHTML;
  }

  if (html instanceof HTMLCollection) {
    let string = '';

    for (const child of html) {
      string += child.outerHTML;
    }

    return string;
  }

  return html.textContent ?? '';
};

export const htmlToString = (html: HTML): string => {
  const string = htmlToStringInternal(html);

  if (isInvalid(string)) {
    logError(html);

    return '';
  }

  return htmlToStringInternal(html);
};

const isInvalid = (string: string): boolean =>
  [...NOOP_ELEMENTS, ...UNWRAP_ELEMENTS].some((type) => string.includes(`data-element="${type}"`));

const logError = (html: HTML) => {
  const scrubbed = scrubText(html);
  const scrubbedString = htmlToStringInternal(scrubbed);

  pushError(
    new Error(
      `Drag'n'drop in smart editor contained noop elements or elements that should be unwrapped. HTML: ${scrubbedString}`,
    ),
  );
};

export const scrubText = (node: HTML): HTML => {
  if (node instanceof HTMLElement) {
    const content = node.getAttribute('content');
    const result = node.getAttribute('result');

    if (content !== null) {
      node.setAttribute('content', '[FJERNET]');
    }

    if (result !== null) {
      node.setAttribute('result', '[FJERNET]');
    }
  }

  if (node instanceof HTMLCollection) {
    for (const child of node) {
      scrubText(child);
    }

    return node;
  }

  if (node.nodeType === Node.TEXT_NODE) {
    node.textContent = '[FJERNET]';
  }

  for (const child of node.childNodes) {
    scrubText(child);
  }

  return node;
};
