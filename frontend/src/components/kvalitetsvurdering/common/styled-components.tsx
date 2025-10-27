import { RadioGroup, type RadioGroupProps } from '@navikt/ds-react';

export const StyledRadioGroup = ({
  ...props
}: Pick<RadioGroupProps, 'children' | 'legend' | 'hideLegend' | 'value' | 'error' | 'onChange' | 'id'>) => (
  <RadioGroup {...props} size="small" className="mb-4" />
);
