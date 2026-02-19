import { Box, VStack, type VStackProps } from '@navikt/ds-react';
import { useRef } from 'react';
import { PanelContainerRefContext } from './panel-container-ref-context';

const FOCUS_INDICATOR_CLASSES =
  'relative focus-within:after:content-[""] focus-within:after:absolute focus-within:after:inset-0 focus-within:after:rounded focus-within:after:border-2 focus-within:after:border-solid focus-within:after:border-ax-border-focus focus-within:after:pointer-events-none focus-within:after:z-10';

export const PanelContainer = ({
  children,
  position = 'relative',
  height = '100%',
  maxHeight = '100%',
  minWidth = 'fit-content',
  ...props
}: VStackProps) => {
  const ref = useRef<HTMLElement>(null);

  return (
    <PanelContainerRefContext value={ref}>
      <VStack
        height={height}
        maxHeight={maxHeight}
        minWidth={minWidth}
        position={position}
        className={FOCUS_INDICATOR_CLASSES}
        {...props}
      >
        <Box
          ref={ref}
          tabIndex={-1}
          background="default"
          shadow="dialog"
          borderRadius="4"
          overflowX="hidden"
          as="section"
          height="100%"
        >
          {children}
        </Box>
      </VStack>
    </PanelContainerRefContext>
  );
};
