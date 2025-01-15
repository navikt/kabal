import type { EmptyVoidElement } from '@app/plate/types';
import { PlateElement, type PlateElementProps } from '@udecode/plate/react';

type RenderProps = PlateElementProps<EmptyVoidElement>;

export const EmptyVoid = (props: RenderProps) => <PlateElement as="div" {...props} />;
