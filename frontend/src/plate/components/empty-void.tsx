import type { EditorValue, EmptyVoidElement } from '@app/plate/types';
import { PlateElement, type PlateElementProps } from '@udecode/plate-common';

type RenderProps = PlateElementProps<EditorValue, EmptyVoidElement>;

export const EmptyVoid = (props: RenderProps) => <PlateElement as="div" {...props} />;
