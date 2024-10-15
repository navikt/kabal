import { describe, expect, it } from 'bun:test';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_MALTEKST, ELEMENT_REDIGERBAR_MALTEKST } from '../plugins/element-types';
import { cleanHtml, containsNoopElements, htmlToString, scrubText } from './helpers';

describe('containsNoopElements', () => {
  it('should return false when data-element is not set', () => {
    expect.assertions(1);

    const element = document.createElement('div');

    expect(containsNoopElements(element)).toBe(false);
  });

  it('should return false when data-element is not a noop element', () => {
    expect.assertions(1);

    const element = document.createElement('div');
    element.setAttribute('data-element', ELEMENT_REDIGERBAR_MALTEKST);

    expect(containsNoopElements(element)).toBe(false);
  });

  it('should return true when data-element is a noop element', () => {
    expect.assertions(1);

    const element = document.createElement('div');
    element.setAttribute('data-element', ELEMENT_MALTEKST);

    expect(containsNoopElements(element)).toBe(true);
  });

  it('should return true when a child is a noop element', () => {
    expect.assertions(1);

    const element = document.createElement('div');
    const child = document.createElement('div');
    child.setAttribute('data-element', ELEMENT_MALTEKST);
    element.appendChild(child);

    expect(containsNoopElements(element)).toBe(true);
  });

  it('should return true when a grandchild is a noop element', () => {
    expect.assertions(1);

    const element = document.createElement('div');
    const child = document.createElement('div');
    const grandchild = document.createElement('div');
    grandchild.setAttribute('data-element', ELEMENT_MALTEKST);
    child.appendChild(grandchild);
    element.appendChild(child);

    expect(containsNoopElements(element)).toBe(true);
  });
});

describe('cleanHtml', () => {
  it('should return null when containsNoopElements is true', () => {
    expect.assertions(1);

    const element = document.createElement('div');
    element.setAttribute('data-element', ELEMENT_MALTEKST);

    expect(cleanHtml(element)).toBeNull();
  });

  it('should return the element when containsNoopElements is false', () => {
    expect.assertions(1);

    const element = document.createElement('div');
    element.setAttribute('data-element', ELEMENT_PARAGRAPH);

    expect(cleanHtml(element)).toStrictEqual(element);
  });

  it('should unwrap the element when it is an unwrap element', () => {
    expect.assertions(1);

    const redigerbarMaltekst = document.createElement('div');
    redigerbarMaltekst.setAttribute('data-element', ELEMENT_REDIGERBAR_MALTEKST);
    const child = document.createElement('span');
    child.textContent = 'I should be unwrapped';
    redigerbarMaltekst.appendChild(child);

    const result = cleanHtml(redigerbarMaltekst);

    if (result === null) {
      throw new Error('Expected result to be an HTMLElement');
    }

    expect(htmlToString(result)).toStrictEqual(htmlToString(child));
  });

  it('should unwrap unwrap-elements if they have non-unwrap children', () => {
    expect.assertions(1);

    const redigerbarMaltekst = document.createElement('div');
    redigerbarMaltekst.setAttribute('data-element', ELEMENT_REDIGERBAR_MALTEKST);
    const child = document.createElement('div');
    const grandchild = document.createElement('span');
    grandchild.textContent = 'I should be unwrapped';
    child.appendChild(grandchild);
    redigerbarMaltekst.appendChild(child);

    const result = cleanHtml(redigerbarMaltekst);

    if (result === null) {
      throw new Error('Expected result to be an HTMLElement');
    }

    expect(htmlToString(result)).toStrictEqual(htmlToString(child));
  });

  it('should unwrap unwrap-elements if they have non-unwrap descendants', () => {
    expect.assertions(1);

    const redigerbarMaltekst = document.createElement('div');
    redigerbarMaltekst.setAttribute('data-element', ELEMENT_REDIGERBAR_MALTEKST);
    const child = document.createElement('div');
    const grandchild = document.createElement('span');
    grandchild.textContent = 'I should be unwrapped';
    child.appendChild(grandchild);
    redigerbarMaltekst.appendChild(child);

    const result = cleanHtml(redigerbarMaltekst);

    if (result === null) {
      throw new Error('Expected result to be an HTMLElement');
    }

    expect(htmlToString(result)).toStrictEqual(htmlToString(child));
  });
});

describe('scrubText', () => {
  it('should scrub text in main element with [FJERNET]', () => {
    expect.assertions(1);

    const element = document.createElement('div');
    element.textContent = 'I should be removed';

    const result = scrubText(element);
    const htmlString = htmlToString(result);

    expect(htmlString).toBe('<div>[FJERNET]</div>');
  });

  it('should scrub text in children with [FJERNET]', () => {
    expect.assertions(1);

    const element = document.createElement('div');
    const child = document.createElement('div');
    child.textContent = 'I should be removed';
    element.appendChild(child);

    const result = scrubText(element);
    const htmlString = htmlToString(result);

    expect(htmlString).toBe('<div><div>[FJERNET]</div></div>');
  });

  it('should scrub text in grandchildren with [FJERNET]', () => {
    expect.assertions(1);

    const element = document.createElement('div');
    const child = document.createElement('div');
    const grandchild = document.createElement('div');
    grandchild.textContent = 'I should be removed';
    child.appendChild(grandchild);
    element.appendChild(child);

    const result = scrubText(element);
    const htmlString = htmlToString(result);

    expect(htmlString).toBe('<div><div><div>[FJERNET]</div></div></div>');
  });

  it('should scrub text in multiple children with [FJERNET]', () => {
    expect.assertions(1);

    const element = document.createElement('div');
    const child1 = document.createElement('div');
    child1.textContent = 'I should be removed';
    element.appendChild(child1);
    const child2 = document.createElement('div');
    child2.textContent = 'I should be removed';
    element.appendChild(child2);

    const result = scrubText(element);
    const htmlString = htmlToString(result);

    expect(htmlString).toBe('<div><div>[FJERNET]</div><div>[FJERNET]</div></div>');
  });

  it('should scrub text in attribute content [FJERNET]', () => {
    expect.assertions(1);

    const element = document.createElement('div');
    element.setAttribute('content', 'I should be removed');

    const result = scrubText(element);
    const htmlString = htmlToString(result);

    expect(htmlString).toBe('<div content="[FJERNET]"></div>');
  });

  it('should scrub text in attribute result [FJERNET]', () => {
    expect.assertions(1);

    const element = document.createElement('div');
    element.setAttribute('result', 'I should be removed');

    const result = scrubText(element);
    const htmlString = htmlToString(result);

    expect(htmlString).toBe('<div result="[FJERNET]"></div>');
  });

  it('should scrub text in HTMLCollection', () => {
    expect.assertions(1);

    const parent = document.createElement('div');
    const child1 = document.createElement('div');
    const child2 = document.createElement('div');
    child1.textContent = 'I should be removed';
    child2.textContent = 'I should be removed';
    parent.appendChild(child1);
    parent.appendChild(child2);

    const result = scrubText(parent.children);

    expect(htmlToString(result)).toBe('<div>[FJERNET]</div><div>[FJERNET]</div>');
  });

  it('should scrub text in HTMLCollection with attributes', () => {
    expect.assertions(1);

    const parent = document.createElement('div');
    const child1 = document.createElement('div');
    const child2 = document.createElement('div');
    child1.textContent = 'I should be removed';
    child2.textContent = 'I should be removed';
    child1.setAttribute('content', 'I should be removed');
    child2.setAttribute('result', 'I should be removed');
    parent.appendChild(child1);
    parent.appendChild(child2);

    const result = scrubText(parent.children);

    expect(htmlToString(result)).toBe(
      '<div content="[FJERNET]">[FJERNET]</div><div result="[FJERNET]">[FJERNET]</div>',
    );
  });

  it('should scrub text in deeply nested HTMLCollection', () => {
    expect.assertions(1);

    const parent = document.createElement('div');
    const child1 = document.createElement('div');
    const child2 = document.createElement('div');
    const grandchild1 = document.createElement('div');
    const grandchild2 = document.createElement('div');
    child1.textContent = 'I should be removed';
    child2.textContent = 'I should be removed';
    grandchild1.textContent = 'I should be removed';
    grandchild2.textContent = 'I should be removed';
    child1.setAttribute('content', 'I should be removed');
    child1.setAttribute('result', 'I should be removed');
    child2.setAttribute('content', 'I should be removed');
    child2.setAttribute('result', 'I should be removed');
    grandchild1.setAttribute('content', 'I should be removed');
    grandchild1.setAttribute('result', 'I should be removed');
    grandchild2.setAttribute('content', 'I should be removed');
    grandchild2.setAttribute('result', 'I should be removed');
    child1.appendChild(grandchild1);
    child2.appendChild(grandchild2);
    parent.appendChild(child1);
    parent.appendChild(child2);

    const result = scrubText(parent.children);

    expect(htmlToString(result)).toBe(
      '<div content="[FJERNET]" result="[FJERNET]">[FJERNET]<div content="[FJERNET]" result="[FJERNET]">[FJERNET]</div></div><div content="[FJERNET]" result="[FJERNET]">[FJERNET]<div content="[FJERNET]" result="[FJERNET]">[FJERNET]</div></div>',
    );
  });

  it('should scrub text in ChildNode', () => {
    expect.assertions(1);

    const text = document.createTextNode('I should be removed');

    const result = scrubText(text);

    expect(htmlToString(result)).toBe('[FJERNET]');
  });

  it('should retain attributes that are not result nor content', () => {
    expect.assertions(1);

    const element = document.createElement('div');
    element.setAttribute('data-attribute', 'I should be retained');

    const result = scrubText(element);
    const htmlString = htmlToString(result);

    expect(htmlString).toBe('<div data-attribute="I should be retained"></div>');
  });
});
