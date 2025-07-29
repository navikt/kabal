import { HelpText, type HelpTextProps, HStack } from '@navikt/ds-react';

interface Props {
  children: React.ReactNode;
  helpText: string | undefined;
  placement?: HelpTextProps['placement'];
}

export const ContainerWithHelpText = ({ children, helpText, placement = 'right' }: Props) => (
  <HStack align="center" justify="space-between" gap="2" width="100%" wrap={false}>
    {children}
    {helpText !== undefined ? <HelpText placement={placement}>{helpText}</HelpText> : null}
  </HStack>
);
