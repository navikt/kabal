import { Label, ToggleGroup } from '@navikt/ds-react';
import React, { useId } from 'react';
import { styled } from 'styled-components';
import { useNumberSetting } from '@app/hooks/settings/helpers';

interface Props {
  settingKey: string;
  pageSize: number;
  'data-testid': string;
}

export const RowsPerPage = ({ settingKey, pageSize, 'data-testid': testId }: Props) => {
  const id = useId();
  const { value = pageSize, setValue } = useNumberSetting(settingKey);

  return (
    <StyledRowsPerPage>
      <Label id={id} size="small">
        Rader per side
      </Label>
      <ToggleGroup
        value={value.toString(10)}
        onChange={(v) => setValue(Number.parseInt(v, 10))}
        size="small"
        variant="neutral"
        aria-describedby={id}
        data-testid={testId}
      >
        <ToggleGroup.Item value="10" data-value="10">
          10
        </ToggleGroup.Item>
        <ToggleGroup.Item value="20" data-value="20">
          20
        </ToggleGroup.Item>
        <ToggleGroup.Item value="50" data-value="50">
          50
        </ToggleGroup.Item>
        <ToggleGroup.Item value="100" data-value="100">
          100
        </ToggleGroup.Item>
        <ToggleGroup.Item value="-1" data-value="-1">
          Alle
        </ToggleGroup.Item>
      </ToggleGroup>
    </StyledRowsPerPage>
  );
};

const StyledRowsPerPage = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-self: right;
`;
