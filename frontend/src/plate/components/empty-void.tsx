import { PlateElement, PlateElementProps } from '@udecode/plate-common';
import React from 'react';
import { EditorValue, EmptyVoidElement } from '@app/plate/types';

type RenderProps = PlateElementProps<EditorValue, EmptyVoidElement>;

export const EmptyVoid = (props: RenderProps) => <PlateElement as="div" {...props} />;
