import type { RenderLeafFn } from '@udecode/plate-common';
import { CustomLeaf, Leaf } from './leaf';

export const renderLeaf: RenderLeafFn = (props) => <CustomLeaf {...props} />;

export const renderReadOnlyLeaf: RenderLeafFn = (props) => <Leaf {...props} />;
