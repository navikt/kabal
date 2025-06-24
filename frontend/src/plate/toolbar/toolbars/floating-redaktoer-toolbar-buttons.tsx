import { ELEMENT_MALTEKST, ELEMENT_REDIGERBAR_MALTEKST } from '@app/plate/plugins/element-types';
import { RedaktoerPlaceholderPlugin } from '@app/plate/plugins/placeholder/redaktoer';
import { Abbreviation } from '@app/plate/toolbar/abbreviation';
import { Headings } from '@app/plate/toolbar/headings';
import { Indent } from '@app/plate/toolbar/indent';
import { InsertPlaceholder } from '@app/plate/toolbar/insert-placeholder';
import { Marks } from '@app/plate/toolbar/marks';
import { ParagraphButton } from '@app/plate/toolbar/paragraph-button';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { useEditorState } from '@platejs/core/react';
import { BaseListItemContentPlugin, BaseListItemPlugin } from '@platejs/list-classic';
import { BaseParagraphPlugin, ElementApi } from 'platejs';

export const FloatingRedaktoerToolbarButtons = () => {
  const editor = useEditorState();

  const activeEntry = editor.api.node({
    match: (n) => ElementApi.isElement(n) && n.type !== ELEMENT_REDIGERBAR_MALTEKST && n.type !== ELEMENT_MALTEKST,
    mode: 'lowest',
  });

  if (activeEntry === undefined) {
    return null;
  }

  const [node] = activeEntry;

  if (!ElementApi.isElement(node)) {
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

  if (type === BaseH1Plugin.key || type === BaseH2Plugin.key || type === BaseH3Plugin.key) {
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
