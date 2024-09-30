import { ELEMENT_MALTEKST, ELEMENT_REDIGERBAR_MALTEKST } from '@app/plate/plugins/element-types';
import { RedaktoerPlaceholderPlugin } from '@app/plate/plugins/placeholder/redaktoer';
import { Abbreviation } from '@app/plate/toolbar/abbreviation';
import { Headings } from '@app/plate/toolbar/headings';
import { Indent } from '@app/plate/toolbar/indent';
import { InsertPlaceholder } from '@app/plate/toolbar/insert-placeholder';
import { Marks } from '@app/plate/toolbar/marks';
import { ParagraphButton } from '@app/plate/toolbar/paragraph-button';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { BaseParagraphPlugin, findNode, isElement } from '@udecode/plate-common';
import { useEditorState } from '@udecode/plate-core/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { BaseListItemContentPlugin, BaseListItemPlugin } from '@udecode/plate-list';

export const FloatingRedaktoerToolbarButtons = () => {
  const editor = useEditorState();

  const activeEntry = findNode(editor, {
    match: (n) => isElement(n) && n.type !== ELEMENT_REDIGERBAR_MALTEKST && n.type !== ELEMENT_MALTEKST,
    mode: 'lowest',
  });

  if (activeEntry === undefined) {
    return null;
  }

  const [node] = activeEntry;

  if (!isElement(node)) {
    return null;
  }

  const { type } = node;

  if (type === BaseListItemPlugin.node.type || type === BaseListItemContentPlugin.node.type) {
    return (
      <>
        <Marks />
        <ToolbarSeparator />
        <Headings />
        <InsertPlaceholder />
        <Abbreviation />
      </>
    );
  }

  if (type === BaseParagraphPlugin.node.type) {
    return (
      <>
        <Marks />
        <ToolbarSeparator />
        <Headings />
        <ToolbarSeparator />
        <Indent />
        <InsertPlaceholder />
        <Abbreviation />
      </>
    );
  }

  if (type === HEADING_KEYS.h1 || type === HEADING_KEYS.h2 || type === HEADING_KEYS.h3) {
    return (
      <>
        <ParagraphButton />
        <Headings />
        <InsertPlaceholder />
        <Abbreviation />
      </>
    );
  }

  if (type === RedaktoerPlaceholderPlugin.node.type) {
    return (
      <>
        <Marks />
        <Abbreviation />
      </>
    );
  }

  return null;
};
