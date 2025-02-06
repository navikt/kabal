import { useRestrictedNumberSetting } from '@app/hooks/settings/helpers';
import { PAGE_SIZE_OPTIONS, restrictPageSize } from '@app/hooks/use-oppgave-pagination';
import { pushEvent } from '@app/observability';
import { HStack, Label, ToggleGroup } from '@navikt/ds-react';
import { useId } from 'react';

interface Props {
  settingKey: string;
  pageSize: number;
  'data-testid': string;
}

export const RowsPerPage = ({ settingKey, pageSize, 'data-testid': testId }: Props) => {
  const id = useId();
  const { value = pageSize, setValue } = useRestrictedNumberSetting(settingKey, restrictPageSize);

  return (
    <HStack align="center" justify="end" gap="2">
      <Label id={id} size="small">
        Rader per side
      </Label>
      <ToggleGroup
        value={value.toString(10)}
        onChange={(v) => {
          pushEvent('change-rows-per-page', 'oppgave-lists', { value: v });
          setValue(Number.parseInt(v, 10));
        }}
        size="small"
        variant="neutral"
        aria-describedby={id}
        data-testid={testId}
      >
        {PAGE_SIZE_OPTIONS.map((option) => (
          <ToggleGroup.Item key={option} value={option} data-value={option}>
            {option}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup>
    </HStack>
  );
};
