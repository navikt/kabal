import {
  ELEMENT_CURRENT_DATE,
  ELEMENT_FOOTER,
  ELEMENT_HEADER,
  ELEMENT_LABEL_CONTENT,
  ELEMENT_SIGNATURE,
} from '@app/plate/plugins/element-types';
import { groupRanges } from '@app/plate/plugins/search-replace/search-replace';
import { decorateFindReplace, type FindReplaceConfig } from '@platejs/find-replace';
import type { Decorate } from 'platejs';
import { ElementApi } from 'platejs';

const NON_EDITABLE_ELEMENTS = [
  ELEMENT_HEADER,
  ELEMENT_FOOTER,
  ELEMENT_CURRENT_DATE,
  ELEMENT_SIGNATURE,
  ELEMENT_LABEL_CONTENT,
];

export const decorate: Decorate<FindReplaceConfig> = (props) => {
  const { editor } = props;

  const notEditable = editor.api.some({
    match: (n) => ElementApi.isElement(n) && NON_EDITABLE_ELEMENTS.includes(n.type),
    voids: true,
    at: props.entry[1],
  });

  if (notEditable) {
    return [];
  }

  const decorations = decorateFindReplace(props);

  return groupRanges(editor, decorations ?? []).flat();
};
