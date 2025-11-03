import {
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
  ELEMENT_REGELVERK_CONTAINER,
} from '@app/plate/plugins/element-types';
import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { ListItemContentPlugin } from '@platejs/list-classic/react';
import { TableCellPlugin } from '@platejs/table/react';
import { NodeApi, type Path } from 'platejs';
import { ParagraphPlugin, type PlateEditor } from 'platejs/react';

export const isEditableTextNode = (editor: PlateEditor, path: Path): boolean => {
  const parent = editor.api.parent(path);

  if (parent === undefined) {
    return false;
  }

  const [parentNode] = parent;

  if (typeof parentNode.type === 'string' && EDITABLE_TYPES.includes(parentNode.type)) {
    return true;
  }

  const ancestors = NodeApi.ancestors(editor, path, { reverse: true });

  for (const [ancestor] of ancestors) {
    if (NodeApi.isEditor(ancestor) || ancestor.type === ELEMENT_PLACEHOLDER) {
      return true;
    }

    if (!EDITABLE_TYPES.includes(ancestor.type)) {
      return false;
    }
  }

  return false;
};

const EDITABLE_TYPES = [
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_REGELVERK,
  ELEMENT_REGELVERK_CONTAINER,
  BaseH1Plugin.key,
  BaseH2Plugin.key,
  BaseH3Plugin.key,
  ParagraphPlugin.key,
  TableCellPlugin.key,
  ListItemContentPlugin.key,
];
