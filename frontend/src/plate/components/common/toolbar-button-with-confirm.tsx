import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Box, Button, type ButtonProps, HStack, Tooltip, VStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';

interface Props extends Omit<ButtonProps, 'variant' | 'size'> {
  tooltip: string;
}

export const ToolbarButtonWithConfirm = ({ onClick, icon, tooltip, loading, ...rest }: Props) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setShowConfirm(false));

  return (
    <HStack position="relative" ref={ref} contentEditable={false}>
      <Tooltip content={tooltip} maxChar={Number.POSITIVE_INFINITY} delay={0}>
        <Button
          data-color="neutral"
          {...rest}
          style={showConfirm ? { ...rest.style, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : rest.style}
          icon={icon}
          onClick={() => setShowConfirm(!showConfirm)}
          variant="tertiary"
          size="xsmall"
          loading={loading}
        />
      </Tooltip>
      {showConfirm ? (
        <VStack asChild position="absolute" right="space-0" className="top-full z-1">
          <Box background="neutral-soft" borderRadius="0 0 8 8" shadow="dialog">
            <Tooltip content="Bekreft" delay={0} placement="right">
              <Button
                data-color="neutral"
                icon={<CheckmarkIcon aria-hidden />}
                onClick={onClick}
                variant="tertiary"
                size="xsmall"
                loading={loading}
              />
            </Tooltip>
            <Tooltip content="Avbryt" delay={0} placement="right">
              <Button
                data-color="neutral"
                icon={<XMarkIcon aria-hidden />}
                onClick={() => setShowConfirm(false)}
                variant="tertiary"
                size="xsmall"
                loading={loading}
              />
            </Tooltip>
          </Box>
        </VStack>
      ) : null}
    </HStack>
  );
};
