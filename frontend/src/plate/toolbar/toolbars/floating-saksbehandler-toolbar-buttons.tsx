import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { BaseListItemContentPlugin, BaseListItemPlugin } from '@platejs/list-classic';
import { BaseParagraphPlugin, ElementApi } from 'platejs';
import { useEditorState } from 'platejs/react';
import { ELEMENT_MALTEKST, ELEMENT_REDIGERBAR_MALTEKST } from '@/plate/plugins/element-types';
import { SaksbehandlerPlaceholderPlugin } from '@/plate/plugins/placeholder/saksbehandler';
import { Abbreviation } from '@/plate/toolbar/abbreviation';
import { CommentsButton } from '@/plate/toolbar/add-comment';
import { BookmarkButton } from '@/plate/toolbar/bookmark-button';
import { CycleCaseButton } from '@/plate/toolbar/cycle-case-button';
import { Headings } from '@/plate/toolbar/headings';
import { Indent } from '@/plate/toolbar/indent';
import { Marks } from '@/plate/toolbar/marks';
import { ParagraphButton } from '@/plate/toolbar/paragraph-button';
import { ToolbarSeparator } from '@/plate/toolbar/separator';

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
        <CycleCaseButton />
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
        <CycleCaseButton />
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
        <CycleCaseButton />
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
        <CycleCaseButton />
        <ToolbarSeparator />
        <BookmarkButton />
        <CommentsButton />
        <Abbreviation />
      </>
    );
  }

  return null;
};
