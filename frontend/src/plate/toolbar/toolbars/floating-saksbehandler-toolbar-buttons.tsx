import { ELEMENT_MALTEKST, ELEMENT_REDIGERBAR_MALTEKST } from '@app/plate/plugins/element-types';
import { SaksbehandlerPlaceholderPlugin } from '@app/plate/plugins/placeholder/saksbehandler';
import { Abbreviation } from '@app/plate/toolbar/abbreviation';
import { CommentsButton } from '@app/plate/toolbar/add-comment';
import { BookmarkButton } from '@app/plate/toolbar/bookmark-button';
import { Headings } from '@app/plate/toolbar/headings';
import { Indent } from '@app/plate/toolbar/indent';
import { Marks } from '@app/plate/toolbar/marks';
import { ParagraphButton } from '@app/plate/toolbar/paragraph-button';
import { ToolbarSeparator } from '@app/plate/toolbar/separator';
import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { useEditorState } from '@platejs/core/react';
import { BaseListItemContentPlugin, BaseListItemPlugin } from '@platejs/list-classic';
import { BaseParagraphPlugin, ElementApi } from 'platejs';

export const FloatingSaksbehandlerToolbarButtons = () => {
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
        <ToolbarSeparator />
        <BookmarkButton />
        <CommentsButton />
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
        <ToolbarSeparator />
        <BookmarkButton />
        <CommentsButton />
        <Abbreviation />
      </>
    );
  }

  if (type === BaseH1Plugin.key || type === BaseH2Plugin.key || type === BaseH3Plugin.key) {
    return (
      <>
        <ParagraphButton />
        <Headings />
        <ToolbarSeparator />
        <BookmarkButton />
        <CommentsButton />
        <Abbreviation />
      </>
    );
  }

  if (type === SaksbehandlerPlaceholderPlugin.node.type) {
    return (
      <>
        <Marks />
        <ToolbarSeparator />
        <BookmarkButton />
        <CommentsButton />
        <Abbreviation />
      </>
    );
  }

  return null;
};
