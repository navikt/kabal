import { Heading, type HeadingProps, HelpText, type HelpTextProps, HStack } from '@navikt/ds-react';

interface Props {
  children: string;
  helpText: string;
  placement?: HelpTextProps['placement'];
  size?: HeadingProps['size'];
}

export const HeadingWithHelpText = ({ children, helpText, size = 'small', placement = 'right' }: Props) => (
  <HStack asChild align="center" gap="2">
    <Heading size={size}>
      {children}
      <HelpText placement={placement}>{helpText}</HelpText>
    </Heading>
  </HStack>
);
