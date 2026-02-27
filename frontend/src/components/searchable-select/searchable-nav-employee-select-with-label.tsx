import {
  SearchableNavEmployeeSelect,
  type SearchableNavEmployeeSelectProps,
} from '@app/components/searchable-select/searchable-nav-employee-select';
import { Label, VStack } from '@navikt/ds-react';

interface SearchableNavEmployeeSelectWithLabelProps extends SearchableNavEmployeeSelectProps {
  size?: 'small' | 'medium';
}

export const SearchableNavEmployeeSelectWithLabel = ({
  label,
  size = 'small',
  ...rest
}: SearchableNavEmployeeSelectWithLabelProps) => (
  <VStack gap="space-4">
    <Label size={size}>{label}</Label>
    <SearchableNavEmployeeSelect label={label} {...rest} />
  </VStack>
);
