import { Box, type BoxProps, HStack } from '@navikt/ds-react';

export enum FooterType {
  FINISHED = 0,
  UNFINISHED_NO_ERRORS = 1,
  UNFINISHED_WITH_ERRORS = 2,
  SATT_PAA_VENT = 3,
}

const getBorderColor = (type: FooterType) => {
  switch (type) {
    case FooterType.FINISHED:
      return 'success';
    case FooterType.UNFINISHED_NO_ERRORS:
      return 'info';
    case FooterType.UNFINISHED_WITH_ERRORS:
      return 'warning';
    case FooterType.SATT_PAA_VENT:
      return 'neutral';
  }
};

const getBackgroundColor = (type: FooterType): BoxProps['background'] => {
  switch (type) {
    case FooterType.FINISHED:
      return 'success-moderate';
    case FooterType.UNFINISHED_NO_ERRORS:
      return 'info-moderate';
    case FooterType.UNFINISHED_WITH_ERRORS:
      return 'warning-moderate';
    case FooterType.SATT_PAA_VENT:
      return 'neutral-moderate';
  }
};

interface StyledFooterProps {
  type: FooterType;
  children?: React.ReactNode;
}

export const StyledFooter = ({ type, children }: StyledFooterProps) => (
  <HStack
    asChild
    position="sticky"
    left="space-0"
    bottom="space-0"
    align="center"
    justify="space-between"
    gap="space-16"
    paddingInline="space-16"
    paddingBlock="space-8"
    width="100%"
    className="z-23"
  >
    <Box background={getBackgroundColor(type)} borderWidth="1 0 0 0" borderColor={getBorderColor(type)}>
      {children}
    </Box>
  </HStack>
);
