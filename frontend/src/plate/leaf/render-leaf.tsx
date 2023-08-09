import { RenderLeafFn } from '@udecode/plate-common';
import React from 'react';
import { EditorValue } from '@app/plate/types';
import { CustomLeaf, Leaf } from './leaf';

export const renderLeaf: RenderLeafFn<EditorValue> = (props) => <CustomLeaf {...props} />;

export const renderReadOnlyLeaf: RenderLeafFn<EditorValue> = (props) => <Leaf {...props} />;
