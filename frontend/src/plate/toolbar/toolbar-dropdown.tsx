import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { CaretDownFillIcon } from '@navikt/aksel-icons';
import { Button, HStack, VStack } from '@navikt/ds-react';
import { type ReactNode, useRef, useState } from 'react';

interface Props {
  icon: ReactNode;
  children: ReactNode;
  title: string;
  disabled?: boolean;
}

export const ToolbarDropdown = ({ icon, children, title, disabled }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <div className="relative h-full" ref={ref}>
      <Button
        className="h-full p-1 pr-0"
        onClick={() => setIsOpen(!isOpen)}
        title={title}
        size="small"
        variant={isOpen ? 'primary' : 'tertiary-neutral'}
        onMouseDown={(e) => e.preventDefault()} // Prevents editor from losing focus.
        disabled={disabled}
      >
        <HStack align="center">
          {icon} <CaretDownFillIcon aria-hidden />
        </HStack>
      </Button>

      {isOpen ? <VStack className="absolute right-0 rounded-lg bg-ax-bg-raised shadow-md">{children}</VStack> : null}
    </div>
  );
};
