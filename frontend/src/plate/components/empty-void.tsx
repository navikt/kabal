import { PlateElement, type PlateElementProps } from 'platejs/react';
import type { EmptyVoidElement } from '@/plate/types';

type RenderProps = PlateElementProps<EmptyVoidElement>;

export const EmptyVoid = (props: RenderProps) => <PlateElement as="div" {...props} />;
