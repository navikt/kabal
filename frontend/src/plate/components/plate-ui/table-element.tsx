import { ptToEm } from '@app/plate/components/get-scaled-em';
import type { TableElement as ITableElement } from '@app/plate/types';
import { TableProvider, useTableElement } from '@platejs/table/react';
import { PlateElement, type PlateElementProps, withHOC } from 'platejs/react';

export const TableElement = withHOC(TableProvider, ({ children, ref, ...props }: PlateElementProps<ITableElement>) => {
  const { props: tableProps } = useTableElement();

  return (
    <PlateElement style={{ marginLeft: ptToEm(24 * (props.element.indent ?? 0)) }} {...props}>
      <table className="mt-4 max-w-full border-collapse" ref={ref} {...tableProps}>
        <tbody>{children}</tbody>
      </table>
    </PlateElement>
  );
});
