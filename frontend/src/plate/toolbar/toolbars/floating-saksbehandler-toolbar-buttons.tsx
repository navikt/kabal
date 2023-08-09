import { findNode, isElement, usePlateEditorState } from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from '@udecode/plate-heading';
import { ELEMENT_LI, ELEMENT_LIC } from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import React from 'react';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER, ELEMENT_REDIGERBAR_MALTEKST } from '@app/plate/plugins/element-types';
import { CommentsButton } from '@app/plate/toolbar/add-comment';
import { Headings } from '@app/plate/toolbar/headings';
import { Indent } from '@app/plate/toolbar/indent';
import { Marks } from '@app/plate/toolbar/marks';
import { ParagraphButton } from '@app/plate/toolbar/paragraph-button';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';

export const FloatingSaksbehandlerToolbarButtons = () => {
  const editor = usePlateEditorState();

  const activeElement = findNode(editor, {
    match: (n) => isElement(n) && n.type !== ELEMENT_REDIGERBAR_MALTEKST && n.type !== ELEMENT_MALTEKST,
    mode: 'lowest',
  });

  if (activeElement === undefined) {
    return null;
  }

  const [{ type }] = activeElement;

  if (type === ELEMENT_LI || type === ELEMENT_LIC) {
    return (
      <>
        <Marks />
        <ToolbarSeparator />
        <Headings />
        <ToolbarSeparator />
        <CommentsButton />
      </>
    );
  }

  if (type === ELEMENT_PARAGRAPH) {
    return (
      <>
        <Marks />
        <ToolbarSeparator />
        <Headings />
        <ToolbarSeparator />
        <Indent />
        <ToolbarSeparator />
        <CommentsButton />
      </>
    );
  }

  if (type === ELEMENT_H1 || type === ELEMENT_H2 || type === ELEMENT_H3) {
    return (
      <>
        <ParagraphButton />
        <Headings />
        <ToolbarSeparator />
        <CommentsButton />
      </>
    );
  }

  if (type === ELEMENT_PLACEHOLDER) {
    return (
      <>
        <Marks />
        <ToolbarSeparator />
        <CommentsButton />
      </>
    );
  }

  return null;
};
