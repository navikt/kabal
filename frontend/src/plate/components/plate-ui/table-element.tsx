import { ptToEm } from '@app/plate/components/get-scaled-em';
import { ScaleContext } from '@app/plate/status-bar/scale-context';
import {
  type TableElement as ITableElement,
  type TableElement as TableElementType,
  useMyPlateEditorRef,
} from '@app/plate/types';
import { TableProvider, useTableColSizes, useTableElement } from '@platejs/table/react';
import { PlateElement, type PlateElementProps, withHOC, withRef } from 'platejs/react';
import { useContext, useEffect } from 'react';
import { styled } from 'styled-components';

export const TableElement = withHOC(
  TableProvider,
  withRef<typeof PlateElement, PlateElementProps<ITableElement>>(({ children, ...props }, ref) => {
    const { props: tableProps } = useTableElement();
    const { scale } = useContext(ScaleContext);
    const colSizes = useTableColSizes();
    const editor = useMyPlateEditorRef();

    // biome-ignore lint/correctness/useExhaustiveDependencies: colSizes is left out of the dependency array. // We only want to rescale colSizes when the scale changes.
    useEffect(() => {
      const at = editor.api.findPath(props.element);

      if (at === undefined) {
        return;
      }

      console.log('Rescaling colSizes', colSizes, 'to scale', scale);

      editor.tf.setNodes<TableElementType>({ colSizes: colSizes.map((size) => size * (scale / 100)) }, { at });
    }, [scale]);

    return (
      <PlateElement style={{ marginLeft: ptToEm(24 * (props.element.indent ?? 0)) }} {...props}>
        <TableStyled ref={ref} {...tableProps}>
          <tbody>{children}</tbody>
        </TableStyled>
      </PlateElement>
    );
  }),
);

const TableStyled = styled.table`
  border-collapse: collapse;
  margin-top: 1em;
  max-width: 100%;
`;
