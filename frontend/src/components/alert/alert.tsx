import type { BoxProps, InlineMessageProps } from '@navikt/ds-react';
import { Box, InlineMessage } from '@navikt/ds-react';

type Variant = InlineMessageProps['status'];

interface AlertProps
  extends Omit<
    BoxProps,
    'background' | 'borderColor' | 'borderWidth' | 'borderRadius' | 'paddingBlock' | 'paddingInline' | 'padding'
  > {
  variant: Variant;
}

const BACKGROUND_MAP: Record<Variant, BoxProps['background']> = {
  info: 'info-soft',
  success: 'success-soft',
  warning: 'warning-soft',
  error: 'danger-soft',
};

const BORDER_COLOR_MAP: Record<Variant, BoxProps['borderColor']> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'danger',
};

export const Alert = ({ variant, children, ...props }: AlertProps) => (
  <Box
    background={BACKGROUND_MAP[variant]}
    borderColor={BORDER_COLOR_MAP[variant]}
    borderWidth="1"
    borderRadius="8"
    paddingBlock="space-12"
    paddingInline="space-16"
    {...props}
  >
    <InlineMessage status={variant} size="small">
      {children}
    </InlineMessage>
  </Box>
);
