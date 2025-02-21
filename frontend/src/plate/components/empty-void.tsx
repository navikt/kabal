import { PlateElement } from '@app/plate/plate-element';
import type { EmptyVoidElement } from '@app/plate/types';
import type { PlateElementProps } from '@udecode/plate/react';

type RenderProps = PlateElementProps<EmptyVoidElement>;

export const EmptyVoid = (props: RenderProps) => <PlateElement as="div" {...props} />;
