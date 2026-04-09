import { Box, Heading, VStack } from '@navikt/ds-react';
import { useId, useRef } from 'react';
import { PanelContainerRefContext } from '@/components/oppgavebehandling-panels/panel-container-ref-context';

const FOCUS_INDICATOR_CLASSES =
  'relative focus-within:after:content-[""] focus-within:after:absolute focus-within:after:inset-0 focus-within:after:rounded focus-within:after:border-2 focus-within:after:border-solid focus-within:after:border-ax-border-focus focus-within:after:pointer-events-none focus-within:after:z-100';

interface PanelContainerProps {
  heading?: string;
  'aria-label'?: string;
  minWidth?: string;
  maxWidth?: string;
  children: React.ReactNode;
}

export const PanelContainer = ({
  heading,
  'aria-label': ariaLabel,
  minWidth = 'fit-content',
  maxWidth,
  children,
}: PanelContainerProps) => {
  const ref = useRef<HTMLElement>(null);
  const headingId = useId();

  return (
    <PanelContainerRefContext value={ref}>
      <VStack
        height="100%"
        maxHeight="100%"
        minWidth={minWidth}
        maxWidth={maxWidth}
        position="relative"
        className={FOCUS_INDICATOR_CLASSES}
      >
        <Box
          ref={ref}
          tabIndex={-1}
          background="default"
          shadow="dialog"
          borderRadius="4"
          overflowX="hidden"
          as="section"
          aria-labelledby={heading !== undefined ? headingId : undefined}
          aria-label={ariaLabel}
          height="100%"
          className="scroll-mx-8 focus:outline-none"
        >
          {heading !== undefined ? (
            <Heading level="1" size="medium" spacing id={headingId} className="px-4 pt-4">
              {heading}
            </Heading>
          ) : null}

          {children}
        </Box>
      </VStack>
    </PanelContainerRefContext>
  );
};
