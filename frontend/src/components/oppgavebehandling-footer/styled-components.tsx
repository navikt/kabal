import { BoxNew, type BoxNewProps, HStack } from '@navikt/ds-react';

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

const getBackgroundColor = (type: FooterType): BoxNewProps['background'] => {
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
    left="0"
    bottom="0"
    align="center"
    justify="space-between"
    gap="4"
    paddingInline="4"
    paddingBlock="2"
    width="100%"
    className="z-23"
  >
    <BoxNew background={getBackgroundColor(type)} borderWidth="1 0 0 0" borderColor={getBorderColor(type)}>
      {children}
    </BoxNew>
  </HStack>
);
