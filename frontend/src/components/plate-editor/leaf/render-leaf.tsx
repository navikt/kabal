import { RenderLeafFn } from '@udecode/plate';
import React from 'react';
import { EditorValue } from '../types';
import { CustomLeaf } from './leaf';

export const renderLeaf: RenderLeafFn<EditorValue> = (props) => <CustomLeaf {...props} />;
