import type { RedigerbarMaltekstElement } from '@app/plate/types';
import { PlateElement, type PlateElementProps } from '@udecode/plate-common/react';

export const Wrapper = (props: PlateElementProps<RedigerbarMaltekstElement>) => {
  return (
    <PlateElement<RedigerbarMaltekstElement> {...props} asChild>
      <span>
        <span style={{ color: 'red' }}>this is a wrapper</span>
        {props.children}
      </span>
    </PlateElement>
  );
};
