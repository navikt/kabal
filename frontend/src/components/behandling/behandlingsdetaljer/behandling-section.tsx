import { Label, VStack } from '@navikt/ds-react';

interface Props {
  label?: string;
  children: React.ReactNode;
}

export const BehandlingSection = ({ label, children }: Props) => {
  if (typeof label === 'undefined') {
    return (
      <VStack marginBlock="space-0 space-1" gap="space-4" className="whitespace-break-spaces">
        {children}
      </VStack>
    );
  }

  return (
    <VStack as="section" gap="space-4" className="whitespace-break-spaces" aria-label={label}>
      <Label size="small">{label}</Label>
      <div>{children}</div>
    </VStack>
  );
};
