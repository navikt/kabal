import { Element } from 'slate';
import { RenderElementProps as RenderElementPropsBase } from 'slate-react';

export interface RenderElementProps<E extends Element = Element> extends RenderElementPropsBase {
  key?: string | number;
  element: E;
}
