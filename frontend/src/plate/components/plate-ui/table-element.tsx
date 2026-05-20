import { TableProvider, useTableElement } from '@platejs/table/react';
import { PlateElement, type PlateElementProps, withHOC } from 'platejs/react';
import { indentInEm } from '@/plate/components/get-scaled-em';
import type { TableElement as ITableElement } from '@/plate/types';

export const TableElement = withHOC(TableProvider, ({ children, ref, ...props }: PlateElementProps<ITableElement>) => {
  const { props: tableProps } = useTableElement();

  return (
    <PlateElement style={{ marginLeft: indentInEm(props.element.indent) }} {...props}>
      <table className="mt-[1em] mb-[1em] max-w-full border-collapse" ref={ref} {...tableProps} id={props.element.id}>
        <tbody>{children}</tbody>
      </table>
    </PlateElement>
  );
});
