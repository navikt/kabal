import { Label, VStack } from '@navikt/ds-react';

interface Props {
  label?: string;
  children: React.ReactNode;
  testid?: string;
}

export const BehandlingSection = ({ label, children, testid }: Props) => {
  if (typeof label === 'undefined') {
    return (
      <VStack marginBlock="space-0 space-1" gap="space-4" className="whitespace-break-spaces" data-testid={testid}>
        {children}
      </VStack>
    );
  }

  const id = `behandling-section-${label.toLowerCase().replaceAll(/\s/g, '-')}`;

  return (
    <VStack gap="space-4" className="whitespace-break-spaces" data-testid={testid}>
      <Label htmlFor={id} size="small">
        {label}
      </Label>
      <div id={id}>{children}</div>
    </VStack>
  );
};
