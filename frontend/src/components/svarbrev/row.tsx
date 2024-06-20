import { Button, Checkbox, Detail, Skeleton, Table, TextField, Textarea, Tooltip } from '@navikt/ds-react';
import { useState } from 'react';
import { styled } from 'styled-components';
import { Preview, Submit } from '@app/components/svarbrev/preview';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useYtelseName } from '@app/hooks/use-kodeverk-value';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { SvarbrevSetting } from '@app/types/svarbrev';

export const Row = ({
  ytelseId,
  behandlingstidWeeks,
  customText,
  shouldSend,
  modified,
  createdBy,
  id,
}: SvarbrevSetting) => {
  const [ytelseName, isLoading] = useYtelseName(ytelseId);
  const [localBehandlingstidWeeks, setLocalBehandlingstidWeeks] = useState(behandlingstidWeeks);
  const [localCustomText, setLocalCustomText] = useState(customText ?? '');
  const [localShouldSend, setLocalShouldSend] = useState(shouldSend);

  const hasChanges =
    localBehandlingstidWeeks !== behandlingstidWeeks ||
    localCustomText !== (customText ?? '') ||
    localShouldSend !== shouldSend;

  const modalProps = {
    id,
    ytelseId,
    behandlingstidWeeks: localBehandlingstidWeeks,
    customText: localCustomText,
    shouldSend: localShouldSend,
  };

  return (
    <StyledTableRow $hasChanges={hasChanges} $shouldSend={shouldSend}>
      <Table.DataCell>
        <Checkbox checked={localShouldSend} onChange={({ target }) => setLocalShouldSend(target.checked)} hideLabel>
          Aktiv
        </Checkbox>
      </Table.DataCell>

      <Table.DataCell>
        <NoWrap>{isLoading ? <Skeleton /> : ytelseName}</NoWrap>
      </Table.DataCell>

      <Table.DataCell>
        <Weeks>
          <TextField
            size="small"
            type="number"
            inputMode="numeric"
            value={localBehandlingstidWeeks}
            onChange={({ target }) => setLocalBehandlingstidWeeks(parseInt(target.value, 10))}
            label="Saksbehandlingstid"
            hideLabel
            style={{ width: 70 }}
          />
          <WeeksButton weeks={12} onChange={setLocalBehandlingstidWeeks} disabled={localBehandlingstidWeeks === 12} />
          <WeeksButton weeks={15} onChange={setLocalBehandlingstidWeeks} disabled={localBehandlingstidWeeks === 15} />
        </Weeks>
      </Table.DataCell>

      <Table.DataCell>
        <Textarea
          size="small"
          value={localCustomText}
          onChange={({ target }) => setLocalCustomText(target.value)}
          maxRows={1}
          placeholder="Valgfri tekst"
          label="Tekst til svarbrev"
          hideLabel
        />
      </Table.DataCell>

      <Table.DataCell>
        <Tooltip content={`Endret av: ${createdBy.navn}`}>
          <Detail>{isoDateTimeToPretty(modified)}</Detail>
        </Tooltip>
      </Table.DataCell>

      <Table.DataCell>
        <Buttons>
          <Preview {...modalProps} type={SaksTypeEnum.KLAGE} />
          <Preview {...modalProps} type={SaksTypeEnum.ANKE} />
          {hasChanges ? <Submit {...modalProps} /> : null}
        </Buttons>
      </Table.DataCell>
    </StyledTableRow>
  );
};

const WeeksButton = ({
  weeks,
  onChange,
  disabled,
}: {
  weeks: number;
  onChange: (w: number) => void;
  disabled: boolean;
}) => (
  <Button disabled={disabled} size="small" variant="tertiary" onClick={() => onChange(weeks)}>
    <NoWrap>{weeks} uker</NoWrap>
  </Button>
);

const StyledTableRow = styled(Table.Row)<{ $hasChanges: boolean; $shouldSend: boolean }>`
  &&& {
    background-color: ${({ $shouldSend, $hasChanges }) => {
      if ($hasChanges) {
        return 'var(--a-surface-selected)';
      }

      if ($shouldSend) {
        return 'var(--a-surface-success-subtle)';
      }

      return undefined;
    }};

    &:hover {
      background-color: ${({ $shouldSend, $hasChanges }) => {
        if ($hasChanges) {
          return 'var(--a-surface-action-subtle-hover)';
        }

        if ($shouldSend) {
          return 'var(--a-surface-success-subtle-hover)';
        }

        return undefined;
      }};
    }
  }
`;

const Weeks = styled.div`
  display: flex;
  gap: 4px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 4px;
  width: 221px;
`;

const NoWrap = styled.span`
  white-space: nowrap;
`;
