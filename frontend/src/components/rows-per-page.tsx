import { Label, ToggleGroup } from '@navikt/ds-react';
import { useId } from 'react';
import { styled } from 'styled-components';
import { useRestrictedNumberSetting } from '@app/hooks/settings/helpers';
import { PAGE_SIZE_OPTIONS, restrictPageSize } from '@app/hooks/use-oppgave-pagination';
import { pushEvent } from '@app/observability';

interface Props {
  settingKey: string;
  pageSize: number;
  'data-testid': string;
}

export const RowsPerPage = ({ settingKey, pageSize, 'data-testid': testId }: Props) => {
  const id = useId();
  const { value = pageSize, setValue } = useRestrictedNumberSetting(settingKey, restrictPageSize);

  return (
    <StyledRowsPerPage>
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
    </StyledRowsPerPage>
  );
};

const StyledRowsPerPage = styled.div`
  display: flex;
  gap: var(--a-spacing-2);
  align-items: center;
  justify-self: right;
`;
