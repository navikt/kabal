import { Label, VStack } from '@navikt/ds-react';
import {
  SearchableNavEmployeeSelect,
  type SearchableNavEmployeeSelectProps,
} from '@/components/searchable-select/searchable-single-select/searchable-nav-employee-select';

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
