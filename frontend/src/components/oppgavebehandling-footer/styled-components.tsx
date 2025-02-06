import { Box, HStack } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const ValidationSummaryContainer = styled.article`
  margin: 0;
  margin-top: 10px;
  padding: 0;
`;

export const StyledFieldList = styled.ul`
  margin: 0;
  padding: 0;
  padding-left: 1em;
`;

export const SectionTitle = styled.h1`
  margin: 0;
  font-size: 18px;
`;

export const StyledSection = styled.section`
  margin-top: 10px;
`;

export const StyledPopup = styled.div`
  position: absolute;
  width: 400px;
  bottom: 100%;
  right: 0;
  margin-bottom: var(--a-spacing-2);
`;

export const StyledButton = styled.button`
  background-color: transparent;
  border: 0;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

export const StyledIconButton = styled(StyledButton)`
  position: absolute;
  right: 0;
  padding: var(--a-spacing-4);
`;

export enum FooterType {
  FINISHED = 0,
  UNFINISHED_NO_ERRORS = 1,
  UNFINISHED_WITH_ERRORS = 2,
  SATT_PAA_VENT = 3,
}

const getBorderColor = (type: FooterType) => {
  switch (type) {
    case FooterType.FINISHED:
      return 'border-success';
    case FooterType.UNFINISHED_NO_ERRORS:
      return 'border-info';
    case FooterType.UNFINISHED_WITH_ERRORS:
      return 'border-warning';
    case FooterType.SATT_PAA_VENT:
      return 'border-default';
  }
};

const getBackgroundColor = (type: FooterType) => {
  switch (type) {
    case FooterType.FINISHED:
      return 'surface-success-subtle';
    case FooterType.UNFINISHED_NO_ERRORS:
      return 'surface-info-subtle';
    case FooterType.UNFINISHED_WITH_ERRORS:
      return 'surface-warning-subtle';
    case FooterType.SATT_PAA_VENT:
      return 'bg-subtle';
  }
};

interface StyledFooterProps {
  $type: FooterType;
  children?: React.ReactNode;
}

export const StyledFooter = ({ $type, children }: StyledFooterProps) => (
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
    <Box background={getBackgroundColor($type)} borderWidth="1 0 0 0" borderColor={getBorderColor($type)}>
      {children}
    </Box>
  </HStack>
);
