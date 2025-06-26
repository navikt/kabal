import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { pushEvent, pushLog } from '@app/observability';
import {
  ELEMENT_CURRENT_DATE,
  ELEMENT_EMPTY_VOID,
  ELEMENT_FOOTER,
  ELEMENT_HEADER,
  ELEMENT_LABEL_CONTENT,
  ELEMENT_MALTEKST,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_PAGE_BREAK,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
  ELEMENT_REGELVERK_CONTAINER,
  ELEMENT_SIGNATURE,
} from '@app/plate/plugins/element-types';
import { MaltekstPlugin } from '@app/plate/plugins/maltekst';
import { RedigerbarMaltekstPlugin } from '@app/plate/plugins/redigerbar-maltekst';
import { RegelverkContainerPlugin } from '@app/plate/plugins/regelverk';
import {
  createEmptyVoid,
  createRegelverkContainer,
  createSimpleListItem,
  createSimpleListItemContainer,
  createSimpleParagraph,
  createTableCell,
  createTableRow,
} from '@app/plate/templates/helpers';
import {
  type MaltekstElement,
  type RedigerbarMaltekstElement,
  type RegelverkContainerElement,
  type TableCellElement,
  TextAlign,
} from '@app/plate/types';
import { isOfElementTypesFn } from '@app/plate/utils/queries';
import { reduxStore } from '@app/redux/configure-store';
import { isGenericObject } from '@app/types/types';
import { LogLevel } from '@grafana/faro-web-sdk';
import { BaseH1Plugin, BaseH2Plugin, BaseH3Plugin } from '@platejs/basic-nodes';
import { BaseParagraphPlugin } from '@platejs/core';
import { createPlatePlugin, type OverrideEditor, type PlateEditor } from '@platejs/core/react';
import {
  BaseBulletedListPlugin,
  BaseListItemContentPlugin,
  BaseListItemPlugin,
  BaseNumberedListPlugin,
} from '@platejs/list-classic';
import { BaseTableCellPlugin, BaseTablePlugin, BaseTableRowPlugin } from '@platejs/table';
import { TableCellPlugin } from '@platejs/table/react';
import type { TElement, TNode } from 'platejs';
import { ElementApi, NodeApi } from 'platejs';
import { isEditor, type Path, Scrubber } from 'slate';

const module = 'normalize';

type TopLevelElement = RedigerbarMaltekstElement | MaltekstElement | RegelverkContainerElement | TableCellElement;

const isTopLevelElement = isOfElementTypesFn<TopLevelElement>([
  RedigerbarMaltekstPlugin.node.type,
  MaltekstPlugin.node.type,
  RegelverkContainerPlugin.node.type,
  TableCellPlugin.node.type,
]);

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
export const nodeNormalize = (editor: PlateEditor, node: TElement, path: Path): boolean => {
  if (node.type === undefined) {
    pushNodeEvent(editor, node, path, 'normalized-undefined-type');

    pushLog(`Looking for parent node at: ${JSON.stringify(path)}`, { context: { module } });

    const parentEntry = editor.api.parent(path);

    pushLog(`Found parent entry: ${Scrubber.stringify(parentEntry)})`, { context: { module } });

    const options = { context: { node: Scrubber.stringify(node), path: JSON.stringify(path) } };

    if (parentEntry === undefined) {
      pushLog('Missing node type, but no parent. Setting type to paragraph.', options, LogLevel.WARN);

      editor.tf.setNodes({ type: BaseParagraphPlugin.node.type, align: TextAlign.LEFT }, { at: path, mode: 'highest' });

      return true;
    }

    const [parentNode, parentNodePath] = parentEntry;

    if (isEditor(parentNode)) {
      pushLog('Missing node type, element at top level in editor. Setting type to paragraph.', options, LogLevel.WARN);

      editor.tf.setNodes({ type: BaseParagraphPlugin.node.type, align: TextAlign.LEFT }, { at: path, mode: 'highest' });

      return true;
    }

    const isParentTopLevelElement = isTopLevelElement(parentNode);

    if (isParentTopLevelElement) {
      pushLog(
        `Missing node type, element at top level in "${parentNode.type}". Setting type to paragraph.`,
        options,
        LogLevel.WARN,
      );

      editor.tf.setNodes({ type: BaseParagraphPlugin.node.type, align: TextAlign.LEFT }, { at: path, mode: 'highest' });

      return true;
    }

    if (!ElementApi.isElement(parentNode)) {
      pushLog(
        'Missing node type, but parent node is not element. Setting parent type to paragraph.',
        options,
        LogLevel.WARN,
      );

      editor.tf.setNodes({ type: BaseParagraphPlugin.node.type }, { at: parentNodePath, mode: 'highest' });

      return true;
    }

    if (parentNode.type === BaseListItemPlugin.node.type) {
      pushLog('Normalized missing LIC', options);

      editor.tf.setNodes({ type: BaseListItemContentPlugin.node.type }, { at: path, mode: 'highest' });

      return true;
    }

    if (parentNode.type === ELEMENT_MALTEKSTSEKSJON) {
      pushLog(
        'Parent node is maltekstseksjon, trying to get consumer text in order to assert if missing type is either maltekst or redigerbar maltekst',
        options,
        LogLevel.INFO,
      );

      const element = node as MaltekstElement | RedigerbarMaltekstElement;
      const { id } = element;

      if (typeof id !== 'string') {
        pushLog('Cant find id in node', options, LogLevel.WARN);

        return false;
      }

      const consumerText = Object.values(reduxStore.getState().consumerMaltekstseksjonerApi.queries)
        .filter(isNotUndefined)
        .flatMap(({ data }) => data)
        .filter(isGenericObject)
        .find((text) => 'id' in text && text.id === id);

      if (consumerText === undefined) {
        pushLog(`Could not find consumer text with textId: ${id}`, options, LogLevel.WARN);

        return false;
      }

      if ('textType' in consumerText && typeof consumerText.textType === 'string') {
        pushLog(
          `Found consumer text with textType "${consumerText.textType}". Setting node type to consumer textType.`,
          options,
          LogLevel.INFO,
        );

        editor.tf.setNodes({ type: consumerText.textType }, { at: path, mode: 'highest' });

        return true;
      }

      pushLog(
        'Found consumer text, but it does not have a valid textType',
        { ...options, context: { ...options.context, consumerText: JSON.stringify(consumerText) } },
        LogLevel.WARN,
      );

      return false;
    }

    pushLog(
      `Missing node type, but normalization is not implemented for parent with type "${parentNode.type}".`,
      { ...options, context: { ...options.context, parent: Scrubber.stringify(parentNode) } },
      LogLevel.ERROR,
    );

    return false;
  }

  if (node.children.length === 0) {
    pushNodeEvent(editor, node, path, 'normalized-empty-children');

    const options = { at: [...path, 0] };

    switch (node.type) {
      case BaseBulletedListPlugin.node.type:
      case BaseNumberedListPlugin.node.type:
        editor.tf.insertNodes(createSimpleListItem(), options);
        break;
      case BaseListItemPlugin.node.type:
        editor.tf.insertNodes(createSimpleListItemContainer(), options);
        break;
      case BaseTablePlugin.node.type:
        editor.tf.insertNodes(createTableRow(), options);
        break;
      case BaseTableRowPlugin.node.type:
        editor.tf.insertNodes(createTableCell(), options);
        break;
      case BaseTableCellPlugin.node.type:
        editor.tf.insertNodes(createSimpleParagraph(), options);
        break;
      case ELEMENT_REDIGERBAR_MALTEKST:
        editor.tf.insertNodes(createSimpleParagraph(), options);
        break;
      case ELEMENT_MALTEKST:
      case ELEMENT_MALTEKSTSEKSJON:
        editor.tf.insertNodes(createEmptyVoid(), options);
        break;
      case ELEMENT_REGELVERK_CONTAINER:
        editor.tf.insertNodes(createSimpleParagraph(), options);
        break;
      case ELEMENT_REGELVERK:
        editor.tf.insertNodes(createRegelverkContainer(), options);
        break;
      // Use extensive case instead of default in order to avoid inserting wrong node type when a new element type is introduced
      case BaseParagraphPlugin.node.type:
      case BaseH1Plugin.key:
      case BaseH2Plugin.key:
      case BaseH3Plugin.key:
      case BaseListItemContentPlugin.node.type:
      case ELEMENT_PLACEHOLDER:
      case ELEMENT_PAGE_BREAK:
      case ELEMENT_CURRENT_DATE:
      case ELEMENT_EMPTY_VOID:
      case ELEMENT_HEADER:
      case ELEMENT_FOOTER:
      case ELEMENT_LABEL_CONTENT:
      case ELEMENT_SIGNATURE:
        editor.tf.insertNodes({ text: '' }, options);
        break;
    }

    return true;
  }

  return false;
};

const withNormalizeNode: OverrideEditor = ({ editor }) => {
  const { normalizeNode } = editor.tf;

  editor.tf.normalizeNode = ([node, path], opts) => {
    if (!ElementApi.isElement(node)) {
      return normalizeNode([node, path], opts);
    }

    if (nodeNormalize(editor, node, path)) {
      return;
    }

    return normalizeNode([node, path], opts);
  };

  return editor;
};

export const normalizeNodePlugin = createPlatePlugin({ key: 'normalize' }).overrideEditor(withNormalizeNode);

const pushNodeEvent = (editor: PlateEditor, node: TNode, path: Path, name: string) => {
  const [highestAncestorPath] = path;
  const highestAncestor =
    highestAncestorPath === undefined ? undefined : Scrubber.stringify(NodeApi.get(editor, [highestAncestorPath]));

  pushEvent(name, 'smart-editor', {
    ancestor: JSON.stringify(highestAncestor),
    node: Scrubber.stringify(node),
    path: JSON.stringify(path),
  });
};
