import { RenderLeafFn } from '@udecode/plate-common';
import React from 'react';
import { CustomLeaf, Leaf } from './leaf';

export const renderLeaf: RenderLeafFn = (props) => <CustomLeaf {...props} />;

export const renderReadOnlyLeaf: RenderLeafFn = (props) => <Leaf {...props} />;
